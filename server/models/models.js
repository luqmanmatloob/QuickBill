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
    dateOrdered: Date,
    dateDue: Date,
    orderTotal: Number,
    items: [itemSchema] // Array of items
});

// Create models
const Item = mongoose.model('Item', itemSchema);
const InvoiceOrQuote = mongoose.model('InvoiceOrQuote', invoiceOrQuoteSchema);

module.exports = { Item, InvoiceOrQuote };
