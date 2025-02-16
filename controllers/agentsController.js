const Agent = require('../models/agent');
const bcrypt = require('bcrypt');

// Get all agents
const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find();
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching agents' });
  }
};

// Add a new agent
const addAgent = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAgent = new Agent({ name, email, password: hashedPassword });
    await newAgent.save();
    res.status(201).json(newAgent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get agent activity log
const getAgentActivityLog = async (req, res) => {
  try {
    const { agentId } = req.params;
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    res.json(agent.activityLog);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching activity log' });
  }
};

module.exports = {
  getAllAgents,
  addAgent,
  getAgentActivityLog,
};