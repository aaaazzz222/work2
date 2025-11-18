const express = require('express');
const router = express.Router();
const {
  getBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
} = require('../controllers/blogController');
const { getComments, createComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

// Blog post routes
router.route('/').get(getBlogPosts).post(protect, createBlogPost);
router.route('/:id').get(getBlogPostById).put(protect, updateBlogPost).delete(protect, deleteBlogPost);

// Comment routes
router.route('/:postId/comments').get(getComments).post(protect, createComment);

module.exports = router;
