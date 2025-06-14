const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const {
  getMyNotifications,
  markAsRead,
  createNotification,
  deleteNotification
} = require('../controllers/notificationController');

const router = express.Router();

router.use(authenticateToken);

router.get('/', getMyNotifications);
router.put('/:id/read', markAsRead);
router.post('/', createNotification);
router.delete('/:id', deleteNotification);

module.exports = router;