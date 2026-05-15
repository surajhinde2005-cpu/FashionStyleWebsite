const mongoose = require('mongoose');

const outfitSchema = new mongoose.Schema({
  title: { type: String, required: true },
  gender: { type: String, required: true, enum: ['Men', 'Women', 'Unisex'] },
  season: { type: String, required: true, enum: ['Summer', 'Winter', 'Rainy', 'All'] },
  price: { type: Number, required: true },
  category: { type: String, required: true }, // e.g., Casual, Formal, Party
  image: { type: String, required: true },
  description: { type: String, required: true },
  stock: { type: Number, required: true, default: 20 },
  tags: [{ type: String }] // Used for matching logic
}, { timestamps: true });

module.exports = mongoose.model('Outfit', outfitSchema);
