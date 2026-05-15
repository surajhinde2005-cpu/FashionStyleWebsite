const mongoose = require('mongoose');
const Admin = require('./server/models/Admin');
const jwt = require('jsonwebtoken');

require('dotenv').config({ path: './server/.env' });

async function test() {
  await mongoose.connect('mongodb://localhost:27017/fashion_stylist');
  
  // Create or get an admin token
  let admin = await Admin.findOne();
  if (!admin) {
    admin = await Admin.create({ email: 'admin@test.com', password: 'password', name: 'Admin' });
  }
  
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  const baseURL = 'http://localhost:5000/api/admin';

  try {
    // Test GET
    console.log("Testing GET /stock");
    const getRes = await fetch(`${baseURL}/stock`, { headers });
    const getData = await getRes.json();
    console.log(`GET Success: ${getData.length} outfits found`);

    // Test POST
    console.log("Testing POST /stock");
    const postRes = await fetch(`${baseURL}/stock`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        title: 'Test Outfit',
        description: 'Test description',
        price: 999,
        image: 'http://example.com/image.jpg',
        category: 'Test Category',
        gender: 'Unisex',
        season: 'All'
      })
    });
    const postData = await postRes.json();
    if (!postRes.ok) throw new Error(JSON.stringify(postData));
    console.log(`POST Success: Outfit created with ID ${postData._id}`);

    // Test PUT
    console.log("Testing PUT /stock");
    const putRes = await fetch(`${baseURL}/stock/${postData._id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ price: 1000 })
    });
    const putData = await putRes.json();
    if (!putRes.ok) throw new Error(JSON.stringify(putData));
    console.log(`PUT Success: Price updated to ${putData.price}`);

    // Test DELETE
    console.log("Testing DELETE /stock");
    const delRes = await fetch(`${baseURL}/stock/${postData._id}`, {
      method: 'DELETE',
      headers
    });
    const delData = await delRes.json();
    if (!delRes.ok) throw new Error(JSON.stringify(delData));
    console.log(`DELETE Success: ${delData.message}`);
    
  } catch (error) {
    console.error("API Error:");
    console.error(error.message);
  }

  mongoose.disconnect();
}

test();
