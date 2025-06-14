Nurse.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const NurseSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  assigned_patients: [{
    type: Schema.Types.ObjectId,
    ref: 'Patient',
  }],
  assigned_doctors: [{
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to doctors
  }],
  task_status_updates: [{
    task_id: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed'],
      required: true,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
    notes: String,
  }],
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

module.exports = mongoose.model('Nurse', NurseSchema);