const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  message: {
    type: String,
    required: [true, 'Please provide a message']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
