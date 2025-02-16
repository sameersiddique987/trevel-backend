const express = require('express');
const { getAllBookings, createBooking, updateBookingStatus, deleteBooking } = require('../controllers/bookingsController');
const router = express.Router();

// Route to get all bookings
router.get('/bookings', getAllBookings);

// Route to create a new booking
router.post('/bookings', createBooking);

// Route to update booking status
router.put('/bookings/:bookingId', updateBookingStatus);

// Route to delete a booking
router.delete('/bookings/:bookingId', deleteBooking);

module.exports = router;