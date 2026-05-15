require('dotenv').config();
const mongoose = require('mongoose');
const Outfit = require('./models/Outfit');

const itemTypes = [
  { type: 'T-Shirt', genders: ['Men', 'Women', 'Unisex'], categories: ['Casual', 'Streetwear', 'Sportswear'] },
  { type: 'Jeans', genders: ['Men', 'Women', 'Unisex'], categories: ['Casual', 'Utility', 'Vintage', 'Streetwear'] },
  { type: 'Dress', genders: ['Women'], categories: ['Casual', 'Party', 'Formal', 'Bohemian', 'Chic'] },
  { type: 'Jacket', genders: ['Men', 'Women', 'Unisex'], categories: ['Casual', 'Utility', 'Formal', 'Streetwear', 'Vintage'] },
  { type: 'Suit', genders: ['Men', 'Women'], categories: ['Formal', 'Party', 'Chic'] },
  { type: 'Shorts', genders: ['Men', 'Women', 'Unisex'], categories: ['Casual', 'Sportswear', 'Streetwear'] },
  { type: 'Sweater', genders: ['Men', 'Women', 'Unisex'], categories: ['Casual', 'Formal', 'Chic', 'Vintage'] },
  { type: 'Pants', genders: ['Men', 'Women', 'Unisex'], categories: ['Formal', 'Casual', 'Utility', 'Chic'] },
  { type: 'Skirt', genders: ['Women'], categories: ['Casual', 'Party', 'Formal', 'Bohemian'] },
  { type: 'Activewear', genders: ['Men', 'Women', 'Unisex'], categories: ['Casual', 'Sportswear'] },
];

const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Grey', 'Navy', 'Pink', 'Beige', 'Olive', 'Maroon'];
const materials = ['Cotton', 'Denim', 'Leather', 'Linen', 'Polyester', 'Wool', 'Silk', 'Blend'];

const generateOutfits = (count) => {
  const outfits = [];
  for (let i = 1; i <= count; i++) {
    const itemTypeObj = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const material = materials[Math.floor(Math.random() * materials.length)];
    
    const title = `${color} ${material} ${itemTypeObj.type}`;
    const gender = itemTypeObj.genders[Math.floor(Math.random() * itemTypeObj.genders.length)];
    
    // Assign season logically
    let season = 'All';
    if (material === 'Wool' || itemTypeObj.type === 'Sweater' || itemTypeObj.type === 'Jacket') {
      season = 'Winter';
    } else if (itemTypeObj.type === 'Shorts' || itemTypeObj.type === 'T-Shirt' || material === 'Linen') {
      season = 'Summer';
    } else {
      const seasons = ['Summer', 'Winter', 'Rainy', 'All'];
      season = seasons[Math.floor(Math.random() * seasons.length)];
    }
    
    const price = Math.floor(Math.random() * 4500) + 500; // 500 to 5000
    const category = itemTypeObj.categories[Math.floor(Math.random() * itemTypeObj.categories.length)];
    
    // Generate unique loremflickr image
    const imageQuery = itemTypeObj.type.toLowerCase().replace(' ', '');
    const image = `https://loremflickr.com/500/600/fashion,${imageQuery}?lock=${i}`;
    
    const description = `A premium quality ${title.toLowerCase()} perfect for ${category.toLowerCase()} occasions. Designed for comfort and style, this piece is a must-have for your wardrobe.`;
    
    const tags = [color, material, itemTypeObj.type, category, season, gender];
    const stock = Math.floor(Math.random() * 51) + 10; // Random stock from 10 to 60
    
    outfits.push({ title, gender, season, price, category, image, description, tags, stock });
  }
  return outfits;
};

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fashion_stylist')
  .then(async () => {
    console.log('MongoDB Connected for Seeding');
    await Outfit.deleteMany({}); // Clear existing records
    const data = generateOutfits(50);
    await Outfit.insertMany(data);
    console.log(`Successfully inserted ${data.length} outfits into the database!`);
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
