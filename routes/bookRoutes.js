const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { verifyToken } = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');
const validationMiddleware= require('../middlewares/validation')
const bookValidation= require('../schema/bookValidation')

// Create a new book (Admin, Seller only)
router.post('/books', verifyToken, authorize(['create_book']), validationMiddleware(bookValidation), bookController.createBook);

// Retrieve a list of all books (all users)
router.get('/books', verifyToken, authorize(['retrieve_books']),validationMiddleware(bookValidation), bookController.getBooks);

// Retrieve details of a specific book by ID (all users)
router.get('/books/:id', verifyToken, authorize(['retrieve_book']), validationMiddleware(bookValidation), bookController.getBookById);

// Update details of a specific book by ID (Admin, Seller only)
router.put('/books/:id', verifyToken, authorize(['update_book']), validationMiddleware(bookValidation), bookController.updateBook);

// Delete a specific book by ID (Admin only)
router.delete('/books/:id', verifyToken, authorize(['delete_book']), bookController.deleteBook);

//EXTERNAL BOOK API IMPLEMENTED HERE-->

//get external book details
router.get('/books/:id/external', verifyToken, bookController.getExternalBookDetails)

//convert book price
router.get('/books/:id/convert/:currency', verifyToken, bookController.convertBookPrice)

module.exports = router;
