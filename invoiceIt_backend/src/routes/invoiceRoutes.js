// invoiceRoutes.js
const express = require('express');
const router = express.Router();
const { createInvoice, getAllInvoices, getInvoice, getInvoicesByUser } = require('../controllers/invoiceController')

router.post('/invoices', createInvoice);
router.get('/invoices', getAllInvoices);
router.get('/invoices/:invoiceId', getInvoice);
router.get('/users/:userId/invoices', getInvoicesByUser);


module.exports = router;
