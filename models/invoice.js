const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  airline: { type: String, required: true },
  flightNumber: { type: String, required: true },
  flightClass: { type: String, required: true },
  departure: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  date: { type: String, required: true },
  seatNumber: { type: String, required: true },
  price: { type: Number, required: true },
  pdfPath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice;