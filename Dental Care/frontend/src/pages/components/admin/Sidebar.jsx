import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import './Sidebar.css';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const { user, logout } = useAuth();
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'products', label: 'Products', icon: '🦷' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'logs', label: 'Logs', icon: '🧾' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
        <p>Dental Care</p>
        {user && (
          <div className="user-info">
            <p className="user-name">{user.firstname || user.email}</p>
            <span className="user-role">{user.role || 'Admin'}</span>
          </div>
        )}
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => setActiveSection(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
        <button className="nav-item logout-btn" onClick={logout}>
          <span className="nav-icon">🚪</span>
          <span className="nav-label">Logout</span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
