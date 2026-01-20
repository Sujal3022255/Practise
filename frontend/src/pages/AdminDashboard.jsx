import React, { useState } from 'react';
import Sidebar from './components/admin/Sidebar';
import DashboardHome from './components/admin/DashboardHome';
import UserManagement from './components/admin/UserManagement';
import ProductManagement from './components/admin/ProductManagement';
import Analytics from './components/admin/Analytics';
import Notifications from './components/admin/Notifications';
import Settings from './components/admin/Settings';
import Logs from './components/admin/Logs';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardHome />;
      case 'users':
        return <UserManagement />;
      case 'products':
        return <ProductManagement />;
      case 'analytics':
        return <Analytics />;
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <Settings />;
      case 'logs':
        return <Logs />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
