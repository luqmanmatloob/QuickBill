const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const settingRoute = require('./routes/settingRoute.js');
const invoiceQuoteRoute = require('./routes/invoiceQuoteroute.js');
const fileUpload = require('express-fileupload');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/invoiceDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use(express.static('public'));

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Adjust the upload directory as needed
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage: storage });

// Routes
const uploadRoute = require('./routes/upload.js');
app.use('/api/upload', upload.single('csvFile'), uploadRoute);

app.use('/api/settings', settingRoute);
app.use('/api/invoicequote', invoiceQuoteRoute);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
