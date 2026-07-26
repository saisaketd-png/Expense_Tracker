import React from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { SkeletonCard, SkeletonText } from '../components/ui/Skeleton';
import { calculateTotal, groupTransactionsByCategory } from '../utils/finance';
import { PieChart as PieChartIcon } from 'lucide-react';
import './Analytics.css';

const COLORS = ['#2563EB', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6', '#14B8A6', '#EC4899', '#64748B'];

export const Analytics: React.FC = () => {
  const { transactions, isInitializing } = useExpenses();

  const totalExpenses = calculateTotal(transactions, 'expense');
  const categoryData = groupTransactionsByCategory(transactions, 'expense');

  // Data for Line Chart (Trend by date)
  const trendData = React.useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const data = expenses.reduce((acc, curr) => {
      const date = new Date(curr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const existing = acc.find(item => item.date === date);
      if (existing) {
        existing.amount += curr.amount;
      } else {
        acc.push({ date, amount: curr.amount, rawDate: new Date(curr.date).getTime() });
      }
      return acc;
    }, [] as { date: string; amount: number; rawDate: number }[]);
    
    // Sort chronologically
    return data.sort((a, b) => a.rawDate - b.rawDate);
  }, [transactions]);

  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, name }: any) => {
    const RADIAN = Math.PI / 180;
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
      <div className="analytics-page animate-fade-in">
        <div className="analytics-header">
          <SkeletonText lines={1} style={{ width: '150px', height: '28px' }} />
        </div>
        <SkeletonCard style={{ height: '300px' }} />
        <SkeletonCard style={{ height: '300px' }} />
      </div>
    );
  }

  if (totalExpenses === 0) {
    return (
      <div className="analytics-page">
        <div className="analytics-header">
          <h1>Analytics</h1>
        </div>
        <div className="empty-analytics" style={{ border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
          <PieChartIcon size={48} color="var(--color-text-muted)" style={{ marginBottom: '16px' }} />
          <h3>No Data Available</h3>
          <p>Start adding expenses to see your spending trends and category breakdown.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <div className="analytics-header">
        <h1>Analytics</h1>
      </div>

      {/* Spending Trend Line Chart */}
      <div className="analytics-card">
        <h3 className="analytics-card-title">Spending Trend</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
              <Tooltip 
                formatter={(value: any) => [`₹${value}`, 'Spent']}
                contentStyle={{ borderRadius: '8px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}
              />
              <Line type="monotone" dataKey="amount" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--color-primary)' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Pie Chart & Breakdown */}
      <div className="analytics-card">
        <h3 className="analytics-card-title">Category Breakdown</h3>
        <div className="chart-container" style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
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
        
        <div className="category-list" style={{ marginTop: 'var(--spacing-md)' }}>
          {categoryData.map((cat, index) => (
            <div className="category-item" key={cat.name}>
              <div className="category-item-left">
                <div className="category-color-indicator" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="category-name">{cat.name}</span>
              </div>
              <span className="category-amount">₹{cat.value.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
