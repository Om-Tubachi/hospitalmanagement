const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');

const getPatientList = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build search filter
    let searchFilter = {};
    if (search) {
      searchFilter = {
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Get patients who have appointments with this doctor
    const patientsWithAppointments = await Patient.aggregate([
      // Match patients based on search criteria
      ...(Object.keys(searchFilter).length > 0 ? [{ $match: searchFilter }] : []),
      
      // Lookup appointments for this doctor
      {
        $lookup: {
          from: 'appointments',
          let: { patientId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$patient_id', { $toObjectId: '$patientId' }] },
                    { $eq: ['$doctor_id', { $toObjectId: doctorId }] }
                  ]
                }
              }
            }
          ],
          as: 'appointments'
        }
      },
      
      // Only include patients who have appointments with this doctor
      {
        $match: {
          'appointments.0': { $exists: true }
        }
      },
      
      // Add computed fields
      {
        $addFields: {
          total_appointments: { $size: '$appointments' },
          last_appointment: {
            $max: '$appointments.appointment_date'
          }
        }
      },
      
      // Project the fields we want
      {
        $project: {
          id: '$_id',
          first_name: '$firstName',
          last_name: '$lastName',
          email: 1,
          phone: 1,
          date_of_birth: '$dateOfBirth',
          gender: 1,
          medical_history: '$medicalHistory',
          created_at: '$createdAt',
          total_appointments: 1,
          last_appointment: 1
        }
      },
      
      // Sort and paginate
      { $sort: { created_at: -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) }
    ]);

    // Get total count for pagination
    const totalCount = await Patient.aggregate([
      ...(Object.keys(searchFilter).length > 0 ? [{ $match: searchFilter }] : []),
      {
        $lookup: {
          from: 'appointments',
          let: { patientId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$patient_id', '$$patientId'] },
                    { $eq: ['$doctor_id', doctorId] }
                  ]
                }
              }
            }
          ],
          as: 'appointments'
        }
      },
      {
        $match: {
          'appointments.0': { $exists: true }
        }
      },
      {
        $count: 'total'
      }
    ]);

    const total = totalCount.length > 0 ? totalCount[0].total : 0;

    res.json({
      success: true,
      data: {
        patients: patientsWithAppointments,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching patient list:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient list'
    });
  }
};

// Alternative simpler approach if you want all patients assigned to a doctor
const getAssignedPatients = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build search filter
    let searchFilter = { assigned_doctor: doctorId };
    if (search) {
      searchFilter = {
        ...searchFilter,
        $or: [
          { firstName: { $regex: search, $options: 'i' } },
          { lastName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const patients = await Patient.find(searchFilter)
      .select('firstName lastName email phone dateOfBirth gender medicalHistory createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Patient.countDocuments(searchFilter);

    // Transform field names to match your expected output
    const transformedPatients = patients.map(patient => ({
      id: patient._id,
      first_name: patient.firstName,
      last_name: patient.lastName,
      email: patient.email,
      phone: patient.phone,
      date_of_birth: patient.dateOfBirth,
      gender: patient.gender,
      medical_history: patient.medicalHistory,
      created_at: patient.createdAt
    }));

    res.json({
      success: true,
      data: {
        patients: transformedPatients,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching assigned patients:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assigned patients'
    });
  }
};

module.exports = {
  getPatientList,
  getAssignedPatients
};