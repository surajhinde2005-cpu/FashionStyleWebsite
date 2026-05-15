const Favorite = require('../models/Favorite');

exports.toggleFavorite = async (req, res) => {
  try {
    const { outfitId } = req.body;
    const userId = req.user._id;

    const existingFavorite = await Favorite.findOne({ userId, outfitId });

    if (existingFavorite) {
      await Favorite.findByIdAndDelete(existingFavorite._id);
      res.json({ message: 'Removed from favorites', isFavorite: false });
    } else {
      await Favorite.create({ userId, outfitId });
      res.status(201).json({ message: 'Added to favorites', isFavorite: true });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id }).populate('outfitId');
    // Map to just return the outfits array
    const outfits = favorites.map(f => f.outfitId);
    res.json(outfits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
