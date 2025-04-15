// const Agent = require('../models/agent');
// const bcrypt = require('bcrypt');

// // Get all agents
// const getAllAgents = async (req, res) => {
//   try {
//     const agents = await Agent.find();
//     res.json(agents);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching agents' });
//   }
// };

// // Add a new agent
// const addAgent = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newAgent = new Agent({ name, email, password: hashedPassword });
//     await newAgent.save();
//     res.status(201).json(newAgent);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// // Get agent activity log
// const getAgentActivityLog = async (req, res) => {
//   try {
//     const { agentId } = req.params;
//     const agent = await Agent.findById(agentId);
//     if (!agent) {
//       return res.status(404).json({ error: 'Agent not found' });
//     }
//     res.json(agent.activityLog);
//   } catch (error) {
//     res.status(500).json({ error: 'Error fetching activity log' });
//   }
// };

// module.exports = {
//   getAllAgents,
//   addAgent,
//   getAgentActivityLog,
// };



const Agent = require('../models/agent');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get all agents
const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find();
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching agents' });
  }
};

// Agent Signup
const addAgent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if agent already exists
    const existingAgent = await Agent.findOne({ email });
    if (existingAgent) {
      return res.status(400).json({ error: 'Agent already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAgent = new Agent({ name, email, password: hashedPassword });

    await newAgent.save();

    res.status(201).json({ message: 'Agent created successfully', agent: newAgent });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Agent Login
const agentLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const agent = await Agent.findOne({ email });

    if (!agent) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, agent.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: agent._id }, process.env.JWT_SECRET || 'secretKey', {
      expiresIn: '7d',
    });

    res.status(200).json({ token, agent });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
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
  agentLogin,
  getAgentActivityLog,
};
