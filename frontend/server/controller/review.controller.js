const Review = require('../models/review');
const Booking = require('../models/booking');
const Customer = require('../models/customer');

exports.createReview = async (req, res) => {
  try {
    const { bookingId, rating, reviewText } = req.body;
    const userId = req.user.userId || req.user.id;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (String(booking.customerId) !== String(userId)) {
      return res.status(403).json({
        message: 'You can only review your own completed journey'
      });
    }

    if (String(booking.status).toLowerCase() !== 'completed') {
      return res.status(400).json({
        message: 'Review allowed only after journey completion'
      });
    }

    const customer = await Customer.findById(userId).lean();
    if (!customer || customer.isVerified === false) {
      return res.status(403).json({
        message: 'Only verified users can submit reviews'
      });
    }

    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({
        message: 'You already reviewed this journey'
      });
    }

    const review = await Review.create({
      userId,
      bookingId,
      busId: booking.busId,
      routeId: booking.routeId || booking.busId || '',
      rating,
      reviewText,
      editableUntil: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    res.status(201).json({
      message: 'Review submitted successfully',
      review
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error creating review',
      error: error.message
    });
  }
};
