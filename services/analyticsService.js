const { Sale, Book } = require('../models/Index');
const { Op } = require('sequelize');

const getTopSellingBooksByGenre = async () => {
  try {
    const topBooks = await Sale.findAll({
      attributes: [
        'bookId',
        [Sequelize.fn('count', Sequelize.col('bookId')), 'totalSales']
      ],
      group: ['bookId', 'Book.id', 'Book.title', 'Book.genre'],
      include: [
        {
          model: Book,
          attributes: ['title', 'genre']
        }
      ],
      order: [[Sequelize.literal('totalSales'), 'DESC']],
      limit: 10
    });

    return topBooks.map(sale => ({
      title: sale.Book.title,
      genre: sale.Book.genre,
      totalSales: sale.dataValues.totalSales
    }));
  } catch (error) {
    throw new Error('Error fetching top-selling books: ' + error.message);
  }
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
