// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  nurse_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model for nurse
    required: true
  },
  doctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model for doctor who assigned the task
    required: true
  },
  task_type: {
    type: String,
    enum: ['check_vitals', 'administer_medication', 'monitor_patient', 'report_status', 'custom'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  due_time: {
    type: Date,
    required: true
  },
  completed_at: Date,
  notes: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

module.exports = mongoose.model('Task', taskSchema);
