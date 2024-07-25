const { Book } = require('../models');
const axios = require('axios');
const { wsServer } = require('../index');
const cache = require('../cache');
const { Op } = require('sequelize');

const createBook = async (req, res) => {
  try {
    const { title, author, isbn, publishedDate, price, stock } = req.body;
    const book = await Book.create({ title, author, isbn, publishedDate, price, stock });
    res.status(201).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getBooks = async (req, res) => {
  try {
    const books = await Book.findAll();
    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, isbn, publishedDate, price, stock } = req.body;
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    await book.update({ title, author, isbn, publishedDate, price, stock });

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

    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    await book.destroy();
    res.status(204).send();
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

    // Replace with the actual external API endpoint and include API key if required
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
    const cachedData = cache.get(`book_${id}_convert_${currency}`);
    if (cachedData) {
      return res.json({ book, convertedPrice: cachedData });
    }

    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`);
    const rate = response.data.rates[currency.toUpperCase()];
    if (!rate) {
      return res.status(400).json({ error: 'Invalid currency code' });
    }

    const convertedPrice = (book.price * rate).toFixed(2);

    // Cache the response
    cache.set(`book_${id}_convert_${currency}`, convertedPrice, 3600); // Cache for 1 hour

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
