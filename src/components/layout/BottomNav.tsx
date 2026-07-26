import React from 'react';
import { Home, PieChart, Plus, User } from 'lucide-react';
import './BottomNav.css';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => onTabChange('home')}
      >
        <Home size={24} />
        <span>Home</span>
      </button>
      
      <button 
        className={`nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
        onClick={() => onTabChange('transactions')}
      >
        <PieChart size={24} />
        <span>History</span>
      </button>
      
      <button 
        className="nav-item nav-item-add"
        onClick={() => onTabChange('add')}
      >
        <div className="btn-icon">
          <Plus size={28} />
        </div>
      </button>
      
      <button 
        className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
        onClick={() => onTabChange('analytics')}
      >
        <PieChart size={24} />
        <span>Analytics</span>
      </button>
      
      <button 
        className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => onTabChange('profile')}
      >
        <User size={24} />
        <span>Profile</span>
      </button>
    </nav>
  );
};
