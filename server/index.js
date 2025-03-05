const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const authMiddleware = require('./middlewares/authMiddleware');
const createAdminUser = require('./seeding/seedadmin');


// Load environment variables from .env file
require('dotenv').config();

// Import routes
const settingRoute = require('./routes/settingRoute');
const invoiceQuoteRoute = require('./routes/invoiceQuoteroute');
const customerRoute = require('./routes/customerRoute');
const userRoute = require('./routes/userRoute');


// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
// app.use(express.static('public'));
// app.use(express.static('public/uploads'));
app.use(express.static(path.join(__dirname, 'public')));



// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));



// seeding admin
createAdminUser();




// Routes
app.use('/api/settings', authMiddleware, settingRoute);
app.use('/api/invoicequote', authMiddleware, invoiceQuoteRoute);
app.use('/api/customer', authMiddleware, customerRoute);
app.use('/api/user', userRoute);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


