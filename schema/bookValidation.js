const Joi = require('joi');

const bookSchema = Joi.object({
  title: Joi.string().required(),
  author: Joi.string().required(),
  isbn: Joi.string().regex(/^\d{3}-\d{10}$/).required(), // Example ISBN format: 978-1234567890
  publishedDate: Joi.date().iso().required(),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
  genre:  Joi.string().required()
});

module.exports = bookSchema;
