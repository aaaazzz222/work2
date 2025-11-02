const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment');

// @desc    Get all blog posts
// @route   GET /api/blog
// @access  Public
const getBlogPosts = async (req, res) => {
  try {
    // Build query
    let query = { published: true };

    // If user is admin, show all posts
    if (req.user && req.user.role === 'admin') {
      query = {};
    }

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter by author
    if (req.query.author) {
      query.author = req.query.author;
    }

    // Search by text
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }

    // Filter by tags
    if (req.query.tags) {
      const tags = req.query.tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tags };
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    // Execute query
    const blogPosts = await BlogPost.find(query)
      .populate('author', 'name email avatar bio')
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    // Get total count
    const total = await BlogPost.countDocuments(query);

    res.status(200).json({
      success: true,
      count: blogPosts.length,
      total,
      pagination: {
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      data: blogPosts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single blog post
// @route   GET /api/blog/:id
// @access  Public
const getBlogPost = async (req, res) => {
  try {
    let query = { _id: req.params.id };

    // If user is not admin, only show published posts
    if (!req.user || req.user.role !== 'admin') {
      query.published = true;
    }

    const blogPost = await BlogPost.findOne(query)
      .populate('author', 'name email avatar bio')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name email avatar'
        },
        match: { isApproved: true }
      });

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Increment views
    blogPost.views += 1;
    await blogPost.save();

    res.status(200).json({
      success: true,
      data: blogPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new blog post
// @route   POST /api/blog
// @access  Private
const createBlogPost = async (req, res) => {
  try {
    // Add author to request body
    req.body.author = req.user.id;

    // Calculate read time (average reading speed: 200 words per minute)
    const wordCount = req.body.content.split(/\s+/).length;
    req.body.readTime = Math.ceil(wordCount / 200);

    const blogPost = await BlogPost.create(req.body);

    const populatedBlogPost = await BlogPost.findById(blogPost._id)
      .populate('author', 'name email avatar');

    res.status(201).json({
      success: true,
      data: populatedBlogPost
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update blog post
// @route   PUT /api/blog/:id
// @access  Private
const updateBlogPost = async (req, res) => {
  try {
    let blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Check ownership
    if (blogPost.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this blog post'
      });
    }

    // Recalculate read time if content is updated
    if (req.body.content) {
      const wordCount = req.body.content.split(/\s+/).length;
      req.body.readTime = Math.ceil(wordCount / 200);
    }

    blogPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('author', 'name email avatar');

    res.status(200).json({
      success: true,
      data: blogPost
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete blog post
// @route   DELETE /api/blog/:id
// @access  Private
const deleteBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Check ownership
    if (blogPost.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this blog post'
      });
    }

    // Delete all comments associated with this blog post
    await Comment.deleteMany({ blogPost: blogPost._id });

    // Delete the blog post
    await blogPost.remove();

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Like/unlike blog post
// @route   PUT /api/blog/:id/like
// @access  Public
const likeBlogPost = async (req, res) => {
  try {
    const blogPost = await BlogPost.findById(req.params.id);

    if (!blogPost) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Increment likes (in a real app, you'd track which users liked)
    blogPost.likes += 1;
    await blogPost.save();

    res.status(200).json({
      success: true,
      data: {
        likes: blogPost.likes
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get blog categories
// @route   GET /api/blog/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await BlogPost.distinct('category');

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get popular tags
// @route   GET /api/blog/tags
// @access  Public
const getPopularTags = async (req, res) => {
  try {
    const tags = await BlogPost.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    res.status(200).json({
      success: true,
      data: tags
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  likeBlogPost,
  getCategories,
  getPopularTags
};