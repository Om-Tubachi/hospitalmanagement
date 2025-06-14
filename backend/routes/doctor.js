const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const {
  getPatientList,
  getAppointmentCalendar,
  updateTreatmentRecord,
  addDiagnosis,
  addPrescription,
  approveAppointment,
  rejectAppointment,
  modifyAppointment,
  assignNurseTask,
  getNurseTasks
} = require('../controllers/doctorController');

const router = express.Router();

// All routes require doctor role
router.use(authenticateToken);
router.use(requireRole(['doctor', 'admin', 'super_admin']));

router.get('/patients', getPatientList);
router.get('/calendar', getAppointmentCalendar);
router.put('/treatment/:patientId', updateTreatmentRecord);
router.post('/diagnosis/:patientId', addDiagnosis);
router.post('/prescription/:patientId', addPrescription);
router.put('/appointments/:id/approve', approveAppointment);
router.put('/appointments/:id/reject', rejectAppointment);
router.put('/appointments/:id/modify', modifyAppointment);
router.post('/nurse-tasks', assignNurseTask);
router.get('/nurse-tasks', getNurseTasks);

module.exports = router;