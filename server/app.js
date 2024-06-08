const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { Item, InvoiceOrQuote } = require('./models/models'); // Adjust the path if models.js is in a different directory

const app = express();
const PORT = 3001;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/invoiceDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Middleware
app.use(express.static('public')); // Serve static files from the public folder
app.use(fileUpload()); // Middleware for handling file uploads

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
}

// Helper function to parse dates
const parseDate = (dateString, fallbackDate = new Date()) => {
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? fallbackDate : parsedDate;
};

// Helper function to parse numbers
const parseNumber = (value, defaultValue = 0) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
};

// Route to handle file upload
app.post('/upload', async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let csvFile = req.files.csvFile;
    let filePath = path.join(uploadsDir, csvFile.name);

    try {
        await csvFile.mv(filePath);

        let orders = {};

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => {
                const orderNumber = data['Order Number'];
                if (!orders[orderNumber]) {
                    orders[orderNumber] = {
                        type: 'invoice', // or 'quote', you might want to determine this based on your data
                        orderNumber: data['Order Number'],
                        dateOrdered: parseDate(data['Date Ordered']),
                        dateDue: parseDate(data['Date Due']),
                        orderTotal: parseNumber(data['Order Total']),
                        items: []
                    };
                }

                const item = {
                    orderNumber: data['Order Number'],
                    productName: data['Product Name'],
                    productCode: data['Product Code'],
                    size: data['Size'],
                    color: data['Color'],
                    lineQty: parseNumber(data['Line Qty']),
                    decorationProcess: data['Decoration Process'],
                    unitPrice: parseNumber(data['Unit Price']),
                    lineTotal: parseNumber(data['Line Total']),
                    tax: parseNumber(data['Tax']),
                    taxExempt: data['Tax Exempt'] === 'Yes',
                    orderShippingTotal: parseNumber(data['Order Shipping Total']),
                    poNumber: data['PO Number'],
                    supplierPoNumber: data['Supplier PO Number'],
                    productionStaffAccount: data['Production Staff Account'],
                    storeName: data['Store Name'],
                    company: data['Company'],
                    billingFirstName: data['Billing First Name'],
                    billingLastName: data['Billing Last Name'],
                    billingEmailAddress: data['Billing Email Address'],
                    billingAddress: data['Billing Address'],
                    billingCity: data['Billing City'],
                    billingState: data['Billing State'],
                    billingPostcode: data['Billing Postcode/zip'],
                    billingPhoneNo: data['Billing Phone No.'],
                    shippingFirstName: data['Shipping First Name'],
                    shippingLastName: data['Shipping Last Name'],
                    shippingAddress: data['Shipping Address'],
                    shippingCity: data['Shipping City'],
                    shippingState: data['Shipping State'],
                    shippingPostcode: data['Shipping Postcode/zip'],
                    shippingPhoneNo: data['Shipping Phone No.'],
                    shippingMethod: data['Shipping Method'],
                    designName: data['Design Name'],
                    designPrice: parseNumber(data['Design Price'])
                };

                orders[orderNumber].items.push(item);
            })
            .on('end', async () => {
                try {
                    const invoicesOrQuotes = Object.values(orders);
                    await InvoiceOrQuote.insertMany(invoicesOrQuotes);
                    res.send('File uploaded and data saved to the database!');
                } catch (err) {
                    res.status(500).send(err);
                }
            });
    } catch (err) {
        res.status(500).send(err);
    }
});




app.get('/invoice/:invoiceNumber', async (req, res) => {
  const invoiceNumber = req.params.invoiceNumber;

  try {
      // Retrieve the invoice data from the database based on the invoice number
      const invoice = await InvoiceOrQuote.findOne({ orderNumber: invoiceNumber });

      if (!invoice) {
          return res.status(404).send('Invoice not found');
      }

      // Format the invoice data into the desired format
      const formattedInvoice = {
          invoiceNumber: invoice.orderNumber,
          dateOrdered: invoice.dateOrdered,
          dateDue: invoice.dateDue,
          total: invoice.orderTotal,
          items: invoice.items.map(item => ({
              productName: item.productName,
              quantity: item.lineQty,
              unitPrice: item.unitPrice,
              totalPrice: item.lineTotal
          }))
      };

      // Send the formatted invoice data as a response
      res.json(formattedInvoice);
  } catch (err) {
      res.status(500).send(err);
  }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);


});
