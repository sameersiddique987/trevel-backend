const express = require('express');
const { createQuery, getQueries, updateQuery, addNote } = require('../controllers/queryController');
const router = express.Router();

router.post('/queries', createQuery);
router.get('/queries', getQueries);
router.put('/queries/:id', updateQuery);
router.post('/queries/:id/note', addNote);

module.exports = router;