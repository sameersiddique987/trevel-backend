const express = require('express');
const multer = require('multer');
const { getFlightDetails, createFlight, fetchFlightData, updateFlightsFromAviationStack, getAllFlights } = require('../controllers/flightsController');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

// Route to fetch flight details
router.get('/details', getFlightDetails);

// Route to create a new flight
router.post('/create', upload.single('logo'), createFlight);

// Route to fetch flight data from Aviation Stack API
router.get('/fetch/:flight_number', fetchFlightData);

// Route to update flights from Aviation Stack API
router.put('/update', updateFlightsFromAviationStack);

// Route to fetch all flights
router.get('/all', getAllFlights);

module.exports = router;