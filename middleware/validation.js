const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({
      success: false,
      message: errorMessages.join(', ')
    });
  }
  next();
};

// User registration validation
const validateUserRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot be more than 50 characters'),

  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Password is required'),

  handleValidationErrors
];

// Project validation
const validateProject = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot be more than 100 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Project description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot be more than 2000 characters'),

  body('imageUrl')
    .isURL()
    .withMessage('Please provide a valid image URL'),

  body('technologies')
    .isArray()
    .withMessage('Technologies must be an array'),

  body('category')
    .isIn(['web', 'mobile', 'desktop', 'ai/ml', 'other'])
    .withMessage('Invalid category'),

  handleValidationErrors
];

// Blog post validation
const validateBlogPost = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Blog post title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot be more than 200 characters'),

  body('content')
    .trim()
    .notEmpty()
    .withMessage('Blog post content is required'),

  body('category')
    .isIn(['technology', 'web-dev', 'programming', 'tutorials', 'personal', 'other'])
    .withMessage('Invalid category'),

  handleValidationErrors
];

// Comment validation
const validateComment = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Comment content is required')
    .isLength({ max: 1000 })
    .withMessage('Comment cannot be more than 1000 characters'),

  handleValidationErrors
];

// Message validation
const validateMessage = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot be more than 50 characters'),

  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),

  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ max: 100 })
    .withMessage('Subject cannot be more than 100 characters'),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ max: 2000 })
    .withMessage('Message cannot be more than 2000 characters'),

  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateProject,
  validateBlogPost,
  validateComment,
  validateMessage,
  handleValidationErrors
};