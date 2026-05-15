const Order = require('../models/Order');

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('outfitId', 'title image price') // For legacy orders
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user orders', error: error.message });
  }
};

exports.simulateTrackingUpdate = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Ensure order belongs to user or is admin (we'll just check existence for simulation)
    const currentStatus = order.status;
    const trackingSteps = order.trackingSteps;

    // Define workflow
    const workflow = ['pending', 'paid', 'shipped', 'out_for_delivery', 'delivered'];
    const trackingNames = ['Order Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

    let currentIndex = workflow.indexOf(currentStatus);
    
    // Fallback if status is something else
    if (currentIndex === -1) currentIndex = 0;

    if (currentIndex < workflow.length - 1) {
      const nextIndex = currentIndex + 1;
      const nextStatus = workflow[nextIndex];
      const nextTrackingName = trackingNames[nextIndex];

      order.status = nextStatus;
      order.trackingSteps.push({
        status: nextTrackingName,
        timestamp: new Date(),
        message: `Order has been updated to ${nextTrackingName}`
      });

      await order.save();
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error simulating tracking', error: error.message });
  }
};
