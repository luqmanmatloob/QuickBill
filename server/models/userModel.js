const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    default: 'admin', //default username
  },
  password: {
    type: String,
    required: true,
    default: '123', // Default password
  },
  secretKey: {
    type: String,
    required: true,
    default: '123', // Default security answer 1
  },
  
  jwtSecretKeyAppend: {
    type: Number,
    required: true,
    default: '1', // Default security answer 1
  },

});

const User = mongoose.model('User', userSchema);

module.exports = User;
