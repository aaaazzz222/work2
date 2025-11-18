const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a project title']
  },
  description: {
    type: String,
    required: [true, 'Please provide a project description']
  },
  imageUrl: {
    type: String
  },
  repoUrl: {
    type: String
  },
  liveUrl: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
