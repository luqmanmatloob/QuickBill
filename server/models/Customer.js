const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: String,
  primaryContactFirstName: String,
  primaryContactLastName: String,
  primaryContactEmail: String,
  primaryContactPhone: String,
  accountNumber: String,
  website: String,
  notes: String,
  billingCurrency: String,
  billingAddress1: String,
  billingAddress2: String,
  billingCountry: String,
  billingState: String,
  billingCity: String,
  billingPostal: String,
  shippingName: String,
  shippingAddress1: String,
  shippingAddress2: String,
  shippingCountry: String,
  shippingState: String,
  shippingCity: String,
  shippingPostal: String,
  shippingPhone: String,
  shippingDeliveryInstructions: String,
  uniqueKey: { type: Number, default: 0, unique: true } // Unique key starting from 1
});

customerSchema.pre('save', async function(next) {
  try {
    if (!this.uniqueKey || this.uniqueKey === 0) {
      const Customer = mongoose.model('Customer', customerSchema);
      try {
        const maxCustomer = await Customer.findOne({}, {}, { sort: { 'uniqueKey': -1 } });
        const newUniqueKey = maxCustomer ? maxCustomer.uniqueKey + 1 : 1;
        this.uniqueKey = newUniqueKey;
      } catch (dbError) {
        console.error('Error finding max uniqueKey:', dbError);
        this.uniqueKey = Date.now(); // Fallback to timestamp if query fails
      }
    }
    next();
  } catch (err) {
    console.error('Error in pre-save hook:', err);
    next(err);
  }
});

module.exports = mongoose.model('Customer', customerSchema);
