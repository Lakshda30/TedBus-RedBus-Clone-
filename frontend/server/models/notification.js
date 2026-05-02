const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true,
  },
  type: {
    type: String,
    default: 'general',
  },
  title: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    required: true,
  },
  channels: {
    inApp: { type: Boolean, default: true },
    email: { type: Boolean, default: false },
    push: { type: Boolean, default: false },
  },
  deliveryStatus: {
    inApp: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'skipped'],
      default: 'sent',
    },
    email: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'skipped'],
      default: 'skipped',
    },
    push: {
      type: String,
      enum: ['pending', 'sent', 'failed', 'skipped'],
      default: 'skipped',
    },
  },
  retryCount: {
    type: Number,
    default: 0,
  },
  locale: {
    type: String,
    default: 'en',
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Notification', notificationSchema);
