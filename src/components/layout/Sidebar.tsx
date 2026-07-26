import React from 'react';
import { Home, PieChart, Wallet, User, Plus } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenAddModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, onOpenAddModal }) => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Wallet size={28} />
        <span className="logo-text">Tracker</span>
      </div>

      <nav className="sidebar-nav">
        <button 
          className={`sidebar-item ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => onTabChange('home')}
        >
          <Home size={24} />
          <span className="sidebar-item-label">Dashboard</span>
        </button>
        
        <button 
          className={`sidebar-item ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => onTabChange('transactions')}
        >
          <Wallet size={24} />
          <span className="sidebar-item-label">Transactions</span>
        </button>

        <button 
          className={`sidebar-item ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => onTabChange('analytics')}
        >
          <PieChart size={24} />
          <span className="sidebar-item-label">Analytics</span>
        </button>
        
        <button 
          className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => onTabChange('profile')}
        >
          <User size={24} />
          <span className="sidebar-item-label">Profile</span>
        </button>
      </nav>

      <button className="sidebar-add-btn" onClick={onOpenAddModal}>
        <Plus size={24} />
        <span className="sidebar-add-label">Add Expense</span>
      </button>
    </aside>
  );
};
