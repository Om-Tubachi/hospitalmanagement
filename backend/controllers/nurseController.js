// controllers/nurseController.js
const Task = require('../models/Task');
const Vital = require('../models/Vital');
const Patient = require('../models/Patient');
const MedicalRecord = require('../models/MedicalRecord');
const Nurse = require('../models/Nurse');
const Doctor = require('../models/Doctor');

// TASK MANAGEMENT
exports.getDailyTasks = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const tasks = await Task.find({
      nurse_id: userId,
      due_time: {
        $gte: today,
        $lt: tomorrow
      }
    })
    .populate('patient_id', 'firstName lastName roomNumber')
    .populate('doctor_id', 'firstName lastName')
    .sort({ priority: -1, due_time: 1 });

    res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching daily tasks',
      error: error.message
    });
  }
};

exports.createTask = async (req, res) => {
  try {
    const taskData = {
      ...req.body,
      nurse_id: req.user.id
    };

    const task = await Task.create(taskData);
    await task.populate([
      { path: 'patient_id', select: 'firstName lastName roomNumber' },
      { path: 'doctor_id', select: 'firstName lastName' }
    ]);

    // Update nurse's task status tracking
    await Nurse.findOneAndUpdate(
      { user_id: req.user.id },
      {
        $push: {
          task_status_updates: {
            task_id: task._id,
            status: 'pending',
            updated_at: new Date(),
            notes: 'Task created'
          }
        }
      }
    );

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating task',
      error: error.message
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.status === 'completed') {
      updateData.completed_at = new Date();
    }

    const task = await Task.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'patient_id', select: 'firstName lastName roomNumber' },
      { path: 'doctor_id', select: 'firstName lastName' }
    ]);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Update nurse's task status tracking
    await Nurse.findOneAndUpdate(
      { user_id: req.user.id },
      {
        $push: {
          task_status_updates: {
            task_id: task._id,
            status: updateData.status || task.status,
            updated_at: new Date(),
            notes: updateData.notes || 'Task updated'
          }
        }
      }
    );

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating task',
      error: error.message
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const task = await Task.findByIdAndDelete(id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Update nurse's task status tracking
    await Nurse.findOneAndUpdate(
      { user_id: req.user.id },
      {
        $push: {
          task_status_updates: {
            task_id: task._id,
            status: 'cancelled',
            updated_at: new Date(),
            notes: 'Task deleted'
          }
        }
      }
    );

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting task',
      error: error.message
    });
  }
};

// VITALS MANAGEMENT
exports.createVitals = async (req, res) => {
  try {
    const vitalData = {
      ...req.body,
      nurse_id: req.user.id
    };

    const vital = await Vital.create(vitalData);
    await vital.populate('patient_id', 'firstName lastName');

    res.status(201).json({
      success: true,
      data: vital
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error recording vitals',
      error: error.message
    });
  }
};

exports.getPatientVitals = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { limit = 10, page = 1 } = req.query;

    const vitals = await Vital.find({ patient_id: patientId })
      .populate('nurse_id', 'firstName lastName')
      .sort({ recorded_at: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Vital.countDocuments({ patient_id: patientId });

    res.status(200).json({
      success: true,
      data: vitals,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching vitals',
      error: error.message
    });
  }
};

exports.updateVitals = async (req, res) => {
  try {
    const { id } = req.params;
    
    const vital = await Vital.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('patient_id', 'firstName lastName');

    if (!vital) {
      return res.status(404).json({
        success: false,
        message: 'Vital record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vital
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating vitals',
      error: error.message
    });
  }
};

// ASSIST DOCTOR INPUTS
exports.createMedicalRecord = async (req, res) => {
  try {
    const recordData = {
      ...req.body,
      doctor_id: req.body.doctor_id || req.user.id
    };

    const record = await MedicalRecord.create(recordData);
    await record.populate('patient_id', 'firstName lastName');

    res.status(201).json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating medical record',
      error: error.message
    });
  }
};

exports.updateMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    
    const record = await MedicalRecord.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('patient_id', 'firstName lastName');

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: record
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating medical record',
      error: error.message
    });
  }
};

// Get assigned patients for nurse
exports.getAssignedPatients = async (req, res) => {
  try {
    const nurse = await Nurse.findOne({ user_id: req.user.id })
      .populate('assigned_patients', 'firstName lastName roomNumber phoneNumber');

    if (!nurse) {
      return res.status(404).json({
        success: false,
        message: 'Nurse profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: nurse.assigned_patients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching assigned patients',
      error: error.message
    });
  }
};

// Get task status updates for reporting
exports.getTaskStatusUpdates = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const nurse = await Nurse.findOne({ user_id: req.user.id })
      .populate('task_status_updates.task_id');

    if (!nurse) {
      return res.status(404).json({
        success: false,
        message: 'Nurse profile not found'
      });
    }

    let updates = nurse.task_status_updates;

    if (startDate || endDate) {
      updates = updates.filter(update => {
        const updateDate = new Date(update.updated_at);
        if (startDate && updateDate < new Date(startDate)) return false;
        if (endDate && updateDate > new Date(endDate)) return false;
        return true;
      });
    }

    res.status(200).json({
      success: true,
      data: updates.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching task status updates',
      error: error.message
    });
  }
};