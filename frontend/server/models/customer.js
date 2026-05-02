const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true
    },
    phone: {
      type: String,
      default: ''
    },
    googleId: {
      type: String,
      default: ''
    },
    profilePicture: {
      type: String,
      default: ''
    },
    profilepicture: {
      type: String,
      default: ''
    },
    age: {
      type: Number,
      default: null
    },
    gender: {
      type: String,
      default: ''
    },
    dateofbirth: {
      type: String,
      default: ''
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    notificationPreferences: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      },
      promos: {
        type: Boolean,
        default: true
      }
    },
    language: {
      type: String,
      enum: ['en', 'hi'],
      default: 'en'
    },
    pushSubscription: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Customer', customerSchema);
