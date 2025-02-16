const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  bookingDate: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Canceled', 'Rescheduled'], default: 'Pending' },
  notes: { type: String },
  query: { type: mongoose.Schema.Types.ObjectId, ref: 'Query' },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  rescheduledDate: { type: Date },
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;