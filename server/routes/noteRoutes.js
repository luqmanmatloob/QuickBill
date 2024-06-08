const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

// Create a new note
router.post('/', noteController.createNote);

// Get all notes
router.get('/', noteController.getAllNotes);

// Get a single note by id
router.get('/:id', noteController.getNoteById);

// Update a note by id
router.put('/:id', noteController.updateNote);

// Delete a note by id
router.delete('/:id', noteController.deleteNote);

module.exports = router;
