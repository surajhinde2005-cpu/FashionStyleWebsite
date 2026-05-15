const express = require('express');
const router = express.Router();
const { getUserOrders, simulateTrackingUpdate } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.get('/my-orders', protect, getUserOrders);
router.put('/:id/simulate-tracking', protect, simulateTrackingUpdate);

module.exports = router;
