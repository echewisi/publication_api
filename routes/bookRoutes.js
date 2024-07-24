const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { verifyToken } = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');

// Create a new book (Admin, Seller only)
router.post('/books', verifyToken, authorize(['create_book']), bookController.createBook);

// Retrieve a list of all books (all users)
router.get('/books', verifyToken, authorize(['retrieve_books']), bookController.getBooks);

// Retrieve details of a specific book by ID (all users)
router.get('/books/:id', verifyToken, authorize(['retrieve_book']), bookController.getBookById);

// Update details of a specific book by ID (Admin, Seller only)
router.put('/books/:id', verifyToken, authorize(['update_book']), bookController.updateBook);

// Delete a specific book by ID (Admin only)
router.delete('/books/:id', verifyToken, authorize(['delete_book']), bookController.deleteBook);

module.exports = router;
