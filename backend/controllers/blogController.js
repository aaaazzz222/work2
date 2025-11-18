const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment');

// @desc    Get all blog posts
// @route   GET /api/blog
// @access  Public
const getBlogPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().populate('author', 'username email').sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single blog post
// @route   GET /api/blog/:id
// @access  Public
const getBlogPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id).populate('author', 'username email');

    if (post) {
      // Get comments for this post
      const comments = await Comment.find({ post: req.params.id })
        .populate('author', 'username email')
        .sort({ createdAt: -1 });

      res.json({
        ...post.toObject(),
        comments
      });
    } else {
      res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new blog post
// @route   POST /api/blog
// @access  Private
const createBlogPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    const post = await BlogPost.create({
      title,
      content,
      author: req.user._id
    });

    const populatedPost = await post.populate('author', 'username email');
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update blog post
// @route   PUT /api/blog/:id
// @access  Private
const updateBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (post) {
      // Check if user is the author
      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this post' });
      }

      post.title = req.body.title || post.title;
      post.content = req.body.content || post.content;

      const updatedPost = await post.save();
      const populatedPost = await updatedPost.populate('author', 'username email');
      res.json(populatedPost);
    } else {
      res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete blog post
// @route   DELETE /api/blog/:id
// @access  Private
const deleteBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (post) {
      // Check if user is the author
      if (post.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this post' });
      }

      // Delete all comments associated with this post
      await Comment.deleteMany({ post: req.params.id });

      await post.deleteOne();
      res.json({ message: 'Blog post and associated comments removed' });
    } else {
      res.status(404).json({ message: 'Blog post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
};
