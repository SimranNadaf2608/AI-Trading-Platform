import React, { useState } from 'react';
import { User, Bell, Shield, Palette, HelpCircle, LogOut, Brain, TrendingUp } from 'lucide-react';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoTrade, setAutoTrade] = useState(false);
  const [riskLevel, setRiskLevel] = useState('medium');

  const handleSave = () => {
    // Save settings logic here
    alert('Settings saved successfully!');
  };

  return (
    <div className="settings">
      <h1>Settings</h1>
      
      <div className="settings-grid">
        <div className="settings-section">
          <h2>Account Settings</h2>
          <div className="setting-item">
            <div className="setting-header">
              <User />
              <div>
                <h3>Profile Information</h3>
                <p>Update your account details</p>
              </div>
            </div>
            <button className="btn btn-secondary">Edit Profile</button>
          </div>
          
          <div className="setting-item">
            <div className="setting-header">
              <Shield />
              <div>
                <h3>Security</h3>
                <p>Manage password and authentication</p>
              </div>
            </div>
            <button className="btn btn-secondary">Security Settings</button>
          </div>
        </div>

        <div className="settings-section">
          <h2>Trading Preferences</h2>
          <div className="setting-item">
            <div className="setting-header">
              <Bell />
              <div>
                <h3>Notifications</h3>
                <p>Receive alerts for price changes and trades</p>
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
          
          <div className="setting-item">
            <div className="setting-header">
              <Brain />
              <div>
                <h3>Auto-Trading</h3>
                <p>Enable AI-powered automatic trading</p>
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={autoTrade}
                onChange={(e) => setAutoTrade(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
          
          <div className="setting-item">
            <div className="setting-header">
              <TrendingUp />
              <div>
                <h3>Risk Level</h3>
                <p>Set your preferred risk tolerance</p>
              </div>
            </div>
            <select
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value)}
              className="risk-select"
            >
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>
          </div>
        </div>

        <div className="settings-section">
          <h2>Appearance</h2>
          <div className="setting-item">
            <div className="setting-header">
              <Palette />
              <div>
                <h3>Dark Mode</h3>
                <p>Toggle dark theme</p>
              </div>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h2>Support</h2>
          <div className="setting-item">
            <div className="setting-header">
              <HelpCircle />
              <div>
                <h3>Help Center</h3>
                <p>Get help and support</p>
              </div>
            </div>
            <button className="btn btn-secondary">Visit Help</button>
          </div>
          
          <div className="setting-item">
            <div className="setting-header">
              <LogOut />
              <div>
                <h3>Sign Out</h3>
                <p>Sign out of your account</p>
              </div>
            </div>
            <button className="btn btn-danger">Sign Out</button>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn btn-primary" onClick={handleSave}>
          Save Settings
        </button>
        <button className="btn btn-secondary">
          Reset to Default
        </button>
      </div>
    </div>
  );
};

export default Settings;
