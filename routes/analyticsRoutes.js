const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { verifyToken } = require('../middlewares/auth');
const  authorize  = require('../middlewares/rbac');

const router = express.Router();

router.get('/analytics/topbooks', verifyToken, authorize(["view_analytics"]), analyticsController.getTopSellingBooks);

router.get('/analytics/userpatterns', verifyToken, authorize(["view_analytics"]), analyticsController.getUserPurchasePatterns);

router.get('/analytics/salestrends', verifyToken, authorize(["view_analytics"]), analyticsController.getSalesTrends);

module.exports = router;
