const express = require('express');
const { getAllEvents, createEvent, deleteEvent } = require('../controllers/calendarEventsController');
const router = express.Router();

// Route to get all events
router.get('/events', getAllEvents);

// Route to create a new event
router.post('/events', createEvent);

// Route to delete an event
router.delete('/events/:eventId', deleteEvent);

module.exports = router;