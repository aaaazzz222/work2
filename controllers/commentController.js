const Comment = require('../models/Comment');
const BlogPost = require('../models/BlogPost');

// @desc    Get comments for a blog post
// @route   GET /api/blog/:postId/comments
// @access  Public
const getComments = async (req, res) => {
  try {
    // First check if blog post exists and is published
    const blogPost = await BlogPost.findById(req.params.postId);

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // If user is not admin, only show published posts
    if (!req.user || req.user.role !== 'admin') {
      if (!blogPost.published) {
        return res.status(404).json({
          success: false,
          message: 'Blog post not found'
        });
      }
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const startIndex = (page - 1) * limit;

    // Get top-level comments (no parent)
    const comments = await Comment.find({
      blogPost: req.params.postId,
      parentComment: null,
      isApproved: true
    })
      .populate('author', 'name email avatar')
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: 'name email avatar'
        },
        match: { isApproved: true }
      })
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    // Get total count
    const total = await Comment.countDocuments({
      blogPost: req.params.postId,
      parentComment: null,
      isApproved: true
    });

    res.status(200).json({
      success: true,
      count: comments.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      data: comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create comment
// @route   POST /api/blog/:postId/comments
// @access  Private
const createComment = async (req, res) => {
  try {
    // Check if blog post exists
    const blogPost = await BlogPost.findById(req.params.postId);

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Add blog post and author to request body
    req.body.blogPost = req.params.postId;
    req.body.author = req.user.id;

    // If replying to a comment, validate parent comment exists
    if (req.body.parentComment) {
      const parentComment = await Comment.findById(req.body.parentComment);

      if (!parentComment || parentComment.blogPost.toString() !== req.params.postId) {
        return res.status(400).json({
          success: false,
          message: 'Invalid parent comment'
        });
      }
    }

    const comment = await Comment.create(req.body);

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name email avatar')
      .populate('parentComment', 'content author');

    // If this is a reply, add to parent's replies
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(
        comment.parentComment,
        { $push: { replies: comment._id } }
      );
    }

    res.status(201).json({
      success: true,
      data: populatedComment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update comment
// @route   PUT /api/blog/:postId/comments/:id
// @access  Private
const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if comment belongs to the specified blog post
    if (comment.blogPost.toString() !== req.params.postId) {
      return res.status(400).json({
        success: false,
        message: 'Comment does not belong to this blog post'
      });
    }

    // Check ownership
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this comment'
      });
    }

    // Mark as edited
    req.body.isEdited = true;
    req.body.editedAt = new Date();

    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'name email avatar');

    res.status(200).json({
      success: true,
      data: updatedComment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/blog/:postId/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if comment belongs to the specified blog post
    if (comment.blogPost.toString() !== req.params.postId) {
      return res.status(400).json({
        success: false,
        message: 'Comment does not belong to this blog post'
      });
    }

    // Check ownership
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }

    // If this is a reply, remove from parent's replies
    if (comment.parentComment) {
      await Comment.findByIdAndUpdate(
        comment.parentComment,
        { $pull: { replies: comment._id } }
      );
    }

    await comment.remove();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Like/unlike comment
// @route   PUT /api/blog/:postId/comments/:id/like
// @access  Public
const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Check if comment belongs to the specified blog post
    if (comment.blogPost.toString() !== req.params.postId) {
      return res.status(400).json({
        success: false,
        message: 'Comment does not belong to this blog post'
      });
    }

    // Increment likes (in a real app, you'd track which users liked)
    comment.likes += 1;
    await comment.save();

    res.status(200).json({
      success: true,
      data: {
        likes: comment.likes
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment
};