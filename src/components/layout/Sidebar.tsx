import React from 'react';
import { LayoutDashboard, Receipt, PieChart, Settings, LogOut, Hexagon } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Floating Sidebar */}
      <nav className="premium-sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Hexagon size={28} fill="var(--color-primary)" stroke="var(--color-card)" strokeWidth={1} />
          </div>
          <span className="brand-text">Fintech</span>
        </div>

        <div className="sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <div className="nav-icon-wrapper">
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className="nav-label">{item.label}</span>
                {isActive && <div className="active-indicator" />}
              </button>
            );
          })}
        </div>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn">
            <div className="nav-icon-wrapper">
              <LogOut size={20} />
            </div>
            <span className="nav-label">Log Out</span>
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        {navItems.slice(0, 4).map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(item.id)}
            >
              <div className="mobile-icon-wrapper">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {isActive && <div className="mobile-active-dot" />}
              </div>
              <span className="mobile-nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
