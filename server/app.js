const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Load environment variables from .env file
require('dotenv').config();

// Import routes
const settingRoute = require('./routes/settingRoute');
const invoiceQuoteRoute = require('./routes/invoiceQuoteRoute');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Adjust the limit as per your requirement
app.use(express.static('public'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/invoiceDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes
app.use('/api/settings', settingRoute);
app.use('/api/invoicequote', invoiceQuoteRoute);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
