const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, analyticsController.getAnalyticsSummary);
router.get('/calendar', authMiddleware, analyticsController.getCalendarMetrics);

module.exports = router;