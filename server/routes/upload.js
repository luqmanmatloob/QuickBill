const express = require('express');
const { uploadCSV } = require('../controllers/uploadController'); // Adjust the path as needed
const multer = require('multer');
const path = require('path');

const router = express.Router();

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

router.post('/upload', upload.single('csvFile'), uploadCSV);

module.exports = router;
