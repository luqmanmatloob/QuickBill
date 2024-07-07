const path = require('path');
const fs = require('fs');
const { InvoiceOrQuote } = require('../models/invoiceQuote');

// Ensure uploads directory exists
// const uploadsDir = path.join(__dirname, '../uploads');
// if (!fs.existsSync(uploadsDir)){
//     fs.mkdirSync(uploadsDir);
// }

// Helper function to parse numbers
const parseNumber = (value, defaultValue = 0) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
};


// Helper function to parse dates
const parseDate = (dateString, fallbackDate = new Date()) => {
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? fallbackDate : parsedDate;
};




















// exports.createInvoiceQuote = async (req, res) => {
//     try {
//         // Log the request body for debugging
//         console.log(req.body);

//         // Validate the request body (you can use a validation library like Joi for better validation)
//         const { 
//             type, orderNumber, note, dateOrdered, dateDue, orderTotal, items,
//             billingCity, billingAddress, billingState, billingEmailAddress,
//             shippingAddress, shippingCity ,shippingMethod, shippingState, shippingPostcode
//         } = req.body;

//         // Basic validation
//         if (!type || !['invoice', 'quote'].includes(type)) {
//             return res.status(400).send("Invalid type. Must be 'invoice' or 'quote'.");
//         }

//         // Create a new InvoiceOrQuote document
//         const newInvoiceOrQuote = new InvoiceOrQuote({
//             type,
//             orderNumber,
//             note,
//             dateOrdered,
//             dateDue,
//             orderTotal,
//             shippingMethod,
//             billingCity,
//             billingAddress,
//             billingState,
//             billingEmailAddress,
//             shippingAddress,
//             shippingCity, 
//             shippingState,
//             shippingPostcode,
//             items
//         });

//         // Save the document to the database
//         await newInvoiceOrQuote.save();

//         // Send a success response with the created document
//         res.status(201).json({
//             message: "Invoice or quote created successfully",
//             invoiceOrQuote: newInvoiceOrQuote
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("An error occurred while creating the invoice or quote");
//     }
// };






