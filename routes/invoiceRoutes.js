const express = require('express');
const { createInvoice, getAllInvoices } = require('../controllers/invoicesController');
const router = express.Router();

router.post('/create', createInvoice);
router.get('/all', getAllInvoices);

module.exports = router;