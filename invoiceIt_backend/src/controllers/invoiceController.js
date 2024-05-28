// invoiceController.js
const invoiceService = require('../services/invoiceService');

exports.createInvoice = async (req, res, next) => {
    try {
        const { user, products, totalAmount, date } = req.body; // Added date
        const invoice = await invoiceService.createInvoice(user, products, totalAmount, date); // Pass date
        res.status(invoice.status).json(invoice.body);
    } catch (error) {
        next(error);
    }
};

exports.getInvoicesByUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const invoices = await invoiceService.findInvoicesByUser(userId);
        res.status(200).json(invoices);
    } catch (error) {
        next(error);
    }
};

exports.getInvoicesByUserAndDateRange = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const { startDate, endDate } = req.query;
        const invoices = await invoiceService.findInvoicesByUserAndDateRange(userId, startDate, endDate);
        res.status(200).json(invoices);
    } catch (error) {
        next(error);
    }
};

exports.getAllInvoices = async (req, res, next) => {
    try {
        const invoices = await invoiceService.findAllInvoices();
        res.status(200).json(invoices);
    } catch (error) {
        next(error);
    }
};

exports.getInvoice = async (req, res, next) => {
    try {
        const invoiceId = req.params.invoiceId;
        const invoice = await invoiceService.findInvoiceById(invoiceId);
        res.status(200).json(invoice);
    } catch (error) {
        next(error);
    }
};

