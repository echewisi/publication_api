const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { verifyToken } = require('../middlewares/auth');
const authorize = require('../middlewares/rbac');
const validationMiddleware= require('../middlewares/validation')
const bookValidation= require('../schema/bookValidation')

// Create a new book (Admin, Seller only)
/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book (Admin, Seller only)
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Book details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Bad request
 */
router.post('/books', verifyToken, authorize(['create_book']), validationMiddleware(bookValidation), bookController.createBook);

// Retrieve a list of all books (all users)
/**
 * @swagger
 * /books:
 *   get:
 *     summary: Retrieve a list of all books
 *     tags: [Book]
 *     responses:
 *       200:
 *         description: List of books
 *       404:
 *         description: No books found
 */
router.get('/books', verifyToken, authorize(['retrieve_books']),validationMiddleware(bookValidation), bookController.getBooks);

// Retrieve details of a specific book by ID (all users)
/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Retrieve details of a specific book by ID
 *     tags: [Book]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book details
 *       404:
 *         description: Book not found
 */
router.get('/books/:id', verifyToken, authorize(['retrieve_book']), validationMiddleware(bookValidation), bookController.getBookById);

// Update details of a specific book by ID (Admin, Seller only)
/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update details of a specific book by ID (Admin, Seller only)
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated book details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       400:
 *         description: Bad request
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Book not found
 */
router.put('/books/:id', verifyToken, authorize(['update_book']), validationMiddleware(bookValidation), bookController.updateBook);

// Delete a specific book by ID (Admin only)
/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a specific book by ID (Admin only)
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Book not found
 */
router.delete('/books/:id', verifyToken, authorize(['delete_book']), bookController.deleteBook);

//EXTERNAL BOOK API IMPLEMENTED HERE-->

//get external book details
/**
 * @swagger
 * /books/{id}/external:
 *   get:
 *     summary: Retrieve external book details based on the ISBN
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: External book details
 *       404:
 *         description: Book not found
 */
router.get('/books/:id/external', verifyToken, bookController.getExternalBookDetails)

//convert book price
/**
 * @swagger
 * /books/{id}/convert/{currency}:
 *   get:
 *     summary: Convert book price to a specified currency
 *     tags: [Book]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: currency
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Converted book price
 *       400:
 *         description: Bad request
 *       404:
 *         description: Book or currency not found
 */
router.get('/books/:id/convert/:currency', verifyToken, bookController.convertBookPrice)

module.exports = router;
