import React from 'react';
import { Button } from './Button';
import { X, AlertTriangle } from 'lucide-react';
import './AddExpenseModal.css';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="premium-modal-overlay" onClick={onCancel}>
      <div className="premium-modal-content animate-slide-up" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <button className="premium-modal-close" onClick={onCancel}>
          <X size={20} />
        </button>
        <div className="premium-modal-header" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ color: 'var(--color-danger)', display: 'flex' }}>
            <AlertTriangle size={28} />
          </div>
          <h2>{title}</h2>
        </div>
        
        <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6', fontSize: '1rem' }}>
          {message}
        </p>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
          <Button variant="secondary" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
