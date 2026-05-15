import React from 'react';
import { FaCheck, FaBox, FaTruck, FaMapMarkerAlt, FaHome, FaTimes } from 'react-icons/fa';

const TrackingModal = ({ order, onClose }) => {
  if (!order) return null;

  const steps = [
    { name: 'Order Placed', icon: <FaCheck /> },
    { name: 'Packed', icon: <FaBox /> },
    { name: 'Shipped', icon: <FaTruck /> },
    { name: 'Out for Delivery', icon: <FaMapMarkerAlt /> },
    { name: 'Delivered', icon: <FaHome /> }
  ];

  // Calculate which steps are completed based on trackingSteps array
  const completedSteps = order.trackingSteps?.map(t => t.status) || [];
  
  // To handle legacy orders without tracking steps
  const legacyStatusMap = {
    'pending': ['Order Placed'],
    'paid': ['Order Placed'],
    'shipped': ['Order Placed', 'Packed', 'Shipped'],
    'out_for_delivery': ['Order Placed', 'Packed', 'Shipped', 'Out for Delivery'],
    'delivered': ['Order Placed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered']
  };

  const derivedSteps = legacyStatusMap[order.status?.toLowerCase()] || ['Order Placed'];
  const actualCompletedSteps = [...new Set([...completedSteps, ...derivedSteps])];

  return (
    <div className="tracking-modal-overlay animate-fade-in">
      <div className="tracking-modal glass">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <h3 style={{ color: '#000000' }}>Order Tracking</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.2rem' }}>
            <FaTimes />
          </button>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Order ID: <span style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>{order._id}</span></p>
          <p style={{ color: 'var(--text-secondary)' }}>Status: <span style={{ color: '#000000', fontWeight: 600 }}>{order.status.toUpperCase()}</span></p>
        </div>

        <div className="timeline">
          {steps.map((step, index) => {
            const isCompleted = actualCompletedSteps.includes(step.name);
            const stepData = order.trackingSteps?.find(t => t.status === step.name);
            
            return (
              <div key={index} className={`timeline-step ${isCompleted ? 'completed' : ''}`}>
                <div className="timeline-icon">
                  {step.icon}
                </div>
                <div style={{ opacity: isCompleted ? 1 : 0.4 }}>
                  <h4 style={{ color: isCompleted ? 'var(--primary-color)' : 'var(--text-primary)', marginBottom: '0.2rem' }}>{step.name}</h4>
                  {isCompleted && stepData && (
                    <>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>{stepData.message}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(stepData.timestamp).toLocaleString()}</p>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrackingModal;
