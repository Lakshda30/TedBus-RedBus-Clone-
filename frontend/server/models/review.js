const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customers',
      required: true
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true
    },
    busId: {
      type: String,
      required: true
    },
    routeId: {
      type: String,
      default: ''
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },

    reviewText: {
      type: String,
      minlength: 20,
      required: true
    },
    editableUntil: {
      type: Date,
      required: true
    },
    editedAt: {
      type: Date,
      default: null
    },
    helpfulVotes: {
      type: Number,
      default: 0
    },
    helpfulVoterIds: {
      type: [String],
      default: []
    },
    reportedCount: {
      type: Number,
      default: 0
    },
    isHidden: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('review', reviewSchema);

