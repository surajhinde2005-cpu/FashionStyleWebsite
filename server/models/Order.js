const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Legacy fields (optional to prevent old document crashes)
  outfitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Outfit' },
  size: { type: String },
  quantity: { type: Number },
  amount: { type: Number }, 

  // New multi-item array
  items: [
    {
      outfitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Outfit', required: true },
      title: { type: String },
      image: { type: String },
      price: { type: Number },
      size: { type: String, required: true },
      quantity: { type: Number, required: true },
    }
  ],
  
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'pending', enum: ['pending', 'paid', 'failed', 'shipped', 'out_for_delivery', 'delivered'] },
  paymentMethod: { type: String, enum: ['COD', 'Online'], required: true, default: 'Online' },
  paymentId: { type: String }, // Razorpay payment ID (only for Online)
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },
  
  // Live Tracking feature
  trackingSteps: [
    {
      status: { type: String, enum: ['Order Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'] },
      timestamp: { type: Date, default: Date.now },
      message: { type: String }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
