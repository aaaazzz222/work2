const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a blog post title']
  },
  content: {
    type: String,
    required: [true, 'Please provide blog post content']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
