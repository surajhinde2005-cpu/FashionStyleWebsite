const express = require('express');
const router = express.Router();
const { getOutfits, createOutfit, getOutfitById } = require('../controllers/outfitController');

router.route('/').get(getOutfits).post(createOutfit);
router.route('/:id').get(getOutfitById);

module.exports = router;
