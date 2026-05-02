import Review from './review.model.js';

export const createReviewService = async (userId, data) => {
  const { bookingId, rating, reviewText, routeId } = data;

  // 🔒 STEP 1: check if review already exists
  const existingReview = await Review.findOne({ bookingId });

  if (existingReview) {
    throw new Error('You have already submitted a review for this booking');
  }

  // ✅ STEP 2: create review
  const review = await Review.create({
    userId,
    bookingId,
    routeId,
    rating,
    reviewText
  });

  return review;
};



