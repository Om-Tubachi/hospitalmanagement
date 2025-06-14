const express = require('express');
const { authenticateToken, requireRole } = require('../middleware/auth');
const {
  getDailyTasks,
  createTask,
  updateTask,
  deleteTask,
  createVitals,
  getPatientVitals,
  updateVitals,
  createMedicalRecord,
  updateMedicalRecord,
  getAssignedPatients,
  getTaskStatusUpdates
} = require('../controllers/nurseController');

const router = express.Router();

// All routes require nurse role
router.use(authenticateToken);
router.use(requireRole(['nurse', 'admin', 'super_admin']));

// TASK MANAGEMENT ROUTES
router.get('/tasks', getDailyTasks);
router.post('/tasks', createTask);
router.put('/tasks/:id', updateTask);
router.delete('/tasks/:id', deleteTask);

// VITALS MANAGEMENT ROUTES
router.post('/vitals', createVitals);
router.get('/vitals/:patientId', getPatientVitals);
router.put('/vitals/:id', updateVitals);

// MEDICAL RECORDS ROUTES (for assisting doctors)
router.post('/medical-records', createMedicalRecord);
router.put('/medical-records/:id', updateMedicalRecord);

// PATIENT MANAGEMENT ROUTES
router.get('/patients', getAssignedPatients);

// REPORTING ROUTES
router.get('/task-status-updates', getTaskStatusUpdates);

module.exports = router;