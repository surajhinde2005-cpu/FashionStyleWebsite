import React, { useState, useEffect } from 'react';
import adminApi from '../../services/adminApi';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await adminApi.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      await adminApi.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="animate-fade-in">
      <h2 style={{ color: 'var(--text-primary)', marginBottom: '2rem' }}>Order Management</h2>
      
      <div className="admin-table-container glass">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Item</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td style={{ fontFamily: 'monospace' }}>{order._id.substring(18)}</td>
                <td>
                  <div><strong>{order.userId?.name}</strong></div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{order.userId?.email}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{order.deliveryAddress?.city}, {order.deliveryAddress?.state}</div>
                </td>
                <td>
                  {order.items && order.items.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img src={item.image || item.outfitId?.image} alt="outfit" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                          <div>
                            <div style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>{item.title || item.outfitId?.title}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Size: {item.size} | Qty: {item.quantity}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : order.outfitId ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <img src={order.outfitId.image} alt="outfit" style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontSize: '0.9rem', lineHeight: '1.2' }}>{order.outfitId.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Size: {order.size} | Qty: {order.quantity}</div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-secondary)' }}>No items found</div>
                  )}
                </td>
                <td>₹{order.totalAmount}</td>
                <td>
                  <span style={{ padding: '2px 8px', borderRadius: '4px', background: order.paymentMethod === 'COD' ? 'rgba(255, 165, 2, 0.1)' : 'rgba(30, 144, 255, 0.1)', color: order.paymentMethod === 'COD' ? '#ffa502' : '#1e90ff', fontSize: '0.8rem', fontWeight: 600 }}>
                    {order.paymentMethod}
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  <select 
                    className="status-select" 
                    value={order.status} 
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="failed">Failed</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
