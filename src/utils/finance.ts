import type { Transaction } from '../context/ExpenseContext';

export const calculateTotal = (transactions: Transaction[], type: 'income' | 'expense') => {
  return transactions
    .filter(t => t.type === type)
    .reduce((acc, curr) => acc + curr.amount, 0);
};

export const calculateRemainingBudget = (budget: number, expenses: number) => {
  return budget - expenses;
};

export const calculateBudgetUsedPercentage = (expenses: number, budget: number) => {
  if (budget === 0) return 0;
  const percentage = (expenses / budget) * 100;
  return Math.min(percentage, 100);
};

export const groupTransactionsByCategory = (transactions: Transaction[], type: 'income' | 'expense') => {
  const filtered = transactions.filter(t => t.type === type);
  
  const grouped = filtered.reduce((acc, curr) => {
    if (!acc[curr.category]) {
      acc[curr.category] = 0;
    }
    acc[curr.category] += curr.amount;
    return acc;
  }, {} as Record<string, number>);

  return Object.keys(grouped).map(key => ({
    name: key,
    value: grouped[key]
  })).sort((a, b) => b.value - a.value);
};

export const groupTransactionsByMonth = (transactions: Transaction[], type?: 'expense' | 'income') => {
  const filtered = type ? transactions.filter(t => t.type === type) : transactions;
  
  const grouped = filtered.reduce((acc, curr) => {
    // Format "YYYY-MM"
    const month = curr.date.substring(0, 7);
    if (!acc[month]) {
      acc[month] = 0;
    }
    acc[month] += curr.amount;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array and sort chronologically
  return Object.keys(grouped)
    .sort()
    .map(key => ({
      name: key,
      amount: grouped[key]
    }));
};
