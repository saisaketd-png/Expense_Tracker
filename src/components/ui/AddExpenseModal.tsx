import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { useExpenses } from '../../context/ExpenseContext';
import type { Transaction } from '../../context/ExpenseContext';
import { useToast } from '../../context/ToastContext';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Transaction | null;
}

const CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Entertainment',
  'Education',
  'Bills',
  'Healthcare',
  'Other'
];

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, initialData }) => {
  const { addTransaction, editTransaction } = useExpenses();
  const { showToast } = useToast();
  
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Reset or populate form when opened
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setAmount(Math.abs(initialData.amount).toString());
        setCategory(initialData.category);
        setDate(initialData.date);
        setNotes(initialData.title !== initialData.category ? initialData.title : '');
      } else {
        setAmount('');
        setCategory('');
        setDate(new Date().toISOString().split('T')[0]);
        setNotes('');
      }
      setError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount || !category) {
      setError('Amount and Category are required.');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid positive amount.');
      return;
    }

    const txData = {
      title: notes || category,
      category,
      amount: amountNum,
      date: date || new Date().toISOString().split('T')[0],
      type: 'expense' as const
    };

    if (initialData) {
      editTransaction(initialData.id, txData);
      showToast('Expense updated successfully!', 'success');
    } else {
      addTransaction(txData);
      showToast('Expense added successfully!', 'success');
    }
    
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{initialData ? 'Edit Expense' : 'Add Expense'}</h2>
          <button className="btn-icon" onClick={onClose}>
            <X size={24} color="var(--color-text-muted)" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          {error && <div className="text-danger text-sm">{error}</div>}
          
          <Input 
            label="Amount (₹)" 
            type="number" 
            placeholder="0.00" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            autoFocus
          />

          <div className="input-wrapper">
            <label className="input-label">Category</label>
            <select 
              className="input-field" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled>Select a category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <Input 
            label="Date" 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Input 
            label="Notes (Optional)" 
            type="text" 
            placeholder="e.g. Lunch with friends" 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Button type="submit" variant="primary" style={{ marginTop: 'var(--spacing-sm)' }}>
            Save Expense
          </Button>
        </form>
      </div>
    </div>
  );
};
