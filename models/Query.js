const mongoose = require('mongoose');

const querySchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  status: {
    type: String,
    default: 'Unassigned',
  },
  notes: [{
    text: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Query', querySchema);