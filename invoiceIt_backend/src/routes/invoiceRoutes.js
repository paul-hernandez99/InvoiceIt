// invoiceRoutes.js
const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

router.post('/', invoiceController.createInvoice);
router.get('/', invoiceController.getAllInvoices);
router.get('/:invoiceId', invoiceController.getInvoice);
router.get('/user/:userId', invoiceController.getInvoicesByUser);

module.exports = router;
