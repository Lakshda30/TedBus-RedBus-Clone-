const express = require('express');
const router = express.Router();
const Review = require('../models/review.js');
const reviewController = require('../controller/review.controller.js');
const verifyToken = require('../middleware/verified.js');

router.post('/', verifyToken, reviewController.createReview);

router.get('/bus/:busId', async (req, res) => {
  try {
    const { busId } = req.params;

    const reviews = await Review.find({
      busId,
      isHidden: false
    }).sort({ createdAt: -1 });

    const averageRating = reviews.length
      ? Number((reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1))
      : 0;

    res.json({
      count: reviews.length,
      averageRating,
      reviews: reviews.map((review) => ({
        ...review.toObject(),
        isTrustedReviewer: (review.helpfulVotes || 0) >= 3
      }))
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching reviews',
      error: error.message
    });
  }
});

router.patch('/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (String(review.userId) !== String(userId)) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    if (new Date(review.editableUntil).getTime() < Date.now()) {
      return res.status(400).json({ message: 'Review can only be edited within 24 hours' });
    }

    if (typeof req.body.reviewText === 'string') {
      review.reviewText = req.body.reviewText;
    }

    if (typeof req.body.rating === 'number') {
      review.rating = req.body.rating;
    }

    review.editedAt = new Date();
    await review.save();

    res.json({
      message: 'Review updated successfully',
      review
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/report', verifyToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.reportedCount += 1;

    if (review.reportedCount >= 3) {
      review.isHidden = true;
    }

    await review.save();

    res.json({
      message: 'Review reported',
      review
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/:id/helpful', verifyToken, async (req, res) => {
  try {
    const userId = String(req.user.userId || req.user.id);
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.helpfulVoterIds.includes(userId)) {
      return res.status(400).json({ message: 'You already marked this review as helpful' });
    }

    review.helpfulVoterIds.push(userId);
    review.helpfulVotes = review.helpfulVoterIds.length;
    await review.save();

    res.json({
      message: 'Review marked as helpful',
      review
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/booking/:bookingId', async (req, res) => {
  try {
    const review = await Review.findOne({ bookingId: req.params.bookingId, isHidden: false });
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

