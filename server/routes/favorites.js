const express = require('express');
const router = express.Router();
const { toggleFavorite, getFavorites } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

router.route('/add').post(protect, toggleFavorite);
router.route('/').get(protect, getFavorites);

module.exports = router;
