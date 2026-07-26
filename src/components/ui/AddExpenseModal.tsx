import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useExpenses } from '../../context/ExpenseContext';
import type { Transaction } from '../../context/ExpenseContext';
import { useToast } from '../../context/ToastContext';
import { getCategoryStyles } from '../../utils/categoryIcons';
import type { Category } from '../../utils/categoryIcons';
import './AddExpenseModal.css';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Transaction | null;
}

const CATEGORIES: Category[] = [
  'Food', 'Shopping', 'Transport', 'Bills', 
  'Education', 'Entertainment', 'Healthcare', 'Other'
];

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, initialData }) => {
  const { addTransaction, editTransaction } = useExpenses();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Food');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && isOpen) {
      setTitle(initialData.title);
      setAmount(initialData.amount.toString());
      setCategory(initialData.category as Category);
      setDate(initialData.date);
    } else if (isOpen) {
      setTitle('');
      setAmount('');
      setCategory('Food');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      const transactionData = {
        title,
        amount: parseFloat(amount),
        category,
        date,
        type: 'expense' as const
      };

      if (initialData) {
        editTransaction(initialData.id, transactionData);
        showToast('Expense updated successfully', 'success');
      } else {
        addTransaction(transactionData);
        showToast('Expense added successfully', 'success');
      }
      
      setIsSubmitting(false);
      onClose();
    }, 400); // Simulate network request for button animation
  };

  return (
    <div className="premium-modal-overlay">
      <div className="premium-modal-content animate-slide-up">
        <button className="premium-modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="premium-modal-header">
          <h2>{initialData ? 'Edit Expense' : 'New Expense'}</h2>
          <p>Track your spending with precision.</p>
        </div>

        <form onSubmit={handleSubmit} className="premium-modal-form">
          {/* Giant Amount Input */}
          <div className="form-group amount-group">
            <span className="currency-symbol">₹</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              min="1"
              step="any"
              className="giant-amount-input"
            />
          </div>

          <div className="form-group">
            <label className="floating-label">Merchant / Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Starbucks, Uber"
              required
              className="premium-input"
            />
          </div>

          <div className="form-group">
            <label className="floating-label">Category</label>
            <div className="category-grid">
              {CATEGORIES.map(cat => {
                const styles = getCategoryStyles(cat);
                const isSelected = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    className={`category-icon-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => setCategory(cat)}
                    style={{
                      backgroundColor: isSelected ? styles.bg : 'transparent',
                      borderColor: isSelected ? styles.color : 'var(--color-border)',
                      color: isSelected ? styles.color : 'var(--color-text-muted)'
                    }}
                  >
                    {styles.icon}
                    <span>{cat}</span>
                    {isSelected && (
                      <div className="selected-check" style={{ backgroundColor: styles.color }}>
                        <Check size={10} color="#fff" strokeWidth={4} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label className="floating-label">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="premium-input"
            />
          </div>

          <button 
            type="submit" 
            className={`premium-submit-btn ${isSubmitting ? 'submitting' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="spinner"></span>
            ) : (
              initialData ? 'Save Changes' : 'Add Expense'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
