import React, { useState } from 'react';
import toast from 'react-hot-toast';
import './Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', title: 'System Update', message: 'System will be updated tonight at 2 AM', time: '5 min ago', read: false },
    { id: 2, type: 'message', title: 'New Message', message: 'You have a new message from John Doe', time: '15 min ago', read: false },
    { id: 3, type: 'email', title: 'Email Sent', message: 'Password reset email sent successfully', time: '1 hour ago', read: true },
    { id: 4, type: 'alert', title: 'Low Stock Alert', message: 'Product "Dental Floss" is running low', time: '2 hours ago', read: true },
    { id: 5, type: 'message', title: 'User Feedback', message: 'New feedback received from Jane Smith', time: '3 hours ago', read: false },
  ]);

  const [emailSettings, setEmailSettings] = useState({
    newUser: true,
    newOrder: true,
    lowStock: false,
    systemAlerts: true,
  });

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
    toast.success('Notification marked as read');
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    toast.success('All notifications marked as read');
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
    toast.success('Notification deleted');
  };

  const handleEmailSettingChange = (setting) => {
    setEmailSettings({
      ...emailSettings,
      [setting]: !emailSettings[setting]
    });
    toast.success('Email settings updated');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'alert': return '⚠️';
      case 'message': return '💬';
      case 'email': return '📧';
      default: return '🔔';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications">
      <div className="notifications-header">
        <h1>Notifications</h1>
        <div className="header-actions">
          <span className="unread-badge">{unreadCount} unread</span>
          <button className="mark-all-btn" onClick={markAllAsRead}>
            Mark all as read
          </button>
        </div>
      </div>

      <div className="notifications-content">
        <div className="notifications-list">
          <h2>Recent Notifications</h2>
          {notifications.length > 0 ? (
            <div className="notif-items">
              {notifications.map((notif) => (
                <div key={notif.id} className={`notif-item ${notif.read ? 'read' : 'unread'}`}>
                  <div className="notif-icon">{getIcon(notif.type)}</div>
                  <div className="notif-content">
                    <h3>{notif.title}</h3>
                    <p>{notif.message}</p>
                    <span className="notif-time">{notif.time}</span>
                  </div>
                  <div className="notif-actions">
                    {!notif.read && (
                      <button onClick={() => markAsRead(notif.id)} className="btn-mark">
                        ✓
                      </button>
                    )}
                    <button onClick={() => deleteNotification(notif.id)} className="btn-delete">
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-notifications">No notifications</p>
          )}
        </div>

        <div className="email-settings">
          <h2>Email Notification Settings</h2>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <h4>New User Registration</h4>
                <p>Receive emails when new users sign up</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={emailSettings.newUser}
                  onChange={() => handleEmailSettingChange('newUser')}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>New Orders</h4>
                <p>Get notified about new orders</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={emailSettings.newOrder}
                  onChange={() => handleEmailSettingChange('newOrder')}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>Low Stock Alerts</h4>
                <p>Alerts when product stock is low</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={emailSettings.lowStock}
                  onChange={() => handleEmailSettingChange('lowStock')}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="setting-item">
              <div className="setting-info">
                <h4>System Alerts</h4>
                <p>Important system notifications</p>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={emailSettings.systemAlerts}
                  onChange={() => handleEmailSettingChange('systemAlerts')}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
