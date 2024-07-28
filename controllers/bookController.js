const { Book, User } = require('../models/Index');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const { wsServer } = require('../index')
const cache = require('../config/cache'); // Using the newly created cache module

// Initialize WebSocket server (assuming you have a WebSocket server running)
// const wss = new WebSocket.Server({ noServer: true });

// const notifyClients = (message) => {
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify(message));
//     }
//   });
// };

const createBook = async (req, res) => {
  try {
    const { title, author, isbn, publishedDate, price, stock, genre } = req.body;
    if (!title || !author || !isbn || !publishedDate || !price || !stock) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const book = await Book.create({
      id: uuidv4(),
      title,
      author,
      isbn,
      publishedDate,
      price,
      stock,
      genre,
      userId: req.user.id
    });

    wsServer.notifyClients({
      type: 'book_created',
      book: {
        id: book.id,
        title: book.title,
        price: book.price,
        stock: book.stock
      }
    });
    res.status(201).json({ message: 'Book created successfully', book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json({ books });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateBook = async (req, res) => {
  try {
    const { title, author, isbn, publishedDate, price, stock, genre } = req.body;
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    book.title = title || book.title;
    book.author = author || book.author;
    book.isbn = isbn || book.isbn;
    book.publishedDate = publishedDate || book.publishedDate;
    book.price = price || book.price;
    book.stock = stock || book.stock;
    book.genre = genre || book.genre;

    await book.save();

    // Notify clients of the update
    wsServer.notifyClients({
      type: 'book_update',
      book: {
        id: book.id,
        title: book.title,
        price: book.price,
        stock: book.stock
      }
    });

    res.json({ message: 'Book updated successfully', book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    await book.destroy();

    notifyClients({ event: 'book_deleted', bookId: req.params.id });

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getExternalBookDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Check cache first
    const cachedData = cache.get(`book_${id}_external`);
    if (cachedData) {
      return res.json({ book, externalDetails: cachedData });
    }

    // Replace with the actual external API endpoint
    const response = await axios.get(`https://openlibrary.org/api/books?bibkeys=ISBN:${book.isbn}&jscmd=details&format=json`);
    const externalDetails = response.data[`ISBN:${book.isbn}`]?.details || {};

    const details = {
      summary: externalDetails.description || 'No summary available',
      genres: externalDetails.subjects?.map(subject => subject.name) || ['No genres available']
    };

    // Cache the response
    cache.set(`book_${id}_external`, details, 3600); // Cache for 1 hour

    res.json({ book, externalDetails: details });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const convertBookPrice = async (req, res) => {
  try {
    const { id, currency } = req.params;
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Check cache first
    const cachedData = cache.get(`book_${id}_price_${currency}`);
    if (cachedData) {
      return res.json({ book, convertedPrice: cachedData });
    }

    // Replace with actual currency conversion API endpoint and logic
    const response = await axios.get(`https://api.exchangeratesapi.io/latest?base=USD&symbols=${currency}`);
    const rate = response.data.rates[currency];
    const convertedPrice = book.price * rate;

    // Cache the response
    cache.set(`book_${id}_price_${currency}`, convertedPrice, 3600); // Cache for 1 hour

    res.json({ book, convertedPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  getExternalBookDetails,
  convertBookPrice
};
