const express = require('express');
const { uploadCSV } = require('../controllers/uploadController');

const router = express.Router();

// POST /api/upload
router.post('/', uploadCSV);

module.exports = router;
