import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { useToast } from '../../context/ToastContext';
import './AddExpenseModal.css';

interface AmountModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  initialAmount: number;
  onSave: (amount: number) => void;
}

export const AmountModal: React.FC<AmountModalProps> = ({ isOpen, onClose, title, initialAmount, onSave }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setAmount(initialAmount > 0 ? initialAmount.toString() : '');
      setError('');
    }
  }, [isOpen, initialAmount]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount) {
      setError('Amount is required.');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 0) {
      setError('Please enter a valid positive amount.');
      return;
    }

    onSave(amountNum);
    showToast(`${title} updated successfully!`, 'success');
    onClose();
  };

  return (
    <div className="premium-modal-overlay" onClick={onClose}>
      <div className="premium-modal-content animate-slide-up" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', gap: 'var(--spacing-md)' }}>
        <button className="premium-modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        <div className="premium-modal-header">
          <h2>{title}</h2>
        </div>
        <form onSubmit={handleSubmit} className="premium-modal-form">
          <Input 
            label="Amount (₹)" 
            type="number" 
            placeholder="0.00" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            error={error}
            autoFocus
          />
          <Button type="submit" variant="primary" style={{ marginTop: 'var(--spacing-sm)' }}>
            Save
          </Button>
        </form>
      </div>
    </div>
  );
};
