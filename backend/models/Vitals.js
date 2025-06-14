
// models/Vital.js
const mongoose = require('mongoose');

const vitalSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  nurse_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bloodPressure: {
    systolic: Number,
    diastolic: Number
  },
  heartRate: Number,
  temperature: Number,
  respiratoryRate: Number,
  oxygenSaturation: Number,
  weight: Number,
  height: Number,
  painLevel: {
    type: Number,
    min: 0,
    max: 10
  },
  notes: String,
  recorded_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model('Vital', vitalSchema);