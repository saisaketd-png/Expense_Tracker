import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { useToast } from '../../context/ToastContext';

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content animate-fade-in-up" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={24} color="var(--color-text-muted)" />
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <Input 
            label="Amount (₹)" 
            type="number" 
            placeholder="0.00" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            error={error}
            autoFocus
          />
          <Button type="submit" variant="primary">Save</Button>
        </form>
      </div>
    </div>
  );
};
