import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle } from 'react-icons/fa';

const StockWarningModal = ({ isOpen, items, onContinue, onCancel }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(5px)',
          zIndex: 10000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '1rem'
        }}
      >
        <motion.div 
          className="glass"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          style={{
            background: 'var(--surface-color)',
            padding: '2.5rem',
            borderRadius: 'var(--radius-lg)',
            maxWidth: '500px',
            width: '100%',
            textAlign: 'center',
            border: '1px solid var(--border-color)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}
        >
          <div style={{ color: '#ff9f43', fontSize: '3rem', marginBottom: '1rem' }}>
            <FaExclamationTriangle />
          </div>
          
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.8rem' }}>
            Low Stock Alert!
          </h2>

          <div style={{ marginBottom: '2rem', textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px' }}>
            {items.map((item, index) => (
              <p key={index} style={{ color: 'var(--text-secondary)', margin: '0.5rem 0', fontSize: '1.1rem' }}>
                🔥 Hurry! Only <strong style={{ color: '#ff9f43' }}>{item.stock}</strong> items left in stock for <strong>{item.title}</strong>
              </p>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              className="btn-outline" 
              style={{ flex: 1, padding: '1rem' }} 
              onClick={onCancel}
            >
              Cancel
            </button>
            <button 
              className="btn-primary" 
              style={{ flex: 1, padding: '1rem', background: 'linear-gradient(45deg, #d4af37, #f0ce71)', color: '#fdfdfd' }} 
              onClick={onContinue}
            >
              Continue Purchase
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default StockWarningModal;
