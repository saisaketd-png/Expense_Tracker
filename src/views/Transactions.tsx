import React, { useState, useMemo } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import type { Transaction } from '../context/ExpenseContext';
import { useToast } from '../context/ToastContext';
import { Edit2, Trash2, ArrowUpDown, Receipt } from 'lucide-react';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { AddExpenseModal } from '../components/ui/AddExpenseModal';
import { SkeletonCard, SkeletonText, Skeleton } from '../components/ui/Skeleton';
import { getCategoryStyles } from '../utils/categoryIcons';
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
        case 'newest': {
          const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
          return diff !== 0 ? diff : b.id.localeCompare(a.id);
        }
        case 'oldest': {
          const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
          return diff !== 0 ? diff : a.id.localeCompare(b.id);
        }
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
        <div className="sort-wrapper">
          <ArrowUpDown size={16} className="sort-icon" />
          <select 
            className="sort-select premium-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest</option>
            <option value="lowest">Lowest</option>
          </select>
        </div>
      </div>

      {sortedTransactions.length > 0 ? (
        <div className="transactions-list">
          {sortedTransactions.map(tx => {
            const styles = getCategoryStyles(tx.category);
            
            return (
              <div 
                className="premium-transaction-card" 
                key={tx.id}
                style={{ '--tx-color': styles.color } as React.CSSProperties}
              >
                <div className="tx-card-content">
                  <div className="tx-main">
                    <div className="tx-icon-wrapper" style={{ backgroundColor: styles.bg, color: styles.color }}>
                      {styles.icon}
                    </div>
                    <div className="tx-details">
                      <h4>{tx.title}</h4>
                      <p className="tx-meta">{tx.category} <span className="meta-dot">&bull;</span> {formatDate(tx.date)}</p>
                    </div>
                  </div>
                  
                  <div className="tx-actions-wrapper">
                    <div className="tx-amount">
                      -₹{tx.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="tx-actions">
                      <button 
                        className="tx-action-btn edit-btn" 
                        onClick={() => setEditingTx(tx)}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="tx-action-btn delete-btn" 
                        onClick={() => setDeletingTxId(tx.id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="tx-animated-border"></div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state premium-empty-state">
          <div className="empty-state-icon">
            <Receipt size={48} />
          </div>
          <h3>No transactions yet</h3>
          <p>Your expenses will appear here once you start tracking.</p>
        </div>
      )}

      {/* Editing Modal */}
      {editingTx && (
        <AddExpenseModal 
          isOpen={true} 
          onClose={() => setEditingTx(null)} 
          initialData={editingTx}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deletingTxId}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingTxId(null)}
      />
    </div>
  );
};
