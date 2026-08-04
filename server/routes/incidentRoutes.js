const express = require('express');
const router = express.Router();
const {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncidentStatus,
} = require('../controllers/incidentController');

// @route   POST /api/incidents
// @desc    Intimate and dispatch emergency services with AI triage
router.post('/', createIncident);

// @route   GET /api/incidents
// @desc    Get all emergency incidents
router.get('/', getIncidents);

// @route   GET /api/incidents/:id
// @desc    Get incident by ID or incidentId
router.get('/:id', getIncidentById);

// @route   PATCH /api/incidents/:id/status
// @desc    Update incident status or responder status
router.patch('/:id/status', updateIncidentStatus);

module.exports = router;
