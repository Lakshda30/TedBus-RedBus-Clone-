const nodemailer = require('nodemailer');
const webpush = require('web-push');
const Notification = require('../models/notification');
const Customer = require('../models/customer');
const Booking = require('../models/booking');
const { resolveNotificationContent } = require('../notifications/templates');

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:no-reply@redbusclone.local';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
}

const mailTransport = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        : undefined
    })
  : nodemailer.createTransport({ jsonTransport: true });

function isPromotionalType(type) {
  return type === 'promotion' || type === 'offer';
}

async function buildChannelSettings(userId, type, requestedChannels = {}) {
  const customer = await Customer.findById(userId).lean();
  const preferences = customer?.notificationPreferences || {};
  const locale = customer?.language || 'en';
  const promotional = isPromotionalType(type);
  const promosAllowed = promotional ? preferences.promos !== false : true;

  const channels = {
    inApp: requestedChannels.inApp ?? true,
    email: promosAllowed ? (requestedChannels.email ?? preferences.email ?? true) : false,
    push: promosAllowed ? (requestedChannels.push ?? preferences.push ?? true) : false
  };

  return { channels, locale, customer };
}

function buildDeliveryStatus(channels) {
  return {
    inApp: channels.inApp ? 'sent' : 'skipped',
    email: channels.email ? 'pending' : 'skipped',
    push: channels.push ? 'pending' : 'skipped'
  };
}

async function createAndDispatchNotification(io, payload) {
  const { userId, type = 'general', title = '', message, metadata = {}, channels: requestedChannels } = payload;

  if (!userId || !message) {
    throw new Error('userId and message are required to create a notification');
  }

  const { channels, locale, customer } = await buildChannelSettings(userId, type, requestedChannels);
  const content = resolveNotificationContent(locale, type, metadata, { title, message });

  const notification = await Notification.create({
    userId,
    type,
    title: content.title,
    message: content.message,
    channels,
    deliveryStatus: buildDeliveryStatus(channels),
    locale,
    metadata
  });

  if (io && (channels.inApp || channels.push)) {
    // In-app realtime socket delivery
    io.to(String(userId)).emit('notification', notification);
    notification.deliveryStatus.inApp = channels.inApp ? 'sent' : 'skipped';
  }

  if (channels.push && customer?.pushSubscription?.endpoint && VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
    try {
      await webpush.sendNotification(
        customer.pushSubscription,
        JSON.stringify({
          title: content.title || 'Notification',
          message: content.message,
          tag: notification._id?.toString(),
          url: '/notifications'
        })
      );
      notification.deliveryStatus.push = 'sent';
    } catch (error) {
      notification.deliveryStatus.push = 'failed';
      notification.retryCount += 1;
      notification.metadata = {
        ...notification.metadata,
        lastPushError: error.message
      };
    }
  } else if (channels.push) {
    notification.deliveryStatus.push = 'failed';
    notification.retryCount += 1;
    notification.metadata = {
      ...notification.metadata,
      lastPushError: VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY
        ? 'Push subscription not available'
        : 'VAPID keys are not configured'
    };
  }

  if (channels.email && customer?.email) {
    try {
      await mailTransport.sendMail({
        from: process.env.NOTIFICATION_FROM || 'no-reply@redbusclone.local',
        to: customer.email,
        subject: content.title || 'Notification',
        text: content.message
      });
      notification.deliveryStatus.email = 'sent';
    } catch (error) {
      notification.deliveryStatus.email = 'failed';
      notification.retryCount += 1;
      notification.metadata = {
        ...notification.metadata,
        lastEmailError: error.message
      };
    }
  } else if (channels.email) {
    notification.deliveryStatus.email = 'failed';
    notification.retryCount += 1;
    notification.metadata = {
      ...notification.metadata,
      lastEmailError: 'Customer email not available'
    };
  }

  await notification.save();
  return notification;
}

async function retryFailedNotifications(io, maxRetries = 3) {
  const failedNotifications = await Notification.find({
    retryCount: { $lt: maxRetries },
    $or: [
      { 'deliveryStatus.email': 'failed' },
      { 'deliveryStatus.push': 'failed' }
    ]
  }).sort({ createdAt: 1 }).limit(25);

  for (const notification of failedNotifications) {
    const customer = await Customer.findById(notification.userId).lean();

    if (notification.deliveryStatus?.email === 'failed') {
      if (!customer?.email) {
        notification.retryCount += 1;
        notification.metadata = {
          ...notification.metadata,
          lastEmailError: 'Customer email not available'
        };
      } else {
        try {
          await mailTransport.sendMail({
            from: process.env.NOTIFICATION_FROM || 'no-reply@redbusclone.local',
            to: customer.email,
            subject: notification.title || 'Notification',
            text: notification.message
          });
          notification.deliveryStatus.email = 'sent';
        } catch (error) {
          notification.retryCount += 1;
          notification.metadata = {
            ...notification.metadata,
            lastEmailError: error.message
          };
        }
      }
    }

    if (notification.deliveryStatus?.push === 'failed') {
      if (!customer?.pushSubscription?.endpoint || !VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
        notification.retryCount += 1;
        notification.metadata = {
          ...notification.metadata,
          lastPushError: !VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY
            ? 'VAPID keys are not configured'
            : 'Push subscription not available'
        };
      } else {
        try {
          await webpush.sendNotification(
            customer.pushSubscription,
            JSON.stringify({
              title: notification.title || 'Notification',
              message: notification.message,
              tag: notification._id?.toString(),
              url: '/notifications'
            })
          );
          notification.deliveryStatus.push = 'sent';
        } catch (error) {
          notification.retryCount += 1;
          notification.metadata = {
            ...notification.metadata,
            lastPushError: error.message
          };
        }
      }
    }

    await notification.save();

    if (io && notification.channels?.push) {
      io.to(String(notification.userId)).emit('notification', notification);
    }
  }
}

function getPushPublicKey() {
  return VAPID_PUBLIC_KEY;
}
async function sendUpcomingJourneyReminders(io) {
  const now = new Date();
  const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const upcomingBookings = await Booking.find({
    date: {
      $gte: now.toISOString().split('T')[0],
      $lte: next24Hours.toISOString().split('T')[0]
    },
    reminderSentAt: null
  }).limit(25);

  for (const booking of upcomingBookings) {
    await createAndDispatchNotification(io, {
      userId: booking.customerId,
      type: 'journey_reminder',
      message: 'Journey reminder',
      metadata: {
        busId: booking.busId,
        date: booking.date,
        bookingId: booking._id.toString()
      }
    });

    booking.reminderSentAt = new Date();
    await booking.save();
  }
}

module.exports = {
  createAndDispatchNotification,
  retryFailedNotifications,
  sendUpcomingJourneyReminders,
  getPushPublicKey
};
