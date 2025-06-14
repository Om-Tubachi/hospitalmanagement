// controllers/patientViewController.js
const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');

// PRESCRIPTION MANAGEMENT
exports.getMyPrescriptions = async (req, res) => {
  try {
    const patientId = req.user.patientId || req.user.id;
    const { status = 'active' } = req.query;

    const prescriptions = await Prescription.find({ 
      patient_id: patientId,
      ...(status !== 'all' && { status })
    })
    .populate('doctor_id', 'firstName lastName specialization')
    .sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      data: prescriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching prescriptions',
      error: error.message
    });
  }
};

exports.getPrescriptionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const patientId = req.user.patientId || req.user.id;

    const prescription = await Prescription.findOne({
      _id: id,
      patient_id: patientId
    }).populate('doctor_id', 'firstName lastName specialization');

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    res.status(200).json({
      success: true,
      data: prescription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching prescription details',
      error: error.message
    });
  }// controllers/patientViewController.js
const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');

// PRESCRIPTION MANAGEMENT
exports.getMyPrescriptions = async (req, res) => {
  try {
    const patientId = req.user.patientId || req.user.id;
    const { status = 'active' } = req.query;

    const prescriptions = await Prescription.find({ 
      patientId,
      ...(status !== 'all' && { status })
    })
    .populate('doctorId', 'firstName lastName specialization')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: prescriptions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching prescriptions',
      error: error.message
    });
  }
};

exports.getPrescriptionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const patientId = req.user.patientId || req.user.id;

    const prescription = await Prescription.findOne({
      _id: id,
      patientId
    }).populate('doctorId', 'firstName lastName specialization');

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    res.status(200).json({
      success: true,
      data: prescription
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching prescription details',
      error: error.message
    });
  }
};

// APPOINTMENT MANAGEMENT
exports.getMyAppointments = async (req, res) => {
  try {
    const patientId = req.user.patientId || req.user.id;
    const { status, upcoming } = req.query;
    
    let query = { patientId };
    
    if (status) {
      query.status = status;
    }
    
    if (upcoming === 'true') {
      query.appointmentDate = { $gte: new Date() };
    }

    const appointments = await Appointment.find(query)
      .populate('doctorId', 'firstName lastName specialization')
      .sort({ appointmentDate: 1 });

    res.status(200).json({
      success: true,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
};

exports.bookAppointment = async (req, res) => {
  try {
    const appointmentData = {
      ...req.body,
      patientId: req.user.patientId || req.user.id,
      status: 'scheduled'
    };

    // Check for conflicting appointments
    const conflictingAppointment = await Appointment.findOne({
      doctorId: appointmentData.doctorId,
      appointmentDate: appointmentData.appointmentDate,
      status: { $nin: ['cancelled', 'completed'] }
    });

    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    const appointment = await Appointment.create(appointmentData);
    await appointment.populate('doctorId', 'firstName lastName specialization');

    res.status(201).json({
      success: true,
      data: appointment,
      message: 'Appointment booked successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error booking appointment',
      error: error.message
    });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const patientId = req.user.patientId || req.user.id;
    
    // Patients can only update certain fields
    const allowedUpdates = ['reason', 'notes'];
    const updateData = {};
    
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, patientId },
      updateData,
      { new: true, runValidators: true }
    ).populate('doctorId', 'firstName lastName specialization');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating appointment',
      error: error.message
    });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const patientId = req.user.patientId || req.user.id;
    
    const appointment = await Appointment.findOneAndUpdate(
      { 
        _id: id, 
        patientId,
        status: { $nin: ['completed', 'cancelled'] }
      },
      { 
        status: 'cancelled',
        cancelledAt: new Date(),
        cancellationReason: req.body.reason || 'Cancelled by patient'
      },
      { new: true }
    ).populate('doctorId', 'firstName lastName specialization');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found or cannot be cancelled'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error cancelling appointment',
      error: error.message
    });
  }
};

// MEDICAL RECORDS MANAGEMENT
exports.getMyMedicalRecords = async (req, res) => {
  try {
    const patientId = req.user.patientId || req.user.id;
    const { limit = 10, page = 1, startDate, endDate } = req.query;

    let query = { patientId };
    
    if (startDate || endDate) {
      query.visitDate = {};
      if (startDate) query.visitDate.$gte = new Date(startDate);
      if (endDate) query.visitDate.$lte = new Date(endDate);
    }

    const records = await MedicalRecord.find(query)
      .populate('doctorId', 'firstName lastName specialization')
      .populate('prescriptions')
      .sort({ visitDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MedicalRecord.countDocuments(query);

    res.status(200).json({
      success: true,
      data: records,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching medical records',
      error: error.message
    });
  }
};

exports.getMedicalRecordDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const patientId = req.user.patientId || req.user.id;

    const record = await MedicalRecord.findOne({
      _id: id,
      patientId
    })
    .populate('doctorId', 'firstName lastName specialization')
    .populate('prescriptions')
    .populate('vitals');

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
    res.status(500).json({
      success: false,
      message: 'Error fetching medical record details',
      error: error.message
    });
  }
};

exports.downloadMedicalRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const patientId = req.user.patientId || req.user.id;

    const record = await MedicalRecord.findOne({
      _id: id,
      patientId
    })
    .populate('doctorId', 'firstName lastName specialization')
    .populate('prescriptions')
    .populate('vitals')
    .populate('patientId', 'firstName lastName dateOfBirth');

    if (!record) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    // Generate PDF or formatted document
    // You would implement PDF generation here using libraries like puppeteer or pdfkit
    
    res.status(200).json({
      success: true,
      data: record,
      message: 'Medical record ready for download',
      downloadUrl: `/api/patient/medical-records/${id}/pdf` // Implement PDF endpoint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error preparing medical record for download',
      error: error.message
    });
  }
}}