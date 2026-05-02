const express = require('express');
const router = express.Router();
const Bus = require('../models/bus');
const Booking = require('../models/booking');
const { createAndDispatchNotification } = require('../services/notification.service');

router.get('/', async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/schedule', async (req, res) => {
  try {
    const { departureTime, arrivalTime, note = '', effectiveDate = '' } = req.body;

    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    if (departureTime !== undefined) {
      bus.departureTime = departureTime;
    }

    if (arrivalTime !== undefined) {
      bus.arrivalTime = arrivalTime;
    }

    bus.scheduleUpdatedAt = new Date();
    bus.scheduleNote = note;
    await bus.save();

    const activeBookings = await Booking.find({
      busId: String(bus._id),
      status: { $ne: 'cancelled' }
    });

    for (const booking of activeBookings) {
      await createAndDispatchNotification(req.app.get('io'), {
        userId: booking.customerId,
        type: 'schedule_change',
        message: 'Schedule updated',
        metadata: {
          bookingId: booking._id.toString(),
          busId: String(bus._id),
          departureTime: bus.departureTime,
          arrivalTime: bus.arrivalTime,
          effectiveDate: effectiveDate || booking.date,
          note
        }
      });

      booking.scheduleChangeNotifiedAt = new Date();
      await booking.save();
    }

    res.json({
      bus,
      notifiedBookings: activeBookings.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
