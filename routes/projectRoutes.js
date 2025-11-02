const express = require('express');
const router = express.Router();

const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  likeProject,
  getCategories
} = require('../controllers/projectController');

const { protect } = require('../middleware/auth');
const { validateProject } = require('../middleware/validation');

// Public routes
router.get('/', getProjects);
router.get('/categories', getCategories);
router.get('/:id', getProject);
router.put('/:id/like', likeProject);

// Protected routes
router.post('/', protect, validateProject, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

module.exports = router;