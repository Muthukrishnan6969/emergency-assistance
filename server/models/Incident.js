const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema(
  {
    incidentId: {
      type: String,
      required: true,
      unique: true,
    },
    emergencyType: {
      type: String,
      required: true,
      enum: ['medical', 'fire', 'accident', 'crime', 'hazard', 'other'],
      default: 'medical',
    },
    severity: {
      type: String,
      required: true,
      enum: ['CRITICAL', 'URGENT', 'STANDARD'],
      default: 'CRITICAL',
    },
    description: {
      type: String,
      default: '',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    address: {
      type: String,
      default: 'Unknown location',
    },
    callerContact: {
      name: { type: String, default: 'Emergency Caller' },
      phone: { type: String, default: '' },
    },
    intimatedServices: [
      {
        serviceType: { type: String, enum: ['ambulance', 'fire', 'police', 'hospital'] },
        name: { type: String, required: true },
        phone: { type: String, default: '' },
        distanceKm: { type: Number, default: 0 },
        intimationStatus: {
          type: String,
          enum: ['intimated', 'acknowledged', 'dispatched', 'en_route', 'arrived'],
          default: 'intimated',
        },
        etaMinutes: { type: Number, default: 5 },
      },
    ],
    triageDetails: {
      aiAssessment: { type: String, default: '' },
      recommendedActions: [{ type: String }],
      requiredUnits: [{ type: String }],
    },
    status: {
      type: String,
      enum: ['pending', 'active', 'responders_dispatched', 'resolved', 'cancelled'],
      default: 'active',
    },
  },
  { timestamps: true }
);

incidentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Incident', incidentSchema);
