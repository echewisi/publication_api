const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { verifyToken } = require('../middlewares/auth');
const  authorize  = require('../middlewares/rbac');

const router = express.Router();

/**
 * @openapi
 * /analytics/topbooks:
 *   get:
 *     summary: Retrieve the top-selling books by genre
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of top-selling books by genre
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/analytics/topbooks', verifyToken, authorize(["view_analytics"]), analyticsController.getTopSellingBooks);

/**
 * @openapi
 * /analytics/userpatterns:
 *   get:
 *     summary: Retrieve user purchase patterns
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User purchase patterns
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/analytics/userpatterns', verifyToken, authorize(["view_analytics"]), analyticsController.getUserPurchasePatterns);

/**
 * @openapi
 * /analytics/salestrends:
 *   get:
 *     summary: Retrieve sales trends over time
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales trends over time
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get('/analytics/salestrends', verifyToken, authorize(["view_analytics"]), analyticsController.getSalesTrends);

module.exports = router;
