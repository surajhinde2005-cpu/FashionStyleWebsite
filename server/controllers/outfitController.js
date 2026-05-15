const Outfit = require('../models/Outfit');

exports.getOutfits = async (req, res) => {
  try {
    const { gender, season, minPrice, maxPrice, category, search, tags } = req.query;
    
    let query = {};
    
    if (gender && gender !== 'All') query.gender = gender;
    if (season && season !== 'All') query.season = season;
    if (category && category !== 'All') {
      const categoriesArray = category.split(',').map(c => c.trim());
      query.category = { $in: categoriesArray };
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Tag matching (for "image upload" mock recommendation)
    if (tags) {
      const tagsArray = tags.split(',').map(t => t.trim());
      query.tags = { $in: tagsArray };
    }

    const outfits = await Outfit.find(query).limit(50);
    res.json(outfits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createOutfit = async (req, res) => {
  try {
    const outfit = await Outfit.create(req.body);
    res.status(201).json(outfit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getOutfitById = async (req, res) => {
  try {
    const outfit = await Outfit.findById(req.params.id);
    if (outfit) {
      res.json(outfit);
    } else {
      res.status(404).json({ message: 'Outfit not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
