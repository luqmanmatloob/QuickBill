const mongoose = require('mongoose');

// Define the schema for the items
const itemSchema = new mongoose.Schema({
    orderNumber: String,
    productName: String,
    productCode: String,
    size: String,
    color: String,
    lineQty: Number,
    decorationProcess: String,
    unitPrice: Number,
    lineTotal: Number,
    tax: Number,
    taxExempt: Boolean,
    orderShippingTotal: Number,
    poNumber: String,
    supplierPoNumber: String,
    productionStaffAccount: String,
    storeName: String,
    company: String,
    billingFirstName: String,
    billingLastName: String,
    billingEmailAddress: String,
    billingAddress: String,
    billingCity: String,
    billingState: String,
    billingPostcode: String,
    billingPhoneNo: String,
    shippingFirstName: String,
    shippingLastName: String,
    shippingAddress: String,
    shippingCity: String,
    shippingState: String,
    shippingPostcode: String,
    shippingPhoneNo: String,
    shippingMethod: String,
    designName: String,
    designPrice: Number
});

// Define the schema for the invoice or quote
const invoiceOrQuoteSchema = new mongoose.Schema({
    type: { type: String, enum: ['invoice', 'quote'] }, // Type can be 'invoice' or 'quote'
    orderNumber: String,
    note: String,
    dateOrdered: Date,
    dateDue: Date,
    orderTotal: Number,
    billingCity :String,
    billingAddress : String,
    billingState : String,
    billingEmailAddress : String,
    shippingAddress : String,
    shippingCity : String,
    shippingAddress : String,
    shippingState : String,
    shippingPostcode : String,
    shippingMethod: String,
    paymentMethod: String,
    paymentPaid: Number, 
    paymentDue: Number, 
    payments: [{
        amount: Number,
        date: Date,
        reference: String, //for any credit card or banking information
        note: String,
        otherType: String, //text area for any other type of paymen
        paymentMethod: String, // Payment method specific to each payment
        type: { type: String, enum: ['deposit', 'on delivery', 'other'], default: 'other' } // Add type field
    }], // Array of payments


    


    items: [itemSchema], // Array of items
    uniqueKey: { type: Number, default: 0, unique: true } // Unique key starting from 1
});

// Middleware to generate unique key before saving
invoiceOrQuoteSchema.pre('save', async function(next) {
    try {
        if (!this.uniqueKey) {
            const maxInvoice = await InvoiceOrQuote.findOne({}, {}, { sort: { 'uniqueKey': -1 } });
            const newUniqueKey = maxInvoice ? maxInvoice.uniqueKey + 1 : 1;
            this.uniqueKey = newUniqueKey;
        }
        next();
    } catch (err) {
        next(err);
    }
});

// Create models
const Item = mongoose.model('Item', itemSchema);
const InvoiceOrQuote = mongoose.model('InvoiceOrQuote', invoiceOrQuoteSchema);

module.exports = { Item, InvoiceOrQuote };
