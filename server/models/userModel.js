const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    default: 'admin',
  },
  password: {
    type: String,
    required: true,
    default: '123', // Default password
  },
  passChangeQuestion1: {
    type: String,
    required: true,
    default: 'black', // Default security answer 1
  },
  passChangeQuestion2: {
    type: String,
    required: true,
    default: 'kings college', // Default security answer 2
  },
  passChangeKey1: {
    type: String,
    required: true,
    default: '123', // Default key for password change
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
