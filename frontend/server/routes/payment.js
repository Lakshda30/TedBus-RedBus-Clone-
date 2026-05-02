const express = require('express');
const crypto = require('crypto');
const Stripe = require('stripe');
const Razorpay = require('razorpay');

const Booking = require('../models/booking');
const PaymentAttempt = require('../models/paymentAttempt');
const verifyToken = require('../middleware/verified');
const { createAndDispatchNotification } = require('../services/notification.service');

const router = express.Router();

router.get('/config', (_req, res) => {
  res.json({
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY),
    razorpayConfigured: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
  });
});

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY || '';
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(secretKey);
}

function getClientUrl(req) {
  return process.env.CLIENT_URL || req.headers.origin || 'http://localhost:4200';
}

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID || '';
  const keySecret = process.env.RAZORPAY_KEY_SECRET || '';

  if (!keyId || !keySecret) {
    throw new Error('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not configured');
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret
  });
}

function createBookingNotificationPayload(booking) {
  return {
    userId: booking.customerId,
    type: 'booking_confirmation',
    title: 'Booking Confirmed',
    message: `Your booking for bus ${booking.busId} is confirmed.`,
    metadata: {
      bookingId: booking._id.toString(),
      busId: booking.busId,
      seats: booking.seats,
      date: booking.date
    }
  };
}

function buildBookingFromAttempt(bookingData, userId, referenceId, provider) {
  return {
    busId: bookingData.busId || '',
    seats: bookingData.seats || [],
    date: bookingData.date || '',
    customerId: userId,
    passengerDetails: bookingData.passengerDetails || [],
    email: bookingData.email || '',
    phoneNumber: bookingData.phoneNumber || '',
    fare: Number(bookingData.fare || 0),
    bookingDate: bookingData.bookingDate || '',
    departureDetails: bookingData.departureDetails || {},
    arrivalDetails: bookingData.arrivalDetails || {},
    duration: bookingData.duration || '',
    isBusinessTravel: bookingData.isBusinessTravel === true,
    isInsurance: bookingData.isInsurance === true,
    isCovidDonated: bookingData.isCovidDonated === true,
    operatorName: bookingData.operatorName || '',
    routeId: bookingData.routeId || '',
    status: 'upcoming',
    paymentStatus: 'paid',
    paymentProvider: provider,
    paymentReference: referenceId
  };
}

router.post('/checkout-session', verifyToken, async (req, res) => {
  try {
    const stripe = getStripeClient();
    const booking = req.body?.booking || {};
    const amount = Number(booking.fare || 0);

    if (!booking.busId || !Array.isArray(booking.seats) || !booking.seats.length || amount <= 0) {
      return res.status(400).json({ error: 'Incomplete booking payload for payment' });
    }

    const attempt = await PaymentAttempt.create({
      userId: req.user.userId,
      email: booking.email || req.user.email || '',
      amount,
      bookingData: booking,
      status: 'created',
      provider: 'stripe'
    });

    const departureCity = booking.departureDetails?.city || 'Departure';
    const arrivalCity = booking.arrivalDetails?.city || 'Arrival';
    const clientUrl = getClientUrl(req);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: booking.email || req.user.email || undefined,
      success_url: `${clientUrl}/payment?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/payment?payment=cancelled`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'inr',
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: `${booking.operatorName || 'Bus booking'} ticket`,
              description: `${departureCity} to ${arrivalCity} | Seats: ${booking.seats.join(', ')}`
            }
          }
        }
      ],
      metadata: {
        paymentAttemptId: String(attempt._id),
        userId: String(req.user.userId),
        busId: String(booking.busId || '')
      }
    });

    attempt.stripeSessionId = session.id;
    await attempt.save();

    res.json({
      sessionId: session.id,
      url: session.url
    });
  } catch (error) {
    console.error('Stripe checkout session error', error);
    res.status(500).json({ error: error.message || 'Unable to create checkout session' });
  }
});

router.post('/confirm-session', verifyToken, async (req, res) => {
  try {
    const stripe = getStripeClient();
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const attempt = await PaymentAttempt.findOne({
      stripeSessionId: sessionId,
      userId: req.user.userId
    });

    if (!attempt) {
      return res.status(404).json({ error: 'Payment attempt not found' });
    }

    if (session.payment_status !== 'paid') {
      attempt.status = session.payment_status || 'failed';
      await attempt.save();
      return res.status(400).json({ error: 'Payment is not completed yet' });
    }

    if (attempt.bookingId) {
      const existingBooking = await Booking.findById(attempt.bookingId).lean();
      return res.json({
        success: true,
        booking: existingBooking
      });
    }

    const bookingPayload = buildBookingFromAttempt(attempt.bookingData || {}, req.user.userId, sessionId, 'stripe');
    const booking = await Booking.create(bookingPayload);

    attempt.status = 'paid';
    attempt.bookingId = String(booking._id);
    await attempt.save();

    await createAndDispatchNotification(req.app.get('io'), createBookingNotificationPayload(booking));

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Stripe confirmation error', error);
    res.status(500).json({ error: error.message || 'Unable to confirm payment session' });
  }
});

router.post('/razorpay-order', verifyToken, async (req, res) => {
  try {
    const razorpay = getRazorpayClient();
    const booking = req.body?.booking || {};
    const amount = Number(booking.fare || 0);

    if (!booking.busId || !Array.isArray(booking.seats) || !booking.seats.length || amount <= 0) {
      return res.status(400).json({ error: 'Incomplete booking payload for payment' });
    }

    const attempt = await PaymentAttempt.create({
      userId: req.user.userId,
      email: booking.email || req.user.email || '',
      amount,
      bookingData: booking,
      status: 'created',
      provider: 'razorpay'
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `booking_${String(attempt._id).slice(-10)}`,
      notes: {
        paymentAttemptId: String(attempt._id),
        busId: String(booking.busId || '')
      }
    });

    attempt.razorpayOrderId = order.id;
    await attempt.save();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay order creation error', error);
    res.status(500).json({ error: error.message || 'Unable to create Razorpay order' });
  }
});

router.post('/razorpay-verify', verifyToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {};
    const secret = process.env.RAZORPAY_KEY_SECRET || '';

    if (!secret) {
      return res.status(500).json({ error: 'RAZORPAY_KEY_SECRET is not configured' });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Incomplete Razorpay payment data' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Razorpay payment signature verification failed' });
    }

    const attempt = await PaymentAttempt.findOne({
      razorpayOrderId: razorpay_order_id,
      userId: req.user.userId
    });

    if (!attempt) {
      return res.status(404).json({ error: 'Payment attempt not found' });
    }

    if (attempt.bookingId) {
      const existingBooking = await Booking.findById(attempt.bookingId).lean();
      return res.json({
        success: true,
        booking: existingBooking
      });
    }

    const bookingPayload = buildBookingFromAttempt(
      attempt.bookingData || {},
      req.user.userId,
      razorpay_payment_id,
      'razorpay'
    );
    const booking = await Booking.create(bookingPayload);

    attempt.status = 'paid';
    attempt.razorpayPaymentId = razorpay_payment_id;
    attempt.bookingId = String(booking._id);
    await attempt.save();

    await createAndDispatchNotification(req.app.get('io'), createBookingNotificationPayload(booking));

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Razorpay verification error', error);
    res.status(500).json({ error: error.message || 'Unable to verify Razorpay payment' });
  }
});

module.exports = router;
