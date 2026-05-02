const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const verifyToken = require('../middleware/verified');
const { createAndDispatchNotification } = require('../services/notification.service');

router.post('/create', verifyToken, async (req, res) => {
  try {
    const {
      busId,
      seats,
      date,
      passengerDetails = [],
      email = '',
      phoneNumber = '',
      fare = 0,
      bookingDate = '',
      departureDetails = {},
      arrivalDetails = {},
      duration = '',
      isBusinessTravel = false,
      isInsurance = false,
      isCovidDonated = false,
      operatorName = '',
      routeId = ''
    } = req.body;

    const newBooking = new Booking({
      busId,
      seats,
      date,
      customerId: req.user.userId,
      passengerDetails,
      email,
      phoneNumber,
      fare,
      bookingDate,
      departureDetails,
      arrivalDetails,
      duration,
      isBusinessTravel,
      isInsurance,
      isCovidDonated,
      operatorName,
      routeId,
      status: 'upcoming'
    });

    await newBooking.save();

    await createAndDispatchNotification(req.app.get('io'), {
      userId: req.user.userId,
      type: 'booking_confirmation',
      title: 'Booking Confirmed',
      message: `Your booking for bus ${busId} is confirmed.`,
      metadata: {
        bookingId: newBooking._id.toString(),
        busId,
        seats,
        date
      }
    });

    res.status(201).json({newBooking});

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/cancel', verifyToken, async (req, res) => {
  try {
    const { reason = 'Cancelled by user' } = req.body;

    const booking = await Booking.findOne({
      _id: req.params.id,
      customerId: req.user.userId
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = reason;
    await booking.save();

    await createAndDispatchNotification(req.app.get('io'), {
      userId: booking.customerId,
      type: 'booking_cancellation',
      message: 'Booking cancelled',
      metadata: {
        bookingId: booking._id.toString(),
        busId: booking.busId,
        date: booking.date,
        reason
      }
    });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Protected route – My bookings
router.get('/my-bookings', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({
      customerId: req.user.userId
    });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Test route
router.get('/test', (req, res) => {
  res.send('booking route working');
});

let bookedSeats = {};

router.post("/book-seat", (req, res) => {

  const { busId, seats } = req.body;

  if (!bookedSeats[busId]) {
    bookedSeats[busId] = [];
  }

  bookedSeats[busId].push(...seats);

  res.json({
    message: "Seats booked successfully",
    bookedSeats: bookedSeats[busId]
  });

});

router.get("/booked-seats/:busId", (req, res) => {

  const busId = req.params.busId;

  res.json({
    bookedSeats: bookedSeats[busId] || []
  });

});
module.exports = router;
