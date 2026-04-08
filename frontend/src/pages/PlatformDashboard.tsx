import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Wallet, 
  Zap, 
  BarChart2, 
  FileText, 
  Moon, 
  Bell, 
  Send, 
  LogOut,
  ChevronRight,
  Plus
} from 'lucide-react';
import OverviewView from '../components/dashboard/OverviewView';
import BrokersView from '../components/dashboard/BrokersView';
import StrategiesView from '../components/dashboard/StrategiesView';
import AnalyticsView from '../components/dashboard/AnalyticsView';
import ReportsView from '../components/dashboard/ReportsView';
import './PlatformDashboard.css';

// Mock Data
const intradayData = [
  { time: '1', value: 200 }, { time: '2', value: 600 },
  { time: '3', value: 500 }, { time: '4', value: 900 },
  { time: '5', value: 1200 }, { time: '6', value: 1100 },
  { time: '7', value: 1400 },
];

const cosmicData = [
  { time: '1', value: 2000 }, { time: '2', value: 3000 },
  { time: '3', value: 2500 }, { time: '4', value: 4000 },
  { time: '5', value: 6000 }, { time: '6', value: 8000 },
  { time: '7', value: 11000 },
];

const screenerCoins = [
  { symbol: 'ONDOUSD', name: 'ONDO Perpetual', price: '$0.27', change: '-0.29%', updated: '15s ago', icon: '©' },
  { symbol: 'ZECUSD', name: 'Zcash Perpetual', price: '$226.99', change: '4.76%', updated: '17s ago', icon: 'Z' },
  { symbol: 'SWARMSUSD', name: 'Swarms Perpetual', price: '$0.01', change: '1.05%', updated: '17s ago', icon: '❖' },
  { symbol: 'UNIUSD', name: 'Uniswap Perpetual', price: '$3.47', change: '2.40%', updated: '...', icon: '🦄' },
];

const PlatformDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [rightTab, setRightTab] = useState('AI Screener');

  return (
    <div className="cryptomaty-layout">
      {/* LEFT SIDEBAR */}
      <aside className="crypto-sidebar">
        <div className="crypto-brand">
          <div className="brand-icon-wrapper">
            <div className="brand-icon-inner"></div>
          </div>
          <span className="brand-text">Cryptomaty</span>
        </div>

        <div className="sidebar-section">
          <p className="sidebar-label">Overview</p>
          <nav className="crypto-nav">
            <button className={`nav-btn ${activeTab === 'Dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('Dashboard')}>
              <LayoutGrid size={18} /> Dashboard
            </button>
            <button className={`nav-btn ${activeTab === 'Brokers' ? 'active' : ''}`} onClick={() => setActiveTab('Brokers')}>
              <Wallet size={18} /> Brokers
            </button>
            <button className={`nav-btn ${activeTab === 'Strategies' ? 'active' : ''}`} onClick={() => setActiveTab('Strategies')}>
              <Zap size={18} /> Strategies
            </button>
            <button className={`nav-btn ${activeTab === 'Analytics' ? 'active' : ''}`} onClick={() => setActiveTab('Analytics')}>
              <BarChart2 size={18} /> Analytics
            </button>
            <button className={`nav-btn ${activeTab === 'Reports' ? 'active' : ''}`} onClick={() => setActiveTab('Reports')}>
              <FileText size={18} /> Reports
            </button>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <div className="user-profile-small">
            <img src="https://i.pravatar.cc/100?img=11" alt="Shridhar" className="user-avatar" />
            <div className="user-info-text">
              <span className="user-name">Shridhar</span>
              <span className="user-id">CM27406</span>
            </div>
          </div>
          <div className="sidebar-actions">
            <button className="icon-btn"><Moon size={18} /></button>
            <button className="icon-btn"><Bell size={18} /></button>
            <button className="icon-btn text-blue"><Send size={18} /></button>
            <button className="icon-btn text-red"><LogOut size={18} /></button>
          </div>
        </div>
      </aside>

      {/* CENTER CONTENT */}
      <main className="crypto-main">
        {/* Header */}
        <header className="main-header">
          <div className="header-user">
            <img src="https://i.pravatar.cc/100?img=11" alt="Profile" className="header-avatar" />
            <div>
              <h1 className="welcome-text">Welcome to Cryptomaty</h1>
              <p className="date-text">Monday, March 30, 2026</p>
            </div>
          </div>
        </header>

        {activeTab === 'Dashboard' && <OverviewView />}
        {activeTab === 'Brokers' && <BrokersView />}
        {activeTab === 'Strategies' && <StrategiesView />}
        {activeTab === 'Analytics' && <AnalyticsView />}
        {activeTab === 'Reports' && <ReportsView />}

      </main>

      {/* RIGHT SIDEBAR - SCRENner */}
      <aside className="crypto-right-sidebar">
        <div className="right-tabs">
          <button 
            className={`tab-btn ${rightTab === 'AI Screener' ? 'active' : ''}`}
            onClick={() => setRightTab('AI Screener')}
          >
            AI Screener
          </button>
          <button 
            className={`tab-btn ${rightTab === 'Deployed Strategies' ? 'active' : ''}`}
            onClick={() => setRightTab('Deployed Strategies')}
          >
            Deployed Strategies
          </button>
        </div>

        <div className="screener-content">
          <h3 className="screener-title">AI Screener</h3>
          
          <div className="gauge-container">
            {/* Gauge SVG approximation */}
            <svg viewBox="0 0 200 120" className="gauge-svg">
              {/* Red arc */}
              <path d="M 20 100 A 80 80 0 0 1 70 30" fill="none" stroke="#EF4444" strokeWidth="12" strokeLinecap="round" />
              {/* Yellow/Orange arc */}
              <path d="M 75 27 A 80 80 0 0 1 130 27" fill="none" stroke="#F59E0B" strokeWidth="12" strokeLinecap="round" />
              {/* Green arc */}
              <path d="M 135 30 A 80 80 0 0 1 180 100" fill="none" stroke="#10B981" strokeWidth="12" strokeLinecap="round" />
              
              {/* Pointer dot */}
              <circle cx="28" cy="80" r="5" fill="#000" />
            </svg>
            <div className="gauge-text">
              <h2 className="gauge-value">Bearish</h2>
              <p className="gauge-label">Market Trend</p>
            </div>
          </div>

          <div className="screener-filters">
            <button className="filter-btn active">Bullish Coin</button>
            <button className="filter-btn">Bearish Coin</button>
            <button className="filter-btn">Neutral Coin</button>
          </div>

          <div className="screener-list">
            {screenerCoins.map(coin => (
              <div className="screener-item" key={coin.symbol}>
                <div className="screener-coin">
                  <div className="s-icon">{coin.icon}</div>
                  <div className="s-info">
                    <span className="s-symbol">{coin.symbol}</span>
                    <span className="s-name">{coin.name}</span>
                  </div>
                </div>
                <div className="screener-price">
                  <span className="s-val">{coin.price}</span>
                  <span className={`s-change ${coin.change.startsWith('-') ? 'negative' : 'positive'}`}>
                    {coin.change}
                  </span>
                  <span className="s-updated">Updated {coin.updated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default PlatformDashboard;
