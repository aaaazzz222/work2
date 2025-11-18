const Message = require('../models/Message');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const contactMessage = await Message.create({
      name,
      email,
      message
    });

    res.status(201).json({
      message: 'Message sent successfully',
      data: contactMessage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all messages (for admin)
// @route   GET /api/contact
// @access  Private
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitContactForm,
  getMessages
};
