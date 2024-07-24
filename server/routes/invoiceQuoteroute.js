const express = require('express');
const {
    createInvoiceQuote,
    updateInvoiceQuote,
    deleteInvoiceQuote,
    getInvoiceQuoteById,
    getAllInvoicesQuotes,
    getInvoicesByUniqueKeys,
    deleteMultipleInvoices,
    getByUniqueKeys,
    

} = require('../controllers/invoiceQuoterouteController');


const router = express.Router();

// Create a new invoice or quote
router.post('/createInvoiceQuote', createInvoiceQuote);

// get all invoices showing list
router.get('/allInvoicesQuotes', getAllInvoicesQuotes);

router.post('/getInvoicesByUniqueKeys', getInvoicesByUniqueKeys);

// Get an invoice or quote by ID
router.get('/:id', getInvoiceQuoteById);

// then after getting editing specific invoice
router.put('/:id', updateInvoiceQuote);

router.delete('/deleteMultipleInvoices', deleteMultipleInvoices);

// Delete an invoice or quote by ID
router.delete('/:id', deleteInvoiceQuote);

router.post('/getByUniqueKeys', getByUniqueKeys )


module.exports = router;
