const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  airline: String,
  flight_number: String,
  departure_airport: String,
  arrival_airport: String,
  departure_time: Date,
  arrival_time: Date,
  status: String,
  duration: String,
  logoUrl: String,
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Flight = mongoose.model('Flight', flightSchema);

module.exports = Flight;