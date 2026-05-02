const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  busId: String,
  seats: mongoose.Schema.Types.Mixed,
  date: String,
  customerId: String,
  passengerDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: []
  },
  email: {
    type: String,
    default: ''
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  fare: {
    type: Number,
    default: 0
  },
  bookingDate: {
    type: String,
    default: ''
  },
  departureDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  arrivalDetails: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  duration: {
    type: String,
    default: ''
  },
  isBusinessTravel: {
    type: Boolean,
    default: false
  },
  isInsurance: {
    type: Boolean,
    default: false
  },
  isCovidDonated: {
    type: Boolean,
    default: false
  },
  operatorName: {
    type: String,
    default: ''
  },
  routeId: {
    type: String,
    default: ''
  },
  paymentStatus: {
    type: String,
    default: 'pending'
  },
  paymentProvider: {
    type: String,
    default: ''
  },
  paymentReference: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'upcoming'
  },
  cancelledAt: {
    type: Date,
    default: null
  },
  cancellationReason: {
    type: String,
    default: ''
  },
  scheduleChangeNotifiedAt: {
    type: Date,
    default: null
  },
  reminderSentAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Booking', bookingSchema);
