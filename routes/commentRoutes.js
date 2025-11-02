const express = require('express');
const router = express.Router();

const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment
} = require('../controllers/commentController');

const { protect } = require('../middleware/auth');
const { validateComment } = require('../middleware/validation');

// Public routes
router.get('/', getComments);
router.put('/:id/like', likeComment);

// Protected routes
router.post('/', protect, validateComment, createComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);

module.exports = router;