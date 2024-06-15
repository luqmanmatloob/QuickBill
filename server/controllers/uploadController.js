const csv = require('csv-parser');
const fs = require('fs');
const { Item, InvoiceOrQuote } = require('../models/invoiceQuote'); // Adjust the path as needed

// Function to handle CSV file upload and save data to MongoDB
const uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        // Map CSV data to Item schema
        const items = results.map((item) => ({
          orderNumber: item.orderNumber,
          productName: item.productName,
          productCode: item.productCode,
          size: item.size,
          color: item.color,
          lineQty: parseInt(item.lineQty),
          decorationProcess: item.decorationProcess,
          unitPrice: parseFloat(item.unitPrice),
          lineTotal: parseFloat(item.lineTotal),
          tax: parseFloat(item.tax),
          taxExempt: item.taxExempt.toLowerCase() === 'true',
          orderShippingTotal: parseFloat(item.orderShippingTotal),
          poNumber: item.poNumber,
          supplierPoNumber: item.supplierPoNumber,
          productionStaffAccount: item.productionStaffAccount,
          storeName: item.storeName,
          company: item.company,
          billingFirstName: item.billingFirstName,
          billingLastName: item.billingLastName,
          billingEmailAddress: item.billingEmailAddress,
          billingAddress: item.billingAddress,
          billingCity: item.billingCity,
          billingState: item.billingState,
          billingPostcode: item.billingPostcode,
          billingPhoneNo: item.billingPhoneNo,
          shippingFirstName: item.shippingFirstName,
          shippingLastName: item.shippingLastName,
          shippingAddress: item.shippingAddress,
          shippingCity: item.shippingCity,
          shippingState: item.shippingState,
          shippingPostcode: item.shippingPostcode,
          shippingPhoneNo: item.shippingPhoneNo,
          shippingMethod: item.shippingMethod,
          designName: item.designName,
          designPrice: parseFloat(item.designPrice)
        }));

        // Create new InvoiceOrQuote document
        const invoiceOrQuote = new InvoiceOrQuote({
          type: req.body.type, // Assuming 'type' is passed in the request body
          orderNumber: req.body.orderNumber,
          note: req.body.note,
          dateOrdered: req.body.dateOrdered,
          dateDue: req.body.dateDue,
          orderTotal: parseFloat(req.body.orderTotal),
          items: items,
        });

        // Save the document to MongoDB
        await invoiceOrQuote.save();

        // Clean up: delete uploaded file
        fs.unlinkSync(req.file.path);

        res.status(201).json({ message: 'CSV file uploaded successfully', data: invoiceOrQuote });
      });
  } catch (error) {
    console.error('Error occurred during CSV upload:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { uploadCSV };
