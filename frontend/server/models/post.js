const mongoose = require('mongoose');

const postCommentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: ''
    },
    userName: {
      type: String,
      default: 'Traveler'
    },
    text: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    userName: {
      type: String,
      default: 'Traveler'
    },
    topic: {
      type: String,
      default: 'travel-advice'
    },
    title: {
      type: String,
      default: '',
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    imageUrl: {
      type: String,
      default: '',
      trim: true
    },
    likeUserIds: {
      type: [String],
      default: []
    },
    comments: {
      type: [postCommentSchema],
      default: []
    },
    reportedByUserIds: {
      type: [String],
      default: []
    },
    reportCount: {
      type: Number,
      default: 0
    },
    isHidden: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Post', postSchema);
