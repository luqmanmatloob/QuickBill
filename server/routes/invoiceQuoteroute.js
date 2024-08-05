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
    updatePayments,
    deletePayments,
    

} = require('../controllers/invoiceQuoterouteController');


const router = express.Router();

// Create a new invoice or quote (save 1/2)
router.post('/createInvoiceQuote', createInvoiceQuote);

// get all invoices showing list
router.get('/allInvoicesQuotes', getAllInvoicesQuotes);


router.post('/getInvoicesByUniqueKeys', getInvoicesByUniqueKeys);

// Get an invoice or quote by ID
router.get('/:id', getInvoiceQuoteById);

// then after getting editing specific invoice (save 2/2)
router.put('/:id', updateInvoiceQuote);

router.delete('/deleteMultipleInvoices', deleteMultipleInvoices);

// Delete an invoice or quote by ID
router.delete('/:id', deleteInvoiceQuote);


router.post('/getByUniqueKeys', getByUniqueKeys )

// Route to update payments
router.post('/updatePayments', updatePayments);

// Route to delete payments
router.delete('/deletePayments', deletePayments);





module.exports = router;
