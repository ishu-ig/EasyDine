const InvoiceRouter = require('express').Router()
const { createProductInvoice } = require('../controllers/InvoiceController');

// POST: Generate Invoice
InvoiceRouter.post('/generate', createProductInvoice);

module.exports = InvoiceRouter;