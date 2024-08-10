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
    designPrice: Number,

    
    sQty: Number,
    sPrice: Number,
    sTotal: Number,

    mQty: Number,
    mPrice: Number,
    mTotal: Number,

    lQty: Number,
    lPrice: Number,
    lTotal: Number,

    xlQty: Number,
    xlPrice: Number,
    xlTotal: Number,

    "2xlQty": Number,
    "2xlPrice": Number,
    "2xlTotal": Number,

    "3xlQty": Number,
    "3xlPrice": Number,
    "3xlTotal": Number,

    "4xlQty": Number,
    "4xlPrice": Number,
    "4xlTotal": Number,

    "5xlQty": Number,
    "5xlPrice": Number,
    "5xlTotal": Number



});

// Define the schema for the invoice or quote
const invoiceOrQuoteSchema = new mongoose.Schema({
    type: String, 
    orderNumber: String,
    note: String,
    dateOrdered: Date,
    dateDue: Date,
    orderTotal: Number,
    billingFirstName: String,
    billingLastName: String,
    billingCity :String,
    billingAddress : String,
    billingState : String,
    billingEmailAddress : String,
    shippingFirstName: String,
    shippingLastName: String,
    shippingAddress : String,
    shippingCity : String,
    shippingAddress : String,
    shippingState : String,
    shippingPostcode : String,
    shippingMethod: String,
    paymentMethod: String,
    paymentDates: String,
    paymentPaid: Number, 
    paymentDue: Number, 
    paymentTerms: String, 
    payments: [{
        datePaid: Date,
        outstandingOrderBalance: Date,
        orderPaymentAmount: Number, 
        totalPaymentAmount: Number,
        refundedAmount: Number, 
        paymentMethod: String, 
        paymentStatus: String, //paid or not
    }],

    


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
