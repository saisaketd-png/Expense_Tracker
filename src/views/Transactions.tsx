import React, { useState, useMemo } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import type { Transaction } from '../context/ExpenseContext';
import { useToast } from '../context/ToastContext';
import { Edit2, Trash2, IndianRupee, Receipt } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { AddExpenseModal } from '../components/ui/AddExpenseModal';
import { SkeletonCard, SkeletonText, Skeleton } from '../components/ui/Skeleton';
import './Transactions.css';

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest';

export const Transactions: React.FC = () => {
  const { transactions, deleteTransaction, isInitializing } = useExpenses();
  const { showToast } = useToast();
  
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  
  // Modals state
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [deletingTxId, setDeletingTxId] = useState<string | null>(null);

  const expensesOnly = transactions.filter(tx => tx.type === 'expense');

  const sortedTransactions = useMemo(() => {
    return [...expensesOnly].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'highest':
          return b.amount - a.amount;
        case 'lowest':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
  }, [expensesOnly, sortBy]);

  const handleDeleteConfirm = () => {
    if (deletingTxId) {
      deleteTransaction(deletingTxId);
      showToast('Transaction deleted successfully', 'info');
      setDeletingTxId(null);
    }
  };

  if (isInitializing) {
    return (
      <div className="transactions-page animate-fade-in">
        <div className="transactions-header">
          <SkeletonText lines={1} style={{ width: '150px', height: '28px' }} />
        </div>
        <div className="controls-bar">
          <Skeleton style={{ width: '180px', height: '36px', borderRadius: 'var(--radius-sm)' }} />
        </div>
        <div className="transactions-list">
          {[1, 2, 3, 4, 5].map(i => (
            <SkeletonCard key={i} style={{ height: '80px', marginBottom: '12px' }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="transactions-page">
      <div className="transactions-header">
        <h1>Transactions</h1>
      </div>

      <div className="controls-bar">
        <select 
          className="sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
        >
          <option value="newest">Sort by: Newest First</option>
          <option value="oldest">Sort by: Oldest First</option>
          <option value="highest">Sort by: Highest Amount</option>
          <option value="lowest">Sort by: Lowest Amount</option>
        </select>
      </div>

      {sortedTransactions.length > 0 ? (
        <div className="transactions-list">
          {sortedTransactions.map(tx => (
            <div className="transaction-card" key={tx.id}>
              <div className="transaction-card-main">
                <div className="transaction-info">
                  <div className="transaction-icon">
                    <IndianRupee size={20} />
                  </div>
                  <div className="transaction-details">
                    <h4>{tx.title}</h4>
                    <p>{tx.category} • {tx.date}</p>
                  </div>
                </div>
                <div className="transaction-amount amount-negative">
                  -₹{tx.amount.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="transaction-actions">
                <Button variant="ghost" isIcon onClick={() => setEditingTx(tx)}>
                  <Edit2 size={16} />
                </Button>
                <Button variant="ghost" isIcon onClick={() => setDeletingTxId(tx.id)} style={{ color: 'var(--color-danger)' }}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Receipt size={40} />
          </div>
          <div>
            <h3>No expenses yet</h3>
            <p>Your transaction history will appear here once you add an expense.</p>
          </div>
        </div>
      )}

      <AddExpenseModal 
        isOpen={!!editingTx} 
        onClose={() => setEditingTx(null)} 
        initialData={editingTx}
      />

      <ConfirmModal
        isOpen={!!deletingTxId}
        title="Delete Transaction"
        message="Are you sure you want to delete this expense? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingTxId(null)}
      />
    </div>
  );
};
