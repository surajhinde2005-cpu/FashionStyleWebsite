const Cart = require('../models/Cart');

exports.addToCart = async (req, res) => {
  try {
    const { outfitId, size, quantity } = req.body;
    const userId = req.user.id;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [{ outfitId, size, quantity }] });
    } else {
      // Check if item already exists
      const itemIndex = cart.items.findIndex(p => p.outfitId == outfitId && p.size === size);
      
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ outfitId, size, quantity });
      }
    }

    await cart.save();
    
    // Populate before returning
    const populatedCart = await Cart.findById(cart._id).populate('items.outfitId', 'title image price stock');
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error adding to cart', error: error.message });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id }).populate('items.outfitId', 'title image price stock');
    if (!cart) {
      return res.json({ items: [] });
    }

    // Clean up orphaned items (where outfitId is null because the product was deleted)
    const originalLength = cart.items.length;
    cart.items = cart.items.filter(item => item.outfitId != null);
    
    if (cart.items.length !== originalLength) {
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching cart', error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const cart = await Cart.findOne({ userId: req.user.id });
    
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    item.quantity = quantity;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.outfitId', 'title image price stock');
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error updating cart', error: error.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items.pull({ _id: itemId });
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.outfitId', 'title image price stock');
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Server Error removing from cart', error: error.message });
  }
};
