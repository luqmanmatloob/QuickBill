const express = require('express');
const {
    createInvoiceQuoteroute,
    getInvoiceQuoterouteById,
    updateInvoiceQuoteroute,
    deleteInvoiceQuoteroute
} = require('../controllers/invoiceQuoterouteController.js');

const router = express.Router();

// Create a new invoice or quote
router.post('/', createInvoiceQuoteroute);

// Get an invoice or quote by ID
router.get('/:id', getInvoiceQuoterouteById);

// Update an invoice or quote by ID
router.put('/:id', updateInvoiceQuoteroute);

// Delete an invoice or quote by ID
router.delete('/:id', deleteInvoiceQuoteroute);

module.exports = router;
