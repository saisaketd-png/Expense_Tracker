import type { Transaction } from '../context/ExpenseContext';

export const calculateTotal = (transactions: Transaction[], type: 'expense' | 'income'): number => {
  return transactions
    .filter(tx => tx.type === type)
    .reduce((sum, tx) => sum + tx.amount, 0);
};

export const calculateRemainingBudget = (budget: number, expenses: number): number => {
  return Math.max(0, budget - expenses);
};

export const calculateSavings = (income: number, expenses: number): number => {
  return Math.max(0, income - expenses);
};

export const calculateBudgetUsedPercentage = (expenses: number, budget: number): number => {
  if (budget <= 0) return 0;
  return Math.min(100, (expenses / budget) * 100);
};

export interface CategoryData {
  name: string;
  value: number;
}

export const groupTransactionsByCategory = (transactions: Transaction[], type: 'expense' | 'income'): CategoryData[] => {
  const filtered = transactions.filter(t => t.type === type);
  
  const grouped = filtered.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, [] as CategoryData[]);
  
  return grouped.sort((a, b) => b.value - a.value);
};
