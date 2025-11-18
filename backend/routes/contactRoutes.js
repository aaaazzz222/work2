const express = require('express');
const router = express.Router();
const { submitContactForm, getMessages } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(submitContactForm).get(protect, getMessages);

module.exports = router;
