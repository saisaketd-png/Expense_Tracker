import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  type: 'expense' | 'income';
}

export interface ExpenseContextType {
  transactions: Transaction[];
  monthlyBudget: number;
  monthlyIncome: number;
  isInitializing: boolean;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  editTransaction: (id: string, tx: Partial<Transaction>) => void;
  updateMonthlyBudget: (amount: number) => void;
  updateMonthlyIncome: (amount: number) => void;
  budgetStartDate: string;
  budgetEndDate: string;
  updateBudgetRange: (start: string, end: string) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isInitializing, setIsInitializing] = useState(true);
  
  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('expense_tracker_v2_budget');
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return 0; // Default empty state
  });

  const [monthlyIncome, setMonthlyIncome] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('expense_tracker_v2_income');
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    return 0; // Default empty state
  });

  const [budgetStartDate, setBudgetStartDate] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('expense_tracker_v2_budget_start');
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    return firstDay.toISOString().split('T')[0];
  });

  const [budgetEndDate, setBudgetEndDate] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('expense_tracker_v2_budget_end');
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {}
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return lastDay.toISOString().split('T')[0];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const savedExpenses = localStorage.getItem('expense_tracker_v2_data');
      if (savedExpenses) {
        return JSON.parse(savedExpenses);
      }
    } catch (error) {
      console.error('Error loading expenses from local storage', error);
    }
    return []; // No mock data!
  });

  // Save to local storage whenever state changes
  React.useEffect(() => {
    try {
      localStorage.setItem('expense_tracker_v2_data', JSON.stringify(transactions));
      localStorage.setItem('expense_tracker_v2_budget', JSON.stringify(monthlyBudget));
      localStorage.setItem('expense_tracker_v2_income', JSON.stringify(monthlyIncome));
      localStorage.setItem('expense_tracker_v2_budget_start', JSON.stringify(budgetStartDate));
      localStorage.setItem('expense_tracker_v2_budget_end', JSON.stringify(budgetEndDate));
    } catch (error) {
      console.error('Error saving to local storage', error);
    }
  }, [transactions, monthlyBudget, monthlyIncome, budgetStartDate, budgetEndDate]);

  // Simulate network delay for skeletons
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx = { ...tx, id: Math.random().toString(36).substr(2, 9) };
    setTransactions(prev => [newTx, ...prev]);
  };

  const editTransaction = (id: string, updatedTx: Partial<Transaction>) => {
    setTransactions(prev => prev.map(tx => (tx.id === id ? { ...tx, ...updatedTx } : tx)));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  const updateMonthlyBudget = (amount: number) => {
    setMonthlyBudget(amount);
  };

  const updateMonthlyIncome = (amount: number) => {
    setMonthlyIncome(amount);
  };

  const updateBudgetRange = (start: string, end: string) => {
    setBudgetStartDate(start);
    setBudgetEndDate(end);
  };

  return (
    <ExpenseContext.Provider value={{ 
      transactions, 
      monthlyBudget, 
      monthlyIncome,
      isInitializing, 
      addTransaction, 
      editTransaction, 
      deleteTransaction,
      updateMonthlyBudget,
      updateMonthlyIncome,
      budgetStartDate,
      budgetEndDate,
      updateBudgetRange
    }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
