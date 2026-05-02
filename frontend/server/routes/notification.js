const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');
const Customer = require('../models/customer');
const {
  createAndDispatchNotification,
  retryFailedNotifications,
  getPushPublicKey
} = require('../services/notification.service');

router.post('/', async (req, res) => {
  try {
    const savedNotification = await createAndDispatchNotification(req.app.get('io'), req.body);
    res.status(201).json(savedNotification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const data = await Notification.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/push-public-key', (req, res) => {
  res.json({
    publicKey: getPushPublicKey() || ''
  });
});

router.patch('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/user/:userId/read-all', async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.params.userId, read: false },
      { $set: { read: true } }
    );

    res.json({
      message: 'Notifications marked as read',
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/promotion/broadcast', async (req, res) => {
  try {
    const {
      title = 'New Offer',
      message = 'A new promotional offer is available for you.',
      offerTitle = '',
      channels = { inApp: true, email: true, push: true }
    } = req.body;

    const eligibleCustomers = await Customer.find({
      'notificationPreferences.promos': true
    }).lean();

    const io = req.app.get('io');
    let sentCount = 0;

    for (const customer of eligibleCustomers) {
      await createAndDispatchNotification(io, {
        userId: customer._id.toString(),
        type: 'promotion',
        title,
        message,
        channels,
        metadata: {
          offerTitle: offerTitle || message
        }
      });
      sentCount += 1;
    }

    res.status(201).json({
      message: 'Promotional notifications sent',
      sentCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/retry-failed', async (req, res) => {
  try {
    await retryFailedNotifications(req.app.get('io'));
    res.json({ message: 'Retry job completed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
