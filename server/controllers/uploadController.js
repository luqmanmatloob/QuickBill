const { InvoiceOrQuote } = require('../models/invoiceQuote');

// Function to handle JSON data upload and save data to MongoDB
const uploadCSV = async (req, res) => {
  try {
    const { data } = req.body; // Extract data from request body

    if (!data || !Array.isArray(data) || data.length === 0) {
      return res.status(400).json({ message: 'No data provided' });
    }

    // Map JSON data to Item schema
    const items = data.map((item) => {
      // Ensure taxExempt exists and handle the case when it's not provided correctly
      const taxExempt = item.taxExempt ? item.taxExempt.toLowerCase() === 'true' : false;

      return {
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
        taxExempt: taxExempt,
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
        designPrice: parseFloat(item.designPrice),
      };
    });

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

    res.status(201).json({ message: 'Data uploaded successfully', data: invoiceOrQuote });
  } catch (error) {
    console.error('Error occurred during data upload:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};









module.exports = { uploadCSV };
