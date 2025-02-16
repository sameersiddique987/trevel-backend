const Query = require('../models/Query');

exports.createQuery = async (req, res) => {
  try {
    const query = new Query(req.body);
    await query.save();
    res.status(201).json(query);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getQueries = async (req, res) => {
  try {
    const queries = await Query.find();
    res.status(200).json(queries);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateQuery = async (req, res) => {
  try {
    const query = await Query.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(query);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addNote = async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);
    query.notes.push({ text: req.body.note });
    await query.save();
    res.status(200).json(query);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};