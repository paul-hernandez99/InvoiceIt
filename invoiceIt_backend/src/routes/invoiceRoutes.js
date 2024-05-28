// invoiceRoutes.js
const express = require('express');
const router = express.Router();
const { createInvoice, getAllInvoices, getInvoice, getInvoicesByUser } = require('../controllers/invoiceController');

router.post('/invoice', createInvoice);
router.get('/invoices', getAllInvoices);
router.get('/invoices/:invoiceId', getInvoice);
router.get('/invoices/users/:userId', getInvoicesByUser);

module.exports = router;
