const mongoose = require('mongoose');
const { Schema } = mongoose;

const PatientSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  patient_id: {
    type: String,
    required: true,
    unique: true,
  },
  assigned_doctor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  assigned_nurses: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  medical_history: [{
    date: { type: Date, default: Date.now },
    diagnosis: { type: String, required: true },
    treatment: { type: String, required: true },
    prescription: String,
    doctor_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    notes: String,
  }],
  vitals: [{
    date: { type: Date, default: Date.now },
    blood_pressure: { type: String, required: true },
    temperature: { type: Number, required: true },
    heart_rate: { type: Number, required: true },
    nurse_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    notes: String,
  }],
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

module.exports = mongoose.model('Patient', PatientSchema);