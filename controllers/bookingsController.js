const Booking = require('../models/booking');

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('query');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bookings' });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, rescheduledDate } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    booking.status = status;
    if (status === 'Rescheduled') {
      booking.rescheduledDate = rescheduledDate;
    }
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Error updating booking status' });
  }
};

exports.deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    await Booking.findByIdAndDelete(bookingId);
    res.status(200).json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting booking' });
  }
};