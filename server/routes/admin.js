const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middleware/adminMiddleware');
const { getStats, getOrders, updateOrderStatus, getStock, updateStock, addStock, deleteStock } = require('../controllers/adminController');

router.get('/stats', protectAdmin, getStats);
router.get('/orders', protectAdmin, getOrders);
router.put('/orders/:id/status', protectAdmin, updateOrderStatus);
router.get('/stock', protectAdmin, getStock);
router.post('/stock', protectAdmin, addStock);
router.put('/stock/:id', protectAdmin, updateStock);
router.delete('/stock/:id', protectAdmin, deleteStock);

module.exports = router;
