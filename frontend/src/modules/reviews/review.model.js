import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    required: true
  },

  journeyId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Booking',
  required: true
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

  upvotes: {
    type: Number,
    default: 0
  },

  reportedCount: {
    type: Number,
    default: 0
  },

  isHidden: {
    type: Boolean,
    default: false
  }

}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
