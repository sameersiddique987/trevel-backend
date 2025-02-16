const Flight = require('../models/Flight');
const axios = require('axios');

// Get flight details
const getFlightDetails = async (req, res) => {
  try {
    const { airline, departureAirport, arrivalAirport, departureDate, arrivalDate } = req.query;
    let query = {};

    if (airline) {
      query['airline'] = { $regex: airline, $options: 'i' };
    }
    if (departureAirport) {
      query['departure_airport'] = { $regex: departureAirport, $options: 'i' };
    }
    if (arrivalAirport) {
      query['arrival_airport'] = { $regex: arrivalAirport, $options: 'i' };
    }
    if (departureDate) {
      query['departure_time'] = { $gte: new Date(departureDate), $lt: new Date(new Date(departureDate).setDate(new Date(departureDate).getDate() + 1)) };
    }
    if (arrivalDate) {
      query['arrival_time'] = { $gte: new Date(arrivalDate), $lt: new Date(new Date(arrivalDate).setDate(new Date(arrivalDate).getDate() + 1)) };
    }

    const flights = await Flight.find(query).limit(100); // Adjust the query as needed
    res.json({ data: flights });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching flight details' });
  }
};

// Get all flights
const getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find();
    res.status(200).json(flights);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching flights' });
  }
};

// Create a new flight
const createFlight = async (req, res) => {
  try {
    const flight = new Flight({
      ...req.body,
      logoUrl: req.file ? `/uploads/${req.file.filename}` : '',
    });
    await flight.save();
    res.status(201).json(flight);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Fetch flight data from Aviation Stack API
const fetchFlightData = async (req, res) => {
  try {
    const { flight_number } = req.params;
    const response = await axios.get(`http://api.aviationstack.com/v1/flights`, {
      params: {
        access_key: process.env.AVIATION_STACK_API_KEY,
        flight_iata: flight_number,
      },
    });

    const flightData = response.data.data[0];

    const flight = new Flight({
      airline: flightData.airline.name,
      flight_number: flightData.flight.iata || flightData.flight.number,
      departure_airport: flightData.departure.airport,
      arrival_airport: flightData.arrival.airport,
      departure_time: flightData.departure.scheduled,
      arrival_time: flightData.arrival.scheduled,
      status: flightData.flight_status,
      duration: `${Math.floor((new Date(flightData.arrival.scheduled) - new Date(flightData.departure.scheduled)) / (1000 * 60 * 60))}h ${Math.floor(((new Date(flightData.arrival.scheduled) - new Date(flightData.departure.scheduled)) % (1000 * 60 * 60)) / (1000 * 60))}m`,
      logoUrl: `https://logo.clearbit.com/${flightData.airline.name.replace(/\s+/g, '').toLowerCase()}.com`,
      price: 450, // Default price, you can update this based on your logic
    });

    await flight.save();
    res.status(201).json(flight);
  } catch (error) {
    console.error('Error fetching flight data from AviationStack:', error);
    res.status(400).json({ error: error.message });
  }
};

// Update flights from Aviation Stack API
const updateFlightsFromAviationStack = async (req, res) => {
  try {
    const response = await axios.get('https://api.aviationstack.com/v1/flights', {
      params: {
        access_key: process.env.AVIATION_STACK_API_KEY,
        limit: 100,
      },
    });

    const aviationStackData = response.data.data || [];

    const flights = aviationStackData.map((flight) => ({
      airline: flight.airline.name,
      flight_number: flight.flight.iata || flight.flight.number,
      departure_airport: flight.departure.airport,
      arrival_airport: flight.arrival.airport,
      departure_time: flight.departure.scheduled,
      arrival_time: flight.arrival.scheduled,
      status: flight.flight_status,
      duration: `${Math.floor((new Date(flight.arrival.scheduled) - new Date(flight.departure.scheduled)) / (1000 * 60 * 60))}h ${Math.floor(((new Date(flight.arrival.scheduled) - new Date(flight.departure.scheduled)) % (1000 * 60 * 60)) / (1000 * 60))}m`,
      logoUrl: `https://logo.clearbit.com/${flight.airline.name.replace(/\s+/g, '').toLowerCase()}.com`,
      price: 450, // Default price, you can update this based on your logic
    }));

    await Flight.insertMany(flights, { ordered: false });

    res.status(200).json({ message: 'Flights updated successfully' });
  } catch (error) {
    console.error('Error updating flights from AviationStack:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getFlightDetails,
  getAllFlights,
  createFlight,
  fetchFlightData,
  updateFlightsFromAviationStack,
};