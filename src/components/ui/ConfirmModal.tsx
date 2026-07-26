import React from 'react';
import { Button } from './Button';
import { X, AlertTriangle } from 'lucide-react';

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
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-danger)' }}>
            <AlertTriangle size={24} />
            <h2>{title}</h2>
          </div>
          <button className="btn-icon" onClick={onCancel}>
            <X size={24} color="var(--color-text-muted)" />
          </button>
        </div>
        
        <p style={{ color: 'var(--color-text-muted)' }}>{message}</p>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
          <Button variant="secondary" onClick={onCancel} style={{ flex: 1 }}>
            {cancelText}
          </Button>
          <Button variant="primary" onClick={onConfirm} style={{ flex: 1, backgroundColor: 'var(--color-danger)' }}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
