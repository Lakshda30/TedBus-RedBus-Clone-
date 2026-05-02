const mongoose = require('mongoose');

const paymentAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    email: {
      type: String,
      default: ''
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'inr'
    },
    status: {
      type: String,
      default: 'created'
    },
    provider: {
      type: String,
      default: 'stripe'
    },
    stripeSessionId: {
      type: String,
      default: ''
    },
    razorpayOrderId: {
      type: String,
      default: ''
    },
    razorpayPaymentId: {
      type: String,
      default: ''
    },
    bookingData: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    bookingId: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('PaymentAttempt', paymentAttemptSchema);
