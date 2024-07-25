const analyticsService = require('../services/analyticsService');

const getTopSellingBooks = async (req, res) => {
  try {
    const topBooks = await analyticsService.getTopSellingBooksByGenre();
    res.json(topBooks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserPurchasePatterns = async (req, res) => {
  try {
    const purchasePatterns = await analyticsService.getUserPurchasePatterns();
    res.json(purchasePatterns);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getSalesTrends = async (req, res) => {
  try {
    const salesTrends = await analyticsService.getSalesTrendsOverTime();
    res.json(salesTrends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getTopSellingBooks,
  getUserPurchasePatterns,
  getSalesTrends,
};