exports.createInvoiceQuote = async (req, res) => {
    try {
        console.log(req.body);

        const { 
            type, orderNumber, note, dateOrdered, dateDue, orderTotal, items,
            billingCity, billingAddress, billingState, billingEmailAddress,
            shippingAddress, shippingCity, shippingMethod, shippingState, shippingPostcode
        } = req.body;

        if (!type || !['invoice', 'quote'].includes(type)) {
            return res.status(400).send("Invalid type. Must be 'invoice' or 'quote'.");
        }

        const newInvoiceOrQuote = new InvoiceOrQuote({
            type,
            orderNumber,
            note,
            dateOrdered,
            dateDue,
            orderTotal,
            shippingMethod,
            billingCity,
            billingAddress,
            billingState,
            billingEmailAddress,
            shippingAddress,
            shippingCity,
            shippingState,
            shippingPostcode,
            items
        });

        await newInvoiceOrQuote.save();

        res.status(201).json({
            message: "Invoice or quote created successfully",
            uniqueKey: newInvoiceOrQuote.uniqueKey,
            invoiceOrQuote: newInvoiceOrQuote
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while creating the invoice or quote");
    }
};























exports.getAllInvoicesQuotes = async (req, res) => {
    try {
        const invoicesQuotes = await InvoiceOrQuote.find()
            .sort({ createdAt: -1 }) // Sort by createdAt field in descending order (newest first)
            .exec();

        res.status(200).json({
            success: true,
            data: invoicesQuotes,
        });
    } catch (error) {
        console.error('Error fetching invoices and quotes:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};






































exports.deleteInvoiceQuote = async (req, res) => {

    const { uniqueKey } = req.body;

    try {
        // Find and delete the invoice or quote by uniqueKey
        const deletedInvoiceQuote = await InvoiceOrQuote.findOneAndDelete({ uniqueKey });

        if (!deletedInvoiceQuote) {
            return res.status(404).json({ success: false, message: 'Invoice or quote not found' });
        }

        res.status(200).json({ success: true, data: deletedInvoiceQuote });
    } catch (error) {
        console.error('Error deleting invoice or quote:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}




















exports.getInvoiceQuoteById = async (req, res) => {
    const { id } = req.params; // id is the uniqueKey in this case

    try {
        const invoiceQuote = await InvoiceOrQuote.findOne({ uniqueKey: id });

        if (!invoiceQuote) {
            return res.status(404).json({ message: 'Invoice or Quote not found' });
        }

        res.json(invoiceQuote);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};









// PUT (update) an invoice or quote by uniqueKey
exports.updateInvoiceQuote = async (req, res) => {
    const { id } = req.params; // id is the uniqueKey in this case
    const updateData = req.body;

    try {
        const updatedInvoiceQuote = await InvoiceOrQuote.findOneAndUpdate(
            { uniqueKey: id },
            updateData,
            { new: true } // Return the updated document
        );

        if (!updatedInvoiceQuote) {
            return res.status(404).json({ message: 'Invoice or Quote not found' });
        }

        res.json(updatedInvoiceQuote);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};








// update/ edit quote base on id (uniquekey)

exports.updateInvoiceQuote = async (req, res) => {
    const { 
        type, orderNumber, note, dateOrdered, dateDue, orderTotal, items,
        billingCity, billingAddress, billingState, billingEmailAddress,
        shippingAddress, shippingCity, shippingState, shippingPostcode
    } = req.body;

    try {
        // Validate the request body (you can use a validation library like Joi for better validation)
        if (!type || !['invoice', 'quote'].includes(type)) {
            return res.status(400).send("Invalid type. Must be 'invoice' or 'quote'.");
        }

        // Find the existing document by uniqueKey (assuming uniqueKey is used as the identifier)
        const existingInvoiceOrQuote = await InvoiceOrQuote.findOne({ uniqueKey: req.params.id });

        if (!existingInvoiceOrQuote) {
            return res.status(404).send("Invoice or quote not found");
        }

        // Update the fields
        existingInvoiceOrQuote.type = type;
        existingInvoiceOrQuote.orderNumber = orderNumber;
        existingInvoiceOrQuote.note = note;
        existingInvoiceOrQuote.dateOrdered = dateOrdered;
        existingInvoiceOrQuote.dateDue = dateDue;
        existingInvoiceOrQuote.orderTotal = orderTotal;
        existingInvoiceOrQuote.billingCity = billingCity;
        existingInvoiceOrQuote.billingAddress = billingAddress;
        existingInvoiceOrQuote.billingState = billingState;
        existingInvoiceOrQuote.billingEmailAddress = billingEmailAddress;
        existingInvoiceOrQuote.shippingAddress = shippingAddress;
        existingInvoiceOrQuote.shippingCity = shippingCity;
        existingInvoiceOrQuote.shippingState = shippingState;
        existingInvoiceOrQuote.shippingPostcode = shippingPostcode;
        existingInvoiceOrQuote.items = items; // Update items array

        // Save the updated document
        await existingInvoiceOrQuote.save();

        // Send a success response with the updated document
        res.status(200).json({
            message: "Invoice or quote updated successfully",
            invoiceOrQuote: existingInvoiceOrQuote
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while updating the invoice or quote");
    }
};







// Controller for getting uploaded invoices by unique keys
exports.getInvoicesByUniqueKeys = async (req, res) => {
    try {
        const { uniqueKeys } = req.body;
        
        if (!uniqueKeys || !Array.isArray(uniqueKeys)) {
            return res.status(400).send("Invalid request. 'uniqueKeys' must be an array.");
        }

        const invoices = await InvoiceOrQuote.find({ uniqueKey: { $in: uniqueKeys } });

        if (!invoices || invoices.length === 0) {
            return res.status(404).send("No invoices found for the provided unique keys.");
        }

        res.status(200).json(invoices);
    } catch (error) {
        console.error("Error retrieving invoices:", error);
        res.status(500).send("An error occurred while retrieving the invoices");
    }
};


// Controller for deleting multiple invoices by unique keys
exports.deleteMultipleInvoices = async (req, res) => {
    try {
      const { uniqueKeys } = req.body;
  
      if (!uniqueKeys || !Array.isArray(uniqueKeys)) {
        return res.status(400).send("Invalid request. 'uniqueKeys' must be an array.");
      }
  
      const result = await InvoiceOrQuote.deleteMany({ uniqueKey: { $in: uniqueKeys } });
  
      if (result.deletedCount === 0) {
        return res.status(404).send("No invoices found for the provided unique keys.");
      }
  
      res.status(200).send(`Deleted ${result.deletedCount} invoices successfully`);
    } catch (error) {
      console.error("Error deleting invoices:", error);
      res.status(500).send("An error occurred while deleting the invoices");
    }
  };
  