import React, { useMemo } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, 
  AreaChart, Area, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { useExpenses } from '../context/ExpenseContext';
import { SkeletonCard, SkeletonText } from '../components/ui/Skeleton';
import { getCategoryStyles } from '../utils/categoryIcons';
import { motion } from 'framer-motion';
import { 
  groupTransactionsByCategory, 
  groupTransactionsByMonth 
} from '../utils/finance';
import './Analytics.css';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="premium-tooltip">
        <p className="tooltip-label">{label || payload[0].name}</p>
        <p className="tooltip-value">₹{payload[0].value.toLocaleString('en-IN')}</p>
      </div>
    );
  }
  return null;
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
};

export const Analytics: React.FC = () => {
  const { transactions, isInitializing } = useExpenses();
  
  const categoryData = useMemo(() => groupTransactionsByCategory(transactions, 'expense'), [transactions]);
  const monthlyData = useMemo(() => groupTransactionsByMonth(transactions, 'expense'), [transactions]);

  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, outerRadius, percent, name, value } = props;
    const RADIAN = Math.PI / 180;
    // Push the label slightly outside the pie
    const radius = outerRadius * 1.25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    // Using the getCategoryStyles to fetch exact color
    const styles = getCategoryStyles(name);
  
    return (
      <g>
        <text 
          x={x} 
          y={y - 8} 
          fill={styles.color} 
          fontSize="12" 
          fontWeight="700" 
          textAnchor={x > cx ? 'start' : 'end'} 
          dominantBaseline="central"
        >
          {name}
        </text>
        <text 
          x={x} 
          y={y + 8} 
          fill="var(--color-text-secondary)" 
          fontSize="11" 
          fontWeight="500" 
          textAnchor={x > cx ? 'start' : 'end'} 
          dominantBaseline="central"
        >
          ₹{value.toLocaleString('en-IN')} ({(percent * 100).toFixed(0)}%)
        </text>
      </g>
    );
  };

  if (isInitializing) {
    return (
      <div className="analytics-page">
        <div className="analytics-header">
          <SkeletonText lines={1} style={{ width: '150px', height: '32px' }} />
        </div>
        <div className="analytics-grid">
          <SkeletonCard style={{ height: '450px' }} />
          <SkeletonCard style={{ height: '450px' }} />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="analytics-page"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      <motion.div className="analytics-header" variants={itemVariants}>
        <h1>Analytics</h1>
      </motion.div>

      <div className="analytics-grid">
        {/* Category Breakdown Pie Chart */}
        <motion.div className="premium-analytics-card" variants={itemVariants}>
          <div className="card-header-simple">
            <h3>Category Breakdown</h3>
            <p className="subtitle">Where your money goes</p>
          </div>
          
          {categoryData.length > 0 ? (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={200}>
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
                    labelLine={{ stroke: 'var(--color-border)', strokeWidth: 1 }}
                    stroke="var(--color-card)"
                    strokeWidth={2}
                    isAnimationActive={true}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  >
                    {categoryData.map((entry, index) => {
                       const styles = getCategoryStyles(entry.name);
                       return <Cell key={`cell-${index}`} fill={styles.color} />;
                    })}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="custom-legend">
                {categoryData.map((entry, i) => {
                  const styles = getCategoryStyles(entry.name);
                  return (
                    <motion.div 
                      className="legend-item" 
                      key={entry.name}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      viewport={{ once: true }}
                    >
                      <div className="legend-icon-wrapper" style={{ backgroundColor: styles.bg, color: styles.color }}>
                        {styles.icon}
                      </div>
                      <div className="legend-text">
                        <span className="legend-name">{entry.name}</span>
                        <span className="legend-amount">₹{entry.value.toLocaleString('en-IN')}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="empty-chart">
              <p>No data to display.</p>
            </div>
          )}
        </motion.div>

        {/* Monthly Trend Area Chart */}
        <motion.div className="premium-analytics-card" variants={itemVariants}>
          <div className="card-header-simple">
            <h3>Monthly Trend</h3>
            <p className="subtitle">Your spending over time</p>
          </div>
          
          {monthlyData.length > 0 ? (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart
                  data={monthlyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--color-text-secondary)', fontSize: 12, fontWeight: 500 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--color-text-secondary)', fontSize: 12, fontWeight: 500 }}
                    tickFormatter={(value) => `₹${value}`}
                    dx={-10}
                  />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="var(--color-primary)" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorAmount)" 
                    animationDuration={1500}
                    activeDot={{ r: 6, fill: 'var(--color-card)', stroke: 'var(--color-primary)', strokeWidth: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="empty-chart">
              <p>No data to display.</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
