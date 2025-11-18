const Comment = require('../models/Comment');
const BlogPost = require('../models/BlogPost');

// @desc    Get comments for a blog post
// @route   GET /api/blog/:postId/comments
// @access  Public
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('author', 'username email')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new comment
// @route   POST /api/blog/:postId/comments
// @access  Private
const createComment = async (req, res) => {
  try {
    const { body } = req.body;

    // Check if blog post exists
    const post = await BlogPost.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const comment = await Comment.create({
      body,
      author: req.user._id,
      post: req.params.postId
    });

    const populatedComment = await comment.populate('author', 'username email');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getComments,
  createComment
};
