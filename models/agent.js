const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  performanceStats: {
    queriesOpened: { type: Number, default: 0 },
    queriesResponded: { type: Number, default: 0 },
    bookingsMade: { type: Number, default: 0 },
    invoicesGenerated: { type: Number, default: 0 },
  },
  activityLog: [
    {
      action: { type: String },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const Agent = mongoose.model('Agent', agentSchema);

module.exports = Agent;