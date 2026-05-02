import Review from "./review.model.js";
import { createReviewService } from "./review.service.js";
import { isWithin24Hours } from "../../utils/time.util.js";

export const createReview = async (req, res) => {
  try {
    const review = await createReviewService(req.user.id, req.body);
    res.status(201).json({
      message: "Review submitted successfully",
      review
    });
  } catch (err) {
    res.status(400).json({
      message: "Error creating review",
      error: err.message
    });
  }
};

export const editReview = async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (!review)
    return res.status(404).json({ message: "Review not found" });

  if (review.userId.toString() !== req.user.id)
    return res.status(403).json({ message: "Unauthorized" });

  if (!isWithin24Hours(review.createdAt))
    return res.status(403).json({ message: "Edit window expired" });

  review.reviewText = req.body.reviewText;
  await review.save();

  res.json({ success: true, review });
};

export const reportReview = async (req, res) => {
  const review = await Review.findById(req.params.id);

  review.reportedCount += 1;
  if (review.reportedCount >= 3) review.isHidden = true;

  await review.save();
  res.json({ success: true });
};

export const getRouteReviews = async (req, res) => {
  const reviews = await Review.find({
    routeId: req.params.routeId,
    isHidden: false
  }).sort({ createdAt: -1 });

  res.json(reviews);
};

