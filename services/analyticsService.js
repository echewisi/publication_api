const { Sale, Book } = require('../models');
const Book= require('../models/Book')
const Sale= require('../models/Sale')
const { Op } = require('sequelize');

const getTopSellingBooksByGenre = async () => {
  const topBooks = await Sale.findAll({
    attributes: [
      'bookId',
      [sequelize.fn('COUNT', sequelize.col('bookId')), 'salesCount'],
    ],
    include: [{
      model: Book,
      attributes: ['title', 'genre'],
    }],
    group: ['bookId', 'Book.id'],
    order: [[sequelize.literal('salesCount'), 'DESC']],
    limit: 10,
  });

  return topBooks;
};

const getUserPurchasePatterns = async () => {
  const purchasePatterns = await Sale.findAll({
    attributes: [
      'userId',
      [sequelize.fn('COUNT', sequelize.col('userId')), 'purchaseCount'],
    ],
    group: ['userId'],
    order: [[sequelize.literal('purchaseCount'), 'DESC']],
    limit: 10,
  });

  return purchasePatterns;
};

const getSalesTrendsOverTime = async () => {
  const salesTrends = await Sale.findAll({
    attributes: [
      [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('saleDate')), 'month'],
      [sequelize.fn('COUNT', sequelize.col('id')), 'salesCount'],
    ],
    group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('saleDate'))],
    order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('saleDate')), 'ASC']],
  });

  return salesTrends;
};

module.exports = {
  getTopSellingBooksByGenre,
  getUserPurchasePatterns,
  getSalesTrendsOverTime,
};
