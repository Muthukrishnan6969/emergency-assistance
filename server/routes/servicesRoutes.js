const express = require('express');
const router = express.Router();
const { getNearbyServices } = require('../controllers/servicesController');

router.get('/nearby', getNearbyServices);

module.exports = router;
