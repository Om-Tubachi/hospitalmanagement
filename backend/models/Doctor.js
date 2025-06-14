Doctor.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const DoctorSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  patients: [{
    type: Schema.Types.ObjectId,
    ref: 'Patient',
  }],
  appointments: [{
    date: { type: Date, required: true },
    patient_id: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    notes: String,
  }],
  access_rights: {
    view_patients: { type: Boolean, default: true },
    update_treatment: { type: Boolean, default: true },
    view_calendar: { type: Boolean, default: true },
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' 

  },
  nurse_tasks: [{
  nurse_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  patient_id: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
  task_type: {
    type: String,
    enum: ['check_vitals', 'administer_medication', 'monitor_patient', 'report_status'],
    required: true,
  },
  description: String,
  due_time: Date,
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed'],
    default: 'pending',
  },
  created_at: { type: Date, default: Date.now },
  updated_at: Date,
}],
  
});

module.exports = mongoose.model('Doctor', DoctorSchema);