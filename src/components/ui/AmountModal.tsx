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
  startDate?: string;
  endDate?: string;
  onSaveRange?: (start: string, end: string) => void;
}

export const AmountModal: React.FC<AmountModalProps> = ({ isOpen, onClose, title, initialAmount, onSave, startDate, endDate, onSaveRange }) => {
  const [amount, setAmount] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [error, setError] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setAmount(initialAmount > 0 ? initialAmount.toString() : '');
      if (startDate) setStart(startDate);
      if (endDate) setEnd(endDate);
      setError('');
    }
  }, [isOpen, initialAmount, startDate, endDate]);

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

    if (onSaveRange) {
      if (new Date(end) < new Date(start)) {
        setError('End date cannot be before start date.');
        return;
      }
    }

    onSave(amountNum);
    if (onSaveRange) {
      onSaveRange(start, end);
    }
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
            required
            autoFocus
          />
          {onSaveRange && (
            <div style={{ display: 'flex', gap: '16px', marginTop: '4px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                  Start Date
                </label>
                <input 
                  type="date"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  style={{
                    background: 'var(--color-background)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    color: 'var(--color-text-main)',
                    fontFamily: 'inherit',
                    outline: 'none',
                    width: '100%'
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-main)' }}>
                  End Date
                </label>
                <input 
                  type="date"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  style={{
                    background: 'var(--color-background)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    color: 'var(--color-text-main)',
                    fontFamily: 'inherit',
                    outline: 'none',
                    width: '100%'
                  }}
                />
              </div>
            </div>
          )}
          <Button type="submit" variant="primary" style={{ marginTop: 'var(--spacing-sm)' }}>
            Save
          </Button>
        </form>
      </div>
    </div>
  );
};
