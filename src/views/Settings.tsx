import React from 'react';
import { motion } from 'framer-motion';
import { useExpenses } from '../context/ExpenseContext';
import { Trash2, AlertCircle } from 'lucide-react';
import './Settings.css';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export const Settings: React.FC = () => {
  const { budgetStartDate, budgetEndDate } = useExpenses();

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all data? This cannot be undone.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <motion.div 
      className="settings-page"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.div className="settings-header" variants={itemVariants}>
        <h1>Settings</h1>
        <p>Manage your preferences and data</p>
      </motion.div>

      <motion.div className="settings-section" variants={itemVariants}>
        <h2 className="settings-section-title">Budgeting Preferences</h2>
        
        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-label">Current Budget Date Range</span>
            <span className="setting-desc">The start and end date for your current budget cycle. (Update this in the Dashboard)</span>
          </div>
          <div className="setting-control" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
            {budgetStartDate} to {budgetEndDate}
          </div>
        </div>
      </motion.div>

      <motion.div className="settings-section" variants={itemVariants}>
        <h2 className="settings-section-title">Data Management</h2>
        
        <div className="setting-row">
          <div className="setting-info">
            <span className="setting-label">Erase All Data</span>
            <span className="setting-desc">Permanently delete all your transactions and budgets.</span>
          </div>
          <div className="setting-control">
            <button className="danger-btn" onClick={handleClearData}>
              <Trash2 size={16} style={{ marginRight: '8px', verticalAlign: 'text-bottom' }} />
              Clear Data
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
