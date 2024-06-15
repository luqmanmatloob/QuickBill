const express = require('express');
const {
    createInvoiceQuote,
    updateInvoiceQuote,
    deleteInvoiceQuote,
    getInvoiceQuoteById,
    getAllInvoicesQuotes,
    

} = require('../controllers/invoiceQuoterouteController');


const router = express.Router();

// Create a new invoice or quote
router.post('/createInvoiceQuote', createInvoiceQuote);



// get all invoices showing list
router.get('/allInvoicesQuotes', getAllInvoicesQuotes);



// Get an invoice or quote by ID
router.get('/:id', getInvoiceQuoteById);



// then after getting editing specific invoice
router.put('/:id', updateInvoiceQuote);



// Delete an invoice or quote by ID
router.delete('/:id', deleteInvoiceQuote);













module.exports = router;
