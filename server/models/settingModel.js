const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  url: {
    type: String,
  },
  taxRate:{
    type: Number,
  },
  imageUrl: { 
    type: String,
  }

});

const Setting = mongoose.model('Setting', settingSchema);

module.exports = Setting;
