import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { Plus, ChevronRight } from 'lucide-react';

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

const OverviewView: React.FC = () => {
  return (
    <>
      {/* Connect Broker Banner */}
      <div className="broker-banner" style={{ marginTop: '20px' }}>
        <div className="banner-icon-placeholder"></div>
        <div className="banner-content">
          <h2>Connect your broker account</h2>
          <p>Deploy, Manage & Track Your Strategies, All From One Broker Account.</p>
          <button className="add-broker-btn">
            <Plus size={16} /> Add Broker
          </button>
        </div>
      </div>

      {/* Market Updates */}
      <div className="section-container">
        <h3 className="section-title">Market Updates</h3>
        <div className="market-cards">
          <div className="market-card">
            <div className="coin-info">
              <div className="coin-icon btc">₿</div>
              <div><span className="coin-symbol">BTC</span><span className="coin-name">Bitcoin</span></div>
            </div>
            <div className="coin-price-info">
              <span className="price">$67305.62</span>
              <span className="change positive">1.09%</span>
            </div>
          </div>
          <div className="market-card">
            <div className="coin-info">
              <div className="coin-icon eth">⟠</div>
              <div><span className="coin-symbol">ETH</span><span className="coin-name">Ethereum</span></div>
            </div>
            <div className="coin-price-info">
              <span className="price">$2045.15</span>
              <span className="change positive">2.22%</span>
            </div>
          </div>
          <div className="market-card">
            <div className="coin-info">
              <div className="coin-icon sol">◎</div>
              <div><span className="coin-symbol">SOL</span><span className="coin-name">Solana</span></div>
            </div>
            <div className="coin-price-info">
              <span className="price">$83.56</span>
              <span className="change positive">1.54%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Strategy Templates */}
      <div className="section-container">
        <div className="section-header-flex">
          <h3 className="section-title">Strategy Templates</h3>
          <button className="view-all-btn">View All <ChevronRight size={16} /></button>
        </div>
        <div className="strategy-cards">
          <div className="strategy-card">
            <div className="strategy-info">
              <h4>Intraday Crypto Algo</h4>
              <p>Margin Required <span className="text-green">$20.00</span> per coin</p>
            </div>
            <div className="strategy-chart">
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={intradayData}>
                  <defs>
                    <linearGradient id="colorIntra" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorIntra)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="strategy-card">
            <div className="strategy-info">
              <h4>Cosmic Turbo Trend</h4>
              <p>Margin Required <span className="text-green">$20.00</span> per coin</p>
            </div>
            <div className="strategy-chart">
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={cosmicData}>
                  <defs>
                    <linearGradient id="colorCosmic" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorCosmic)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OverviewView;
