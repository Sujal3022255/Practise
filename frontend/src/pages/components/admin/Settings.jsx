import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import './Settings.css';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [appSettings, setAppSettings] = useState({
    siteName: 'Dental Care Admin',
    maintenanceMode: false,
    allowRegistration: true,
    emailVerification: true,
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    toast.success('Profile updated successfully');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    toast.success('Password changed successfully');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleAppSettingChange = (setting) => {
    setAppSettings({
      ...appSettings,
      [setting]: !appSettings[setting]
    });
    toast.success('App settings updated');
  };

  return (
    <div className="settings">
      <h1>Settings</h1>

      <div className="settings-tabs">
        <button 
          className={activeTab === 'profile' ? 'active' : ''} 
          onClick={() => setActiveTab('profile')}
        >
          👤 Profile
        </button>
        <button 
          className={activeTab === 'password' ? 'active' : ''} 
          onClick={() => setActiveTab('password')}
        >
          🔒 Password
        </button>
        <button 
          className={activeTab === 'app' ? 'active' : ''} 
          onClick={() => setActiveTab('app')}
        >
          ⚙️ App Config
        </button>
      </div>

      <div className="settings-content">
        {activeTab === 'profile' && (
          <div className="settings-section">
            <h2>Profile Settings</h2>
            <form onSubmit={handleProfileUpdate}>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={profileData.firstname}
                    onChange={(e) => setProfileData({ ...profileData, firstname: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={profileData.lastname}
                    onChange={(e) => setProfileData({ ...profileData, lastname: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>
              </div>

              <button type="submit" className="btn-save">
                Save Changes
              </button>
            </form>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="settings-section">
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn-save">
                Update Password
              </button>
            </form>
          </div>
        )}

        {activeTab === 'app' && (
          <div className="settings-section">
            <h2>Application Configuration</h2>
            
            <div className="form-group">
              <label>Site Name</label>
              <input
                type="text"
                value={appSettings.siteName}
                onChange={(e) => setAppSettings({ ...appSettings, siteName: e.target.value })}
              />
            </div>

            <div className="config-toggles">
              <div className="config-item">
                <div className="config-info">
                  <h4>Maintenance Mode</h4>
                  <p>Enable to show maintenance page to users</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={appSettings.maintenanceMode}
                    onChange={() => handleAppSettingChange('maintenanceMode')}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="config-item">
                <div className="config-info">
                  <h4>Allow User Registration</h4>
                  <p>Allow new users to register</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={appSettings.allowRegistration}
                    onChange={() => handleAppSettingChange('allowRegistration')}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="config-item">
                <div className="config-info">
                  <h4>Email Verification Required</h4>
                  <p>Require email verification for new accounts</p>
                </div>
                <label className="toggle-switch">
                  <input 
                    type="checkbox" 
                    checked={appSettings.emailVerification}
                    onChange={() => handleAppSettingChange('emailVerification')}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
