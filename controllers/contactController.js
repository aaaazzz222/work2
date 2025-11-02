const Message = require('../models/Message');

// @desc    Create a contact message
// @route   POST /api/contact
// @access  Public
const createMessage = async (req, res) => {
  try {
    // Add client information
    req.body.ipAddress = req.ip || req.connection.remoteAddress;
    req.body.userAgent = req.get('User-Agent');

    const message = await Message.create(req.body);

    res.status(201).json({
      success: true,
      data: message,
      message: 'Message sent successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all messages (admin only)
// @route   GET /api/contact
// @access  Private/Admin
const getMessages = async (req, res) => {
  try {
    // Build query
    const query = {};

    // Filter by read status
    if (req.query.isRead !== undefined) {
      query.isRead = req.query.isRead === 'true';
    }

    // Filter by archived status
    if (req.query.isArchived !== undefined) {
      query.isArchived = req.query.isArchived === 'true';
    }

    // Filter by priority
    if (req.query.priority) {
      query.priority = req.query.priority;
    }

    // Filter by source
    if (req.query.source) {
      query.source = req.query.source;
    }

    // Search by text
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    // Execute query
    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    // Get total count
    const total = await Message.countDocuments(query);

    res.status(200).json({
      success: true,
      count: messages.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single message
// @route   GET /api/contact/:id
// @access  Private/Admin
const getMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    res.status(200).json({
      success: true,
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark message as read
// @route   PUT /api/contact/:id/read
// @access  Private/Admin
const markAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.isRead = true;
    await message.save();

    res.status(200).json({
      success: true,
      data: message,
      message: 'Message marked as read'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Archive/unarchive message
// @route   PUT /api/contact/:id/archive
// @access  Private/Admin
const toggleArchive = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.isArchived = !message.isArchived;
    await message.save();

    const action = message.isArchived ? 'archived' : 'unarchived';

    res.status(200).json({
      success: true,
      data: message,
      message: `Message ${action} successfully`
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update message priority
// @route   PUT /api/contact/:id/priority
// @access  Private/Admin
const updatePriority = async (req, res) => {
  try {
    const { priority } = req.body;

    if (!['low', 'normal', 'high', 'urgent'].includes(priority)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid priority level'
      });
    }

    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    message.priority = priority;
    await message.save();

    res.status(200).json({
      success: true,
      data: message,
      message: 'Message priority updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    await message.remove();

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get message statistics
// @route   GET /api/contact/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    const totalMessages = await Message.countDocuments();
    const unreadMessages = await Message.countDocuments({ isRead: false });
    const archivedMessages = await Message.countDocuments({ isArchived: true });

    const priorityStats = await Message.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);

    const sourceStats = await Message.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalMessages,
        unreadMessages,
        archivedMessages,
        priorityStats,
        sourceStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createMessage,
  getMessages,
  getMessage,
  markAsRead,
  toggleArchive,
  updatePriority,
  deleteMessage,
  getStats
};