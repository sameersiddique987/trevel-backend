const express = require('express');
const {
  getAllAgents,
  agentLogin, 
  getAgentActivityLog,
  addAgent,
} = require('../controllers/agentsController');

const router = express.Router();

// Get all agents
router.get('/agents', getAllAgents);

// Add a new agent (Signup)
router.post('/agents', addAgent);

// Agent login
router.post('/agents/login', agentLogin);

// Get activity log of specific agent
router.get('/agents/:agentId/activity-log', getAgentActivityLog);

module.exports = router;
