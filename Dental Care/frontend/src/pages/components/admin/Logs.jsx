import React, { useState } from 'react';
import './Logs.css';

const Logs = () => {
  const [activeTab, setActiveTab] = useState('activity');

  const activityLogs = [
    { id: 1, user: 'Admin', action: 'User Created', details: 'Created user: john@example.com', timestamp: '2026-01-08 10:30 AM', status: 'success' },
    { id: 2, user: 'Admin', action: 'Product Updated', details: 'Updated product: Dental Floss', timestamp: '2026-01-08 10:15 AM', status: 'success' },
    { id: 3, user: 'Staff', action: 'Login Attempt', details: 'Failed login from IP: 192.168.1.1', timestamp: '2026-01-08 09:45 AM', status: 'warning' },
    { id: 4, user: 'Admin', action: 'Settings Changed', details: 'Updated email notification settings', timestamp: '2026-01-08 09:30 AM', status: 'success' },
    { id: 5, user: 'System', action: 'Backup Created', details: 'Database backup completed', timestamp: '2026-01-08 09:00 AM', status: 'success' },
  ];

  const loginHistory = [
    { id: 1, user: 'admin@dental.com', ip: '192.168.1.100', device: 'Chrome on Windows', timestamp: '2026-01-08 10:00 AM', status: 'success' },
    { id: 2, user: 'staff@dental.com', ip: '192.168.1.101', device: 'Safari on MacOS', timestamp: '2026-01-08 09:30 AM', status: 'success' },
    { id: 3, user: 'admin@dental.com', ip: '192.168.1.50', device: 'Firefox on Linux', timestamp: '2026-01-08 08:45 AM', status: 'failed' },
    { id: 4, user: 'user@dental.com', ip: '192.168.1.102', device: 'Chrome on Android', timestamp: '2026-01-08 08:00 AM', status: 'success' },
  ];

  const errorLogs = [
    { id: 1, type: 'Database Error', message: 'Connection timeout to database server', timestamp: '2026-01-08 11:00 AM', severity: 'high' },
    { id: 2, type: 'API Error', message: 'Failed to fetch user data - 500 Internal Server Error', timestamp: '2026-01-08 10:30 AM', severity: 'medium' },
    { id: 3, type: 'Validation Error', message: 'Invalid email format in user registration', timestamp: '2026-01-08 09:15 AM', severity: 'low' },
    { id: 4, type: 'Auth Error', message: 'JWT token expired for user session', timestamp: '2026-01-08 08:45 AM', severity: 'medium' },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      success: { color: '#48bb78', label: 'Success' },
      warning: { color: '#ed8936', label: 'Warning' },
      failed: { color: '#f56565', label: 'Failed' },
    };
    const badge = badges[status] || badges.success;
    return <span className="status-badge" style={{ backgroundColor: badge.color }}>{badge.label}</span>;
  };

  const getSeverityBadge = (severity) => {
    const severities = {
      low: { color: '#48bb78', label: 'Low' },
      medium: { color: '#ed8936', label: 'Medium' },
      high: { color: '#f56565', label: 'High' },
    };
    const sev = severities[severity] || severities.low;
    return <span className="severity-badge" style={{ backgroundColor: sev.color }}>{sev.label}</span>;
  };

  return (
    <div className="logs">
      <h1>Logs & Security</h1>

      <div className="logs-tabs">
        <button 
          className={activeTab === 'activity' ? 'active' : ''} 
          onClick={() => setActiveTab('activity')}
        >
          📋 Activity Logs
        </button>
        <button 
          className={activeTab === 'login' ? 'active' : ''} 
          onClick={() => setActiveTab('login')}
        >
          🔐 Login History
        </button>
        <button 
          className={activeTab === 'errors' ? 'active' : ''} 
          onClick={() => setActiveTab('errors')}
        >
          ⚠️ Error Logs
        </button>
      </div>

      <div className="logs-content">
        {activeTab === 'activity' && (
          <div className="logs-section">
            <div className="logs-header">
              <h2>Activity Logs</h2>
              <button className="btn-export">📥 Export</button>
            </div>
            <div className="logs-table">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Action</th>
                    <th>Details</th>
                    <th>Timestamp</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activityLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.user}</td>
                      <td><strong>{log.action}</strong></td>
                      <td>{log.details}</td>
                      <td>{log.timestamp}</td>
                      <td>{getStatusBadge(log.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'login' && (
          <div className="logs-section">
            <div className="logs-header">
              <h2>Login History</h2>
              <button className="btn-export">📥 Export</button>
            </div>
            <div className="logs-table">
              <table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>IP Address</th>
                    <th>Device</th>
                    <th>Timestamp</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loginHistory.map((log) => (
                    <tr key={log.id}>
                      <td>{log.user}</td>
                      <td>{log.ip}</td>
                      <td>{log.device}</td>
                      <td>{log.timestamp}</td>
                      <td>{getStatusBadge(log.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'errors' && (
          <div className="logs-section">
            <div className="logs-header">
              <h2>Error Logs</h2>
              <button className="btn-export">📥 Export</button>
            </div>
            <div className="logs-table">
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Message</th>
                    <th>Timestamp</th>
                    <th>Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {errorLogs.map((log) => (
                    <tr key={log.id}>
                      <td><strong>{log.type}</strong></td>
                      <td>{log.message}</td>
                      <td>{log.timestamp}</td>
                      <td>{getSeverityBadge(log.severity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;
