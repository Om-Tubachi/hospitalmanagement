// models/MedicalRecord.js
const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  visit_date: {
    type: Date,
    default: Date.now
  },
  diagnosis: {
    primary: String,
    secondary: [String]
  },
  symptoms: [String],
  treatment: String,
  notes: String,
  attachments: [{
    fileName: String,
    filePath: String,
    fileType: String,
    upload_date: {
      type: Date,
      default: Date.now
    }
  }],
  vitals: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vital'
  },
  prescriptions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prescription'
  }],
  follow_up_date: Date,
  status: {
    type: String,
    enum: ['draft', 'completed', 'reviewed'],
    default: 'draft'
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);