const express = require('express');
const router = express.Router();

const {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  likeBlogPost,
  getCategories,
  getPopularTags
} = require('../controllers/blogController');

const { protect } = require('../middleware/auth');
const { validateBlogPost } = require('../middleware/validation');
const commentRoutes = require('./commentRoutes');

// Re-route into comment routes
router.use('/:postId/comments', commentRoutes);

// Public routes
router.get('/', getBlogPosts);
router.get('/categories', getCategories);
router.get('/tags', getPopularTags);
router.get('/:id', getBlogPost);
router.put('/:id/like', likeBlogPost);

// Protected routes
router.post('/', protect, validateBlogPost, createBlogPost);
router.put('/:id', protect, updateBlogPost);
router.delete('/:id', protect, deleteBlogPost);

module.exports = router;