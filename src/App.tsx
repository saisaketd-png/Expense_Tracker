import { useState } from 'react';
import './App.css';
import { BottomNav } from './components/layout/BottomNav';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './views/Dashboard';
import { Transactions } from './views/Transactions';
import { Analytics } from './views/Analytics';
import { User } from 'lucide-react';
import { ExpenseProvider } from './context/ExpenseContext';
import { ToastProvider } from './context/ToastContext';
import { AddExpenseModal } from './components/ui/AddExpenseModal';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    if (tab === 'add') {
      setIsAddModalOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  const renderView = () => {
    switch (activeTab) {
      case 'home':
        return <Dashboard onOpenAddModal={() => setIsAddModalOpen(true)} />;
      case 'transactions':
        return <Transactions />;
      case 'analytics':
        return <Analytics />;
      case 'profile':
        return (
          <div className="placeholder-view">
            <User size={64} color="var(--color-primary)" />
            <h2>Profile coming soon</h2>
          </div>
        );
      default:
        return <Dashboard onOpenAddModal={() => setIsAddModalOpen(true)} />;
    }
  };

  return (
    <ToastProvider>
      <ExpenseProvider>
        <div className="app-layout">
          <Sidebar activeTab={activeTab} onTabChange={handleTabChange} onOpenAddModal={() => setIsAddModalOpen(true)} />
          <div className="view-container animate-fade-in" key={activeTab}>
            {renderView()}
          </div>
          <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
        <AddExpenseModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      </ExpenseProvider>
    </ToastProvider>
  );
}

export default App;
