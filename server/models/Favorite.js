const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  outfitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Outfit', required: true }
}, { timestamps: true });

// Prevent duplicate favorites for the same user and outfit
favoriteSchema.index({ userId: 1, outfitId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
