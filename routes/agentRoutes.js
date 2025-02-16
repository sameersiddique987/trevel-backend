const express = require('express');
const { getAllAgents, addAgent, getAgentActivityLog } = require('../controllers/agentsController');
const router = express.Router();

// Route to get all agents
router.get('/agents', getAllAgents);

// Route to add a new agent
router.post('/agents', addAgent);

// Route to get agent activity log
router.get('/agents/:agentId/activity-log', getAgentActivityLog);

module.exports = router;