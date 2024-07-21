// models/Customer.js
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  primaryContact: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
  },
  accountNumber: {
    type: String,
    unique: true,
  },
  website: String,
  notes: String,
  billing: {
    currency: String,
    address: {
      address1: String,
      address2: String,
      country: String,
      state: String,
      city: String,
      postal: String,
    },
  },
  shipping: {
    name: String,
    address: {
      address1: String,
      address2: String,
      country: String,
      state: String,
      city: String,
      postal: String,
    },
    phone: String,
    deliveryInstructions: String,
  },
});

module.exports = mongoose.model('Customer', customerSchema);
