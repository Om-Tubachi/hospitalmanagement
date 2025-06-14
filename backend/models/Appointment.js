const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  appointment_date: {
    type: Date,
    required: true,
  },
  time_slot: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  type: {
    type: String,
    enum: ['consultation', 'follow-up', 'emergency'],
    required: true,
  },
  notes: String,
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

module.exports = mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);