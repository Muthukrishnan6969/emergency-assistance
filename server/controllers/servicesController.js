const Hospital = require('../models/Hospital');
const PoliceStation = require('../models/PoliceStation');
const FireStation = require('../models/FireStation');

// @desc    Get nearby emergency services
// @route   GET /api/services/nearby?lat=...&lng=...&radius=...
// @access  Public
const getNearbyServices = async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);
    // Default radius: 10 km
    const radius = parseFloat(req.query.radius) || 10000;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    const query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat],
          },
          $maxDistance: radius,
        },
      },
    };

    const [hospitals, policeStations, fireStations] = await Promise.all([
      Hospital.find(query).lean(),
      PoliceStation.find(query).lean(),
      FireStation.find(query).lean(),
    ]);

    // Format data to add a type field for the frontend
    const formatData = (data, type) => data.map(item => ({ ...item, type }));

    const allServices = [
      ...formatData(hospitals, 'hospital'),
      ...formatData(policeStations, 'police'),
      ...formatData(fireStations, 'fire')
    ];

    res.json(allServices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getNearbyServices,
};
