const express = require('express');
const router = express.Router();

const {
  createMessage,
  getMessages,
  getMessage,
  markAsRead,
  toggleArchive,
  updatePriority,
  deleteMessage,
  getStats
} = require('../controllers/contactController');

const { protect, authorize } = require('../middleware/auth');
const { validateMessage } = require('../middleware/validation');

// Public route
router.post('/', validateMessage, createMessage);

// Admin only routes
router.get('/', protect, authorize('admin'), getMessages);
router.get('/stats', protect, authorize('admin'), getStats);
router.get('/:id', protect, authorize('admin'), getMessage);
router.put('/:id/read', protect, authorize('admin'), markAsRead);
router.put('/:id/archive', protect, authorize('admin'), toggleArchive);
router.put('/:id/priority', protect, authorize('admin'), updatePriority);
router.delete('/:id', protect, authorize('admin'), deleteMessage);

module.exports = router;