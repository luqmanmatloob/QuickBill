

const express = require('express');
const router = express.Router();
const settingController = require('../controllers/settingController');

// GET current settings
router.get('/', settingController.getSettings);

// PUT update settings
router.put('/', settingController.updateSettings);

// POST add Initial Settings

module.exports = router;
