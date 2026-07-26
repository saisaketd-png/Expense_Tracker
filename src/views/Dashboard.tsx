import React, { useState, useEffect } from 'react';
import { Bell, Plus, ArrowUpRight, ArrowDownRight, Target, Wallet, Receipt, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';
import { useExpenses } from '../context/ExpenseContext';
import { SkeletonCard, SkeletonText, Skeleton } from '../components/ui/Skeleton';
import { AmountModal } from '../components/ui/AmountModal';
import { AnimatedNumber } from '../components/ui/AnimatedNumber';
import { calculateTotal, calculateRemainingBudget, calculateBudgetUsedPercentage } from '../utils/finance';
import { Transactions } from './Transactions';
import { Analytics } from './Analytics';
import './Dashboard.css';

export const Dashboard: React.FC<{ onOpenAddModal?: () => void }> = ({ onOpenAddModal }) => {
  const { transactions, monthlyBudget, monthlyIncome, isInitializing, updateMonthlyBudget, updateMonthlyIncome } = useExpenses();
  
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [greeting, setGreeting] = useState('Good Morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Calculations
  const totalExpenses = calculateTotal(transactions, 'expense');
  const remainingBudget = calculateRemainingBudget(monthlyBudget, totalExpenses);
  const budgetUsedPercent = calculateBudgetUsedPercentage(totalExpenses, monthlyBudget);
  const savings = monthlyIncome > 0 ? monthlyIncome - totalExpenses : 0;
  const savingsRate = monthlyIncome > 0 ? Math.round((savings / monthlyIncome) * 100) : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  if (isInitializing) {
    return (
      <div className="dashboard animate-fade-in">
        <header className="header">
          <div>
            <SkeletonText lines={1} style={{ width: '150px', height: '28px', marginBottom: '8px' }} />
            <SkeletonText lines={1} style={{ width: '250px', height: '16px' }} />
          </div>
          <Skeleton style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
        </header>
        <div className="hero-section">
          <SkeletonCard style={{ height: '300px' }} />
        </div>
      </div>
    );
  }

  return (
    <motion.div className="dashboard animate-fade-in" initial="hidden" animate="show" variants={containerVariants}>
      {/* 1. Greeting Section */}
      <motion.header className="header" variants={itemVariants}>
        <div className="greeting-section">
          <h1>{greeting}!</h1>
          <p className="date-subtitle">{currentDate}</p>
        </div>
        <div className="header-actions">
          <button className="premium-icon-btn" onClick={() => onOpenAddModal && onOpenAddModal()} title="Add Expense">
            <Plus size={20} />
          </button>
          <button className="premium-icon-btn">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>
          <div className="profile-avatar">
            <img src="https://ui-avatars.com/api/?name=User&background=5B4CF0&color=fff&rounded=true&bold=true" alt="Profile" />
          </div>
        </div>
      </motion.header>

      {/* 2. Financial Hero Section */}
      <motion.section className="hero-section" variants={itemVariants}>
        <div className="hero-card">
          <div className="hero-bg-glow"></div>
          <div className="hero-content">
            <div className="hero-main-balance">
              <p className="hero-label">Total Balance</p>
              <h2 className="hero-amount">
                <AnimatedNumber value={remainingBudget} prefix="₹" />
              </h2>
            </div>
            
            <div className="hero-progress">
              <div className="progress-ring-container">
                <svg className="progress-ring" width="120" height="120">
                  <circle className="progress-ring-bg" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="transparent" r="52" cx="60" cy="60"/>
                  <circle className="progress-ring-fill" stroke="url(#progressGradient)" strokeWidth="8" fill="transparent" r="52" cx="60" cy="60" 
                    style={{ strokeDasharray: `${2 * Math.PI * 52}`, strokeDashoffset: `${2 * Math.PI * 52 * (1 - budgetUsedPercent / 100)}` }}
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#38BDF8" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="progress-text">
                  <span className="progress-percent">{Math.round(budgetUsedPercent)}%</span>
                  <span className="progress-label">Spent</span>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-stats">
            <div className="hero-stat-item">
              <p className="stat-label">Income</p>
              <p className="stat-value">₹{monthlyIncome.toLocaleString('en-IN')}</p>
            </div>
            <div className="hero-stat-item">
              <p className="stat-label">Budget</p>
              <p className="stat-value">₹{monthlyBudget.toLocaleString('en-IN')}</p>
            </div>
            <div className="hero-stat-item">
              <p className="stat-label">Expenses</p>
              <p className="stat-value">₹{totalExpenses.toLocaleString('en-IN')}</p>
            </div>
            <div className="hero-stat-item">
              <p className="stat-label">Savings</p>
              <p className="stat-value">₹{savings.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 3. Quick Actions */}
      <motion.section className="quick-actions" variants={itemVariants}>
        <button className="quick-action-btn primary" onClick={() => onOpenAddModal && onOpenAddModal()}>
          <div className="qa-icon"><Plus size={20} /></div>
          <span>Add Expense</span>
        </button>
        <button className="quick-action-btn secondary" onClick={() => setIsIncomeModalOpen(true)}>
          <div className="qa-icon"><ArrowDownRight size={20} /></div>
          <span>Add Income</span>
        </button>
        <button className="quick-action-btn tertiary" onClick={() => setIsBudgetModalOpen(true)}>
          <div className="qa-icon"><Target size={20} /></div>
          <span>Update Budget</span>
        </button>
      </motion.section>

      {/* 4. Financial Summary Cards */}
      <motion.section className="summary-section" variants={itemVariants}>
        <div className="summary-grid">
          <motion.div className="premium-card" onClick={() => setIsBudgetModalOpen(true)} variants={itemVariants} whileHover={{ y: -4 }}>
            <div className="card-header">
              <div className="icon-wrapper primary"><Target size={24} /></div>
              <span className="trend-indicator"><ArrowUpRight size={14} /> Set limits</span>
            </div>
            <div className="card-body">
              <h3 className="card-amount"><AnimatedNumber value={monthlyBudget} prefix="₹" /></h3>
              <p className="card-label">Monthly Budget</p>
            </div>
          </motion.div>

          <motion.div className="premium-card" onClick={() => setIsIncomeModalOpen(true)} variants={itemVariants} whileHover={{ y: -4 }}>
            <div className="card-header">
              <div className="icon-wrapper accent"><Wallet size={24} /></div>
              <span className="trend-indicator positive"><ArrowDownRight size={14} /> +Income</span>
            </div>
            <div className="card-body">
              <h3 className="card-amount"><AnimatedNumber value={monthlyIncome} prefix="₹" /></h3>
              <p className="card-label">Monthly Income</p>
            </div>
          </motion.div>

          <motion.div className="premium-card" variants={itemVariants} whileHover={{ y: -4 }}>
            <div className="card-header">
              <div className="icon-wrapper secondary"><Receipt size={24} /></div>
              <span className="trend-indicator negative"><ArrowUpRight size={14} /> {Math.round(budgetUsedPercent)}% used</span>
            </div>
            <div className="card-body">
              <h3 className="card-amount"><AnimatedNumber value={totalExpenses} prefix="₹" /></h3>
              <p className="card-label">Total Expenses</p>
            </div>
          </motion.div>

          <motion.div className="premium-card" variants={itemVariants} whileHover={{ y: -4 }}>
            <div className="card-header">
              <div className="icon-wrapper success"><IndianRupee size={24} /></div>
              <span className="trend-indicator positive"><ArrowDownRight size={14} /> {savingsRate}% saved</span>
            </div>
            <div className="card-body">
              <h3 className="card-amount"><AnimatedNumber value={savings} prefix="₹" /></h3>
              <p className="card-label">Total Savings</p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Placeholders for Analytics & Transactions that will be populated via routing or embedded later */}
      <motion.section className="analytics-preview" variants={itemVariants}>
         <Analytics />
      </motion.section>
      
      <motion.section className="transactions-preview" variants={itemVariants}>
         <Transactions />
      </motion.section>

      {isBudgetModalOpen && (
        <AmountModal
          isOpen={true}
          title="Set Monthly Budget"
          initialAmount={monthlyBudget}
          onSave={updateMonthlyBudget}
          onClose={() => setIsBudgetModalOpen(false)}
        />
      )}

      {isIncomeModalOpen && (
        <AmountModal
          isOpen={true}
          title="Set Monthly Income"
          initialAmount={monthlyIncome}
          onSave={updateMonthlyIncome}
          onClose={() => setIsIncomeModalOpen(false)}
        />
      )}
    </motion.div>
  );
};
