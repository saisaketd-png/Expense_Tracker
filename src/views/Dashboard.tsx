import React, { useState } from 'react';
import { Bell, Plus, IndianRupee, PieChart as PieChartIcon, Target, Receipt, Wallet } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useExpenses } from '../context/ExpenseContext';
import { Button } from '../components/ui/Button';
import { SkeletonCard, SkeletonText, Skeleton } from '../components/ui/Skeleton';
import { AmountModal } from '../components/ui/AmountModal';
import { calculateTotal, calculateRemainingBudget, calculateBudgetUsedPercentage, groupTransactionsByCategory } from '../utils/finance';
import './Dashboard.css';

const COLORS = ['#2563EB', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6', '#EC4899', '#64748B'];

export const Dashboard: React.FC<{ onOpenAddModal?: () => void }> = ({ onOpenAddModal }) => {
  const { transactions, monthlyBudget, monthlyIncome, isInitializing, updateMonthlyBudget, updateMonthlyIncome } = useExpenses();
  
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);

  // Dynamic Calculations using finance utils
  const totalExpenses = calculateTotal(transactions, 'expense');
  const remainingBudget = calculateRemainingBudget(monthlyBudget, totalExpenses);
  const budgetUsedPercent = calculateBudgetUsedPercentage(totalExpenses, monthlyBudget);
  
  const categoryData = groupTransactionsByCategory(transactions, 'expense');
  const recentTransactions = transactions.slice(0, 5);

  const handleQuickAdd = () => {
    if (onOpenAddModal) {
      onOpenAddModal();
    }
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, name }: any) => {
    const RADIAN = Math.PI / 180;
    // Calculate label position to be outside the pie
    const radius = outerRadius * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
    return (
      <text x={x} y={y} fill="var(--color-text-main)" fontSize="12" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (isInitializing) {
    return (
      <div className="dashboard">
        <header className="header">
          <div>
            <SkeletonText lines={1} style={{ width: '150px', height: '28px', marginBottom: '8px' }} />
            <SkeletonText lines={1} style={{ width: '250px', height: '16px' }} />
          </div>
          <Skeleton style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
        </header>
        <div className="summary-grid">
          <SkeletonCard className="summary-card-primary" />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="dashboard-content">
          <div className="recent-transactions">
            <SkeletonText lines={1} style={{ width: '150px', height: '24px', marginBottom: '16px' }} />
            <div className="transaction-list">
              {[1, 2, 3, 4].map(i => (
                <SkeletonCard key={i} style={{ height: '70px', marginBottom: '12px' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="header">
        <div className="greeting">
          <h1>Dashboard</h1>
          <p>Here's your financial overview</p>
        </div>
        <button className="btn-icon" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
          <Bell size={20} color="var(--color-text-main)" />
        </button>
      </header>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card summary-card-primary" style={{ cursor: 'pointer' }} onClick={() => setIsBudgetModalOpen(true)}>
          <div className="summary-icon">
            <Target size={24} color="var(--color-primary)" />
          </div>
          <div>
            <p className="summary-label">Monthly Budget (Tap to set)</p>
            <h3 className="summary-amount">₹{monthlyBudget.toLocaleString('en-IN')}</h3>
            {monthlyBudget === 0 && <p style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '4px' }}>Set a budget to track spending</p>}
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon" style={{ background: 'var(--color-success-light)', color: 'var(--color-success)' }}>
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="summary-label">Total Expenses</p>
            <h3 className="summary-amount">₹{totalExpenses.toLocaleString('en-IN')}</h3>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon" style={{ background: 'var(--color-warning-light)', color: 'var(--color-warning)' }}>
            <Wallet size={24} />
          </div>
          <div>
            <p className="summary-label">Remaining Budget</p>
            <h3 className="summary-amount">₹{remainingBudget.toLocaleString('en-IN')}</h3>
            <div className="progress-bar-container">
              <div className="progress-bar" style={{ width: `${budgetUsedPercent}%`, backgroundColor: budgetUsedPercent > 90 ? 'var(--color-danger)' : 'white' }}></div>
            </div>
          </div>
        </div>

        <div className="summary-card" style={{ cursor: 'pointer' }} onClick={() => setIsIncomeModalOpen(true)}>
          <div className="summary-icon" style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
            <IndianRupee size={24} />
          </div>
          <div>
            <p className="summary-label">Monthly Income (Tap to set)</p>
            <h3 className="summary-amount">₹{monthlyIncome.toLocaleString('en-IN')}</h3>
            {monthlyIncome === 0 && <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>Set your income to track savings</p>}
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-transactions">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
            <h2>Recent Transactions</h2>
            <Button variant="secondary" onClick={handleQuickAdd}>
              <Plus size={16} /> Quick Add
            </Button>
          </div>
          
          {recentTransactions.length > 0 ? (
            <div className="transaction-list">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="transaction-item">
                  <div className="tx-left">
                    <div className="tx-icon">
                      <IndianRupee size={20} />
                    </div>
                    <div>
                      <h4>{tx.title}</h4>
                      <p>{tx.category} • {tx.date}</p>
                    </div>
                  </div>
                  <div className={`tx-amount ${tx.type === 'expense' ? 'amount-negative' : 'amount-positive'}`}>
                    {tx.type === 'expense' ? '-' : '+'}₹{tx.amount.toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state-small">
              <Receipt size={32} color="var(--color-text-muted)" />
              <p>No expenses yet.</p>
              <Button variant="secondary" onClick={handleQuickAdd} style={{ marginTop: 'var(--spacing-sm)' }}>Add your first expense</Button>
            </div>
          )}
        </div>

        <div className="spending-chart">
          <h2>Spending by Category</h2>
          {categoryData.length > 0 ? (
            <div className="chart-wrapper" style={{ height: '350px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={renderCustomizedLabel}
                    labelLine={true}
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `₹${value}`} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-state-small" style={{ height: '350px' }}>
              <PieChartIcon size={40} color="var(--color-text-muted)" />
              <p>Chart will appear once you add expenses.</p>
            </div>
          )}
        </div>
      </div>

      <AmountModal 
        isOpen={isBudgetModalOpen} 
        onClose={() => setIsBudgetModalOpen(false)} 
        title="Set Monthly Budget"
        initialAmount={monthlyBudget}
        onSave={updateMonthlyBudget}
      />

      <AmountModal 
        isOpen={isIncomeModalOpen} 
        onClose={() => setIsIncomeModalOpen(false)} 
        title="Set Monthly Income"
        initialAmount={monthlyIncome}
        onSave={updateMonthlyIncome}
      />
    </div>
  );
};
