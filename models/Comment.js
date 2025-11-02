const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Please add comment content'],
    trim: true,
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blogPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BlogPost',
    required: true
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
    default: null
  },
  replies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  isApproved: {
    type: Boolean,
    default: true
  },
  likes: {
    type: Number,
    default: 0
  },
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for getting comments by blog post
commentSchema.index({ blogPost: 1, createdAt: -1 });

// Update blog post comments count when comment is added or removed
commentSchema.post('save', async function() {
  const BlogPost = mongoose.model('BlogPost');
  await BlogPost.findByIdAndUpdate(this.blogPost, {
    $inc: { commentsCount: 1 }
  });
});

commentSchema.post('remove', async function() {
  const BlogPost = mongoose.model('BlogPost');
  await BlogPost.findByIdAndUpdate(this.blogPost, {
    $inc: { commentsCount: -1 }
  });

  // Also remove all replies
  await this.constructor.deleteMany({ parentComment: this._id });
});

module.exports = mongoose.model('Comment', commentSchema);