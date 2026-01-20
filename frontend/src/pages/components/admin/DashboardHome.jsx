import React, { useEffect, useState } from 'react';
import { getAllUsersApi, getAllProductsApi } from '../../../services/api';
import toast from 'react-hot-toast';
import './DashboardHome.css';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    activeUsers: 0,
    totalRevenue: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const usersResponse = await getAllUsersApi();
      const productsResponse = await getAllProductsApi();

      const users = usersResponse.data.users || [];
      const products = productsResponse.data.products || [];

      // Calculate total revenue (mock calculation)
      const revenue = products.reduce((sum, product) => sum + (parseFloat(product.price) || 0), 0);

      setStats({
        totalUsers: users.length,
        totalProducts: products.length,
        activeUsers: users.filter(user => user.is_active).length,
        totalRevenue: revenue.toFixed(2),
      });

      // Mock recent activities
      setRecentActivities([
        { id: 1, type: 'user', message: 'New user registered', time: '5 minutes ago' },
        { id: 2, type: 'product', message: 'Product added', time: '15 minutes ago' },
        { id: 3, type: 'sale', message: 'New sale completed', time: '1 hour ago' },
        { id: 4, type: 'user', message: 'User profile updated', time: '2 hours ago' },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: '👥',
      color: '#667eea',
      trend: '+12%',
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: '✅',
      color: '#48bb78',
      trend: '+8%',
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: '🦷',
      color: '#ed8936',
      trend: '+5%',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue}`,
      icon: '💰',
      color: '#9f7aea',
      trend: '+23%',
    },
  ];

  if (loading) {
    return (
      <div className="dashboard-home">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-home">
      <h1>Dashboard Overview</h1>
      
      <div className="stats-grid">
        {statCards.map((card, index) => (
          <div key={index} className="stat-card" style={{ borderTopColor: card.color }}>
            <div className="stat-icon" style={{ backgroundColor: card.color }}>
              {card.icon}
            </div>
            <div className="stat-info">
              <h3>{card.title}</h3>
              <p className="stat-value">{card.value}</p>
              <span className="stat-trend positive">{card.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-sections">
        <div className="recent-activities">
          <h2>Recent Activities</h2>
          <div className="activities-list">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  {activity.type === 'user' && '👤'}
                  {activity.type === 'product' && '📦'}
                  {activity.type === 'sale' && '💳'}
                </div>
                <div className="activity-details">
                  <p className="activity-message">{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <button className="action-btn">
              <span>➕</span>
              Add User
            </button>
            <button className="action-btn">
              <span>📦</span>
              Add Product
            </button>
            <button className="action-btn">
              <span>📊</span>
              View Reports
            </button>
            <button className="action-btn">
              <span>⚙️</span>
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
