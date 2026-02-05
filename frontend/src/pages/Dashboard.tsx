import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, ArrowRight, Bot, Zap, Shield, Brain, Play, BarChart3, PieChart as PieChartIcon, TrendingUp as TrendingIcon, Star, Quote, BookOpen, FileText, Video, Download, Users, Award, Lightbulb } from 'lucide-react';
import { getStocks, getAnalytics } from '../services/api';

interface Stock {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
}

interface Analytics {
  total_invested: number;
  total_value: number;
  total_profit_loss: number;
  profit_loss_percent: number;
  cash_balance: number;
  total_assets: number;
  num_positions: number;
}

const Dashboard: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stocksData, analyticsData] = await Promise.all([
          getStocks(),
          getAnalytics()
        ]);
        setStocks(stocksData);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>Automate your trading.</h1>
            <h2>Smart and simple.</h2>
            <p>Fully automated trading with your broker account, launched in minutes</p>
            <button className="btn btn-primary btn-large hero-btn">
              Get Started
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="video-container">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline
              className="hero-video"
            >
              <source src="https://videos.unsplash.com/video-1600068495415-0c4a7c0b9b3c?fm=mp4&q=80&w=1800" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="video-overlay"></div>
          </div>
        </div>
      </div>

      {/* AI Trading Section */}
      <div className="ai-trading-section">
        <div className="section-header">
          <h2>What is AI Trading?</h2>
          <h3>Revolutionary technology that's transforming how we trade financial markets</h3>
          <p>Advanced algorithms analyze market patterns to predict stock movements with up to 85% accuracy.</p>
        </div>
        <div className="ai-cards">
          <div className="ai-card">
            <div className="card-icon-wrapper">
              <Brain className="card-icon" />
            </div>
            <h3>Machine Learning</h3>
            <p>Advanced algorithms analyze millions of data points to identify profitable trading patterns that humans might miss.</p>
            <div className="card-features">
              <span className="feature-tag">Pattern Recognition</span>
              <span className="feature-tag">Predictive Analytics</span>
            </div>
          </div>
          
          <div className="ai-card">
            <div className="card-icon-wrapper">
              <Activity className="card-icon" />
            </div>
            <h3>Real-Time Analysis</h3>
            <p>Process market data instantly, executing trades at the perfect moment based on complex mathematical models.</p>
            <div className="card-features">
              <span className="feature-tag">Live Data</span>
              <span className="feature-tag">Instant Execution</span>
            </div>
          </div>
          
          <div className="ai-card">
            <div className="card-icon-wrapper">
              <TrendingUp className="card-icon" />
            </div>
            <h3>Risk Management</h3>
            <p>Intelligent risk assessment protects your capital with automated stop-losses and position sizing.</p>
            <div className="card-features">
              <span className="feature-tag">Risk Control</span>
              <span className="feature-tag">Capital Protection</span>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="why-choose-section">
        <div className="section-header">
          <h2>Why Choose Automated Forex Trading?</h2>
          <h3>Discover the advantages that make automated trading the future of investing</h3>
          <p>Eliminate emotional bias and execute trades with lightning-fast precision using our AI-powered platform.</p>
        </div>
        <div className="why-grid">
          <div className="why-card">
            <div className="why-number">01</div>
            <div className="why-content">
              <h3>24/7 Market Coverage</h3>
              <p>Never miss trading opportunities. Our AI works around the clock, monitoring global markets even while you sleep.</p>
              <div className="why-stats">
                <div className="stat">
                  <span className="stat-value">24/7</span>
                  <span className="stat-label">Market Monitoring</span>
                </div>
                <div className="stat">
                  <span className="stat-value">100+</span>
                  <span className="stat-label">Currency Pairs</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="why-card">
            <div className="why-number">02</div>
            <div className="why-content">
              <h3>Emotion-Free Trading</h3>
              <p>Eliminate fear and greed from your trading decisions. Our algorithms follow strict rules without emotional bias.</p>
              <div className="why-stats">
                <div className="stat">
                  <span className="stat-value">0%</span>
                  <span className="stat-label">Emotional Trading</span>
                </div>
                <div className="stat">
                  <span className="stat-value">100%</span>
                  <span className="stat-label">Rule-Based</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="why-card">
            <div className="why-number">03</div>
            <div className="why-content">
              <h3>Lightning Fast Execution</h3>
              <p>Execute trades in milliseconds, capturing opportunities that manual traders simply cannot reach.</p>
              <div className="why-stats">
                <div className="stat">
                  <span className="stat-value">&lt;100ms</span>
                  <span className="stat-label">Execution Time</span>
                </div>
                <div className="stat">
                  <span className="stat-value">10x</span>
                  <span className="stat-label">Faster Than Manual</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="why-card">
            <div className="why-number">04</div>
            <div className="why-content">
              <h3>Backtested Strategies</h3>
              <p>Every strategy is rigorously tested against historical data to ensure proven performance before deployment.</p>
              <div className="why-stats">
                <div className="stat">
                  <span className="stat-value">10+ Years</span>
                  <span className="stat-label">Historical Data</span>
                </div>
                <div className="stat">
                  <span className="stat-value">95%</span>
                  <span className="stat-label">Success Rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="key-features-section">
        <div className="section-header">
          <h2>Key Features</h2>
          <h3>Powerful tools and capabilities that set our trading platform apart</h3>
          <p>Experience the future of trading with cutting-edge AI technology and comprehensive tools.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Bot className="feature-icon" />
            </div>
            <h3>AI-Powered Predictions</h3>
            <p>Advanced machine learning algorithms analyze market patterns to predict stock movements with up to 85% accuracy.</p>
            <div className="feature-highlight">
              <span className="highlight-value">85%</span>
              <span className="highlight-label">Accuracy Rate</span>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Zap className="feature-icon" />
            </div>
            <h3>Lightning Fast Trading</h3>
            <p>Execute trades in milliseconds with our optimized infrastructure, ensuring you never miss market opportunities.</p>
            <div className="feature-highlight">
              <span className="highlight-value">&lt;100ms</span>
              <span className="highlight-label">Execution Speed</span>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Shield className="feature-icon" />
            </div>
            <h3>Risk Management</h3>
            <p>Intelligent risk assessment algorithms protect your capital with automated stop-losses and position sizing.</p>
            <div className="feature-highlight">
              <span className="highlight-value">24/7</span>
              <span className="highlight-label">Risk Monitoring</span>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <TrendingUp className="feature-icon" />
            </div>
            <h3>Real-Time Analytics</h3>
            <p>Comprehensive dashboard with live market data, portfolio performance metrics, and detailed trading insights.</p>
            <div className="feature-highlight">
              <span className="highlight-value">Live</span>
              <span className="highlight-label">Market Data</span>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Activity className="feature-icon" />
            </div>
            <h3>Smart Portfolio Management</h3>
            <p>Automated rebalancing and optimization based on market conditions and your investment goals.</p>
            <div className="feature-highlight">
              <span className="highlight-value">Auto</span>
              <span className="highlight-label">Rebalancing</span>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <DollarSign className="feature-icon" />
            </div>
            <h3>Multi-Asset Support</h3>
            <p>Trade stocks, forex, cryptocurrencies, and commodities all from one integrated platform.</p>
            <div className="feature-highlight">
              <span className="highlight-value">1000+</span>
              <span className="highlight-label">Available Assets</span>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="how-it-works-section">
        <div className="section-header">
          <h2>How It Works</h2>
          <h3>Get started with automated trading in just a few simple steps</h3>
          <p>From setup to execution, our platform makes automated trading accessible to everyone.</p>
        </div>
        <div className="steps-container">
          <div className="steps-flow">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Connect Your Broker</h3>
                <p>Securely link your existing brokerage account using our encrypted API integration. We support major brokers worldwide.</p>
                <div className="step-features">
                  <span className="step-feature">✓ Bank-Level Security</span>
                  <span className="step-feature">✓ 2FA Authentication</span>
                  <span className="step-feature">✓ Read-Only Access</span>
                </div>
              </div>
            </div>
            
            <div className="step-connector">
              <ArrowRight className="connector-arrow" />
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Set Your Preferences</h3>
                <p>Define your risk tolerance, investment goals, and trading strategies. Our AI will adapt to your unique preferences.</p>
                <div className="step-features">
                  <span className="step-feature">✓ Risk Level Selection</span>
                  <span className="step-feature">✓ Custom Strategies</span>
                  <span className="step-feature">✓ Goal Setting</span>
                </div>
              </div>
            </div>
            
            <div className="step-connector">
              <ArrowRight className="connector-arrow" />
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>AI Analysis & Trading</h3>
                <p>Our AI analyzes market data 24/7, identifies opportunities, and executes trades based on your predefined criteria.</p>
                <div className="step-features">
                  <span className="step-feature">✓ Real-Time Analysis</span>
                  <span className="step-feature">✓ Automatic Execution</span>
                  <span className="step-feature">✓ Performance Tracking</span>
                </div>
              </div>
            </div>
            
            <div className="step-connector">
              <ArrowRight className="connector-arrow" />
            </div>
            
            <div className="step-card">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Monitor & Optimize</h3>
                <p>Track your portfolio performance through our dashboard. Get detailed reports and AI recommendations for optimization.</p>
                <div className="step-features">
                  <span className="step-feature">✓ Live Dashboard</span>
                  <span className="step-feature">✓ Performance Reports</span>
                  <span className="step-feature">✓ AI Recommendations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="cta-section">
          <div className="cta-content">
            <h3>Ready to Start Automated Trading?</h3>
            <p>Join thousands of traders who have already transformed their investment strategy with AI</p>
            <button className="btn btn-primary btn-large cta-btn">
              Get Started Now
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
      
      {analytics && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <DollarSign />
            </div>
            <div className="stat-content">
              <h3>Total Assets</h3>
              <p className="stat-value">${analytics.total_assets.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Activity />
            </div>
            <div className="stat-content">
              <h3>Total Value</h3>
              <p className="stat-value">${analytics.total_value.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              {analytics.total_profit_loss >= 0 ? <TrendingUp /> : <TrendingDown />}
            </div>
            <div className="stat-content">
              <h3>Total P&L</h3>
              <p className={`stat-value ${analytics.total_profit_loss >= 0 ? 'positive' : 'negative'}`}>
                ${analytics.total_profit_loss.toFixed(2)} ({analytics.profit_loss_percent.toFixed(2)}%)
              </p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <DollarSign />
            </div>
            <div className="stat-content">
              <h3>Cash Balance</h3>
              <p className="stat-value">${analytics.cash_balance.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-content">
        <div className="market-overview">
          <h2>Market Overview</h2>
          <div className="stocks-grid">
            {stocks.map((stock) => (
              <div key={stock.symbol} className="stock-card">
                <div className="stock-header">
                  <h3>{stock.symbol}</h3>
                  <span className={`stock-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change_percent.toFixed(2)}%
                  </span>
                </div>
                <div className="stock-price">
                  <p className="price">${stock.price.toFixed(2)}</p>
                  <p className="change">{stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}</p>
                </div>
                <div className="stock-volume">
                  <p>Vol: {stock.volume.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="analytics-charts-section">
        <div className="charts-container">
          <div className="charts-content">
            <h2>View Analytics</h2>
            <p>Real-time trading insights and performance metrics powered by AI</p>
            <div className="charts-grid">
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Portfolio Performance</h3>
                  <div className="chart-badge">
                    <TrendingIcon size={16} />
                    <span>+12.5%</span>
                  </div>
                </div>
                <div className="chart-visualization">
                  <div className="line-chart">
                    <div className="chart-grid">
                      <div className="grid-line horizontal"></div>
                      <div className="grid-line horizontal"></div>
                      <div className="grid-line horizontal"></div>
                      <div className="grid-line horizontal"></div>
                      <div className="grid-line vertical"></div>
                      <div className="grid-line vertical"></div>
                      <div className="grid-line vertical"></div>
                      <div className="grid-line vertical"></div>
                    </div>
                    <div className="chart-line performance-line">
                      <div className="line-point" style={{left: '0%', bottom: '30%'}}></div>
                      <div className="line-point" style={{left: '20%', bottom: '45%'}}></div>
                      <div className="line-point" style={{left: '40%', bottom: '35%'}}></div>
                      <div className="line-point" style={{left: '60%', bottom: '60%'}}></div>
                      <div className="line-point" style={{left: '80%', bottom: '75%'}}></div>
                      <div className="line-point" style={{left: '100%', bottom: '85%'}}></div>
                    </div>
                  </div>
                </div>
                <div className="chart-stats">
                  <div className="chart-stat">
                    <span className="stat-value">$125,430</span>
                    <span className="stat-label">Current Value</span>
                  </div>
                  <div className="chart-stat">
                    <span className="stat-value positive">+$13,945</span>
                    <span className="stat-label">Total Gain</span>
                  </div>
                </div>
              </div>
              
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Asset Allocation</h3>
                  <div className="chart-badge">
                    <PieChartIcon size={16} />
                    <span>6 Assets</span>
                  </div>
                </div>
                <div className="chart-visualization">
                  <div className="pie-chart">
                    <div className="pie-segment segment-1" style={{transform: 'rotate(0deg)'}}>
                      <div className="segment-fill"></div>
                    </div>
                    <div className="pie-segment segment-2" style={{transform: 'rotate(60deg)'}}>
                      <div className="segment-fill"></div>
                    </div>
                    <div className="pie-segment segment-3" style={{transform: 'rotate(120deg)'}}>
                      <div className="segment-fill"></div>
                    </div>
                    <div className="pie-segment segment-4" style={{transform: 'rotate(180deg)'}}>
                      <div className="segment-fill"></div>
                    </div>
                    <div className="pie-segment segment-5" style={{transform: 'rotate(240deg)'}}>
                      <div className="segment-fill"></div>
                    </div>
                    <div className="pie-segment segment-6" style={{transform: 'rotate(300deg)'}}>
                      <div className="segment-fill"></div>
                    </div>
                    <div className="pie-center">
                      <div className="pie-total">$125K</div>
                      <div className="pie-label">Total</div>
                    </div>
                  </div>
                </div>
                <div className="chart-legend">
                  <div className="legend-item">
                    <div className="legend-color color-1"></div>
                    <span>AAPL (35%)</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color color-2"></div>
                    <span>GOOGL (25%)</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color color-3"></div>
                    <span>MSFT (20%)</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color color-4"></div>
                    <span>AMZN (10%)</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color color-5"></div>
                    <span>TSLA (7%)</span>
                  </div>
                  <div className="legend-item">
                    <div className="legend-color color-6"></div>
                    <span>Cash (3%)</span>
                  </div>
                </div>
              </div>
              
              <div className="chart-card">
                <div className="chart-header">
                  <h3>Trading Volume</h3>
                  <div className="chart-badge">
                    <BarChart3 size={16} />
                    <span>Today</span>
                  </div>
                </div>
                <div className="chart-visualization">
                  <div className="bar-chart">
                    <div className="chart-bars">
                      <div className="bar bar-1" style={{height: '70%'}}></div>
                      <div className="bar bar-2" style={{height: '85%'}}></div>
                      <div className="bar bar-3" style={{height: '45%'}}></div>
                      <div className="bar bar-4" style={{height: '90%'}}></div>
                      <div className="bar bar-5" style={{height: '60%'}}></div>
                      <div className="bar bar-6" style={{height: '75%'}}></div>
                      <div className="bar bar-7" style={{height: '95%'}}></div>
                      <div className="bar bar-8" style={{height: '55%'}}></div>
                    </div>
                    <div className="chart-labels">
                      <span>9AM</span>
                      <span>10AM</span>
                      <span>11AM</span>
                      <span>12PM</span>
                      <span>1PM</span>
                      <span>2PM</span>
                      <span>3PM</span>
                      <span>4PM</span>
                    </div>
                  </div>
                </div>
                <div className="chart-stats">
                  <div className="chart-stat">
                    <span className="stat-value">2.4M</span>
                    <span className="stat-label">Total Volume</span>
                  </div>
                  <div className="chart-stat">
                    <span className="stat-value">312</span>
                    <span className="stat-label">Trades</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="testimonials-section">
        <div className="testimonials-container">
          <div className="testimonials-header">
            <h2>Testimonials</h2>
            <h3>Trusted by 19,000+ Active Traders Worldwide</h3>
            <p>Thousands of traders in India, who are amateurs and professional users, have confided in AITrade to make trading easy and get more profits.</p>
          </div>
          <div className="trust-stats">
            <div className="trust-stat">
              <span className="stat-number">19,000+</span>
              <span className="stat-label">Active Traders</span>
            </div>
            <div className="trust-stat">
              <span className="stat-number">$500M+</span>
              <span className="stat-label">Trading Volume</span>
            </div>
            <div className="trust-stat">
              <span className="stat-number">4.8/5</span>
              <span className="stat-label">User Rating</span>
            </div>
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="user-avatar">
                  <div className="avatar-placeholder">R</div>
                </div>
                <div className="user-info">
                  <h4>Rahul Sharma</h4>
                  <p>Professional Trader, Mumbai</p>
                </div>
                <div className="rating">
                  <Star className="star filled" />
                  <Star className="star filled" />
                  <Star className="star filled" />
                  <Star className="star filled" />
                  <Star className="star filled" />
                </div>
              </div>
              <div className="testimonial-content">
                <Quote className="quote-icon" />
                <p>AITrade has completely transformed my trading strategy. The AI predictions are incredibly accurate, and I've seen a 45% increase in my portfolio value in just 3 months. The automated trading features save me hours every day.</p>
              </div>
              <div className="testimonial-footer">
                <div className="result-badge">
                  <TrendingUp size={16} />
                  <span>+45% Portfolio Growth</span>
                </div>
                <div className="duration">3 months ago</div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="user-avatar">
                  <div className="avatar-placeholder">P</div>
                </div>
                <div className="user-info">
                  <h4>Priya Patel</h4>
                  <p>Amateur Trader, Bangalore</p>
                </div>
                <div className="rating">
                  <Star className="star filled" />
                  <Star className="star filled" />
                  <Star className="star filled" />
                  <Star className="star filled" />
                  <Star className="star filled" />
                </div>
              </div>
              <div className="testimonial-content">
                <Quote className="quote-icon" />
                <p>As someone new to trading, I was overwhelmed by the complexity. AITrade made it incredibly simple with its AI-powered insights. The platform guided me through every step and helped me build confidence in my trading decisions.</p>
              </div>
              <div className="testimonial-footer">
                <div className="result-badge">
                  <Brain size={16} />
                  <span>AI-Powered Success</span>
                </div>
                <div className="duration">2 months ago</div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="user-avatar">
                  <div className="avatar-placeholder">A</div>
                </div>
                <div className="user-info">
                  <h4>Amit Kumar</h4>
                  <p>Day Trader, Delhi</p>
                </div>
                <div className="rating">
                  <Star className="star filled" />
                  <Star className="star filled" />
                  <Star className="star filled" />
                  <Star className="star filled" />
                  <Star className="star half-filled" />
                </div>
              </div>
              <div className="testimonial-content">
                <Quote className="quote-icon" />
                <p>The real-time analytics and lightning-fast execution have given me a competitive edge. I can now execute trades 10x faster than before, and the risk management features have protected my capital during market volatility.</p>
              </div>
              <div className="testimonial-footer">
                <div className="result-badge">
                  <Zap size={16} />
                  <span>10x Faster Execution</span>
                </div>
                <div className="duration">1 month ago</div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="user-avatar">
                  <div className="avatar-placeholder">S</div>
                </div>
                <div className="user-info">
                  <h4>Sneha Reddy</h4>
                  <p>Swing Trader, Hyderabad</p>
                </div>
                <div className="rating">
                  <Star className="star filled" />
                  <Star className="star filled" />
                  <Star className="star filled" />
                  <Star className="star filled" />
                  <Star className="star filled" />
                </div>
              </div>
              <div className="testimonial-content">
                <Quote className="quote-icon" />
                <p>The portfolio management tools are exceptional. I love how the platform automatically rebalances my positions based on market conditions. It's like having a professional portfolio manager working for me 24/7.</p>
              </div>
              <div className="testimonial-footer">
                <div className="result-badge">
                  <Shield size={16} />
                  <span>Auto-Rebalancing Success</span>
                </div>
                <div className="duration">6 months ago</div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="user-avatar">
                  <div className="avatar-placeholder">V</div>
                </div>
                <div className="user-info">
                  <h4>Vikram Singh</h4>
                  <p>Algorithmic Trader, Pune</p>
                </div>
                <div className="rating">
                  <Star className="star filled" />
                  <Star className="star filled" />
                  <Star className="star filled" />
                  <Star className="star filled" />
                  <Star className="star filled" />
                </div>
              </div>
              <div className="testimonial-content">
                <Quote className="quote-icon" />
                <p>I've tried many trading platforms, but AITrade stands out with its advanced AI capabilities. The backtesting features and strategy optimization tools have helped me refine my algorithms and achieve consistent returns.</p>
              </div>
              <div className="testimonial-footer">
                <div className="result-badge">
                  <BarChart3 size={16} />
                  <span>Algorithm Optimization</span>
                </div>
                <div className="duration">4 months ago</div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="user-avatar">
                  <div className="avatar-placeholder">N</div>
                </div>
                <div className="user-info">
                  <h4>Neha Gupta</h4>
                  <p>Part-time Trader, Chennai</p>
                </div>
                <div className="rating">
                  <Star className="star filled" />
                  <Star className="star filled" />
                  <Star className="star filled" />
                  <Star className="star filled" />
                  <Star className="star half-filled" />
                </div>
              </div>
              <div className="testimonial-content">
                <Quote className="quote-icon" />
                <p>The educational resources and AI insights have helped me understand market trends better. I've gone from making losses to consistent profits. The customer support is also excellent - always there when I need help.</p>
              </div>
              <div className="testimonial-footer">
                <div className="result-badge">
                  <TrendingUp size={16} />
                  <span>Consistent Profits</span>
                </div>
                <div className="duration">5 months ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Section */}
      <div className="resources-section">
        <div className="resources-container">
          <div className="resources-header">
            <h2>Resources</h2>
            <h3>Resources & Insights</h3>
            <p>Find the right guides, trading solutions, and beyond all that you need in order to maximize the outcome and trade wiser with AITrade.</p>
          </div>
          
          <div className="resources-grid-new">
            <div className="resource-tile">
              <div className="resource-image">
                <img src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" alt="Trading Guides" />
                <div className="resource-overlay">
                  <BookOpen className="overlay-icon" />
                </div>
              </div>
              <div className="resource-content">
                <h4>Trading Guides</h4>
                <p>Complete beginner's guide, advanced technical analysis, and risk management essentials</p>
                <div className="resource-stats">
                  <span>12 Guides</span>
                  <span>15-25 min</span>
                </div>
              </div>
            </div>
            
            <div className="resource-tile">
              <div className="resource-image">
                <img src="https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" alt="Video Tutorials" />
                <div className="resource-overlay">
                  <Video className="overlay-icon" />
                </div>
              </div>
              <div className="resource-content">
                <h4>Video Tutorials</h4>
                <p>Platform walkthrough, AI trading strategies, and live trading sessions</p>
                <div className="resource-stats">
                  <span>8 Videos</span>
                  <span>12-45 min</span>
                </div>
              </div>
            </div>
            
            <div className="resource-tile">
              <div className="resource-image">
                <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" alt="Trading Solutions" />
                <div className="resource-overlay">
                  <FileText className="overlay-icon" />
                </div>
              </div>
              <div className="resource-content">
                <h4>Trading Solutions</h4>
                <p>API documentation, mobile app setup, and broker integration guides</p>
                <div className="resource-stats">
                  <span>6 Solutions</span>
                  <span>10-15 min</span>
                </div>
              </div>
            </div>
            
            <div className="resource-tile">
              <div className="resource-image">
                <img src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" alt="Community" />
                <div className="resource-overlay">
                  <Users className="overlay-icon" />
                </div>
              </div>
              <div className="resource-content">
                <h4>Community</h4>
                <p>Trading forum, weekly webinars, and success stories from 19,000+ traders</p>
                <div className="resource-stats">
                  <span>19K+ Members</span>
                  <span>Always Active</span>
                </div>
              </div>
            </div>
            
            <div className="resource-tile">
              <div className="resource-image">
                <img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" alt="Certification" />
                <div className="resource-overlay">
                  <Award className="overlay-icon" />
                </div>
              </div>
              <div className="resource-content">
                <h4>Certification</h4>
                <p>AITrade Certified Trader, AI Trading Specialist, and Risk Management Professional</p>
                <div className="resource-stats">
                  <span>3 Programs</span>
                  <span>Premium</span>
                </div>
              </div>
            </div>
            
            <div className="resource-tile">
              <div className="resource-image">
                <img src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" alt="Market Insights" />
                <div className="resource-overlay">
                  <Lightbulb className="overlay-icon" />
                </div>
              </div>
              <div className="resource-content">
                <h4>Market Insights</h4>
                <p>Daily market analysis, AI predictions, and expert trading recommendations</p>
                <div className="resource-stats">
                  <span>Daily Updates</span>
                  <span>Real-time</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="resources-cta">
            <div className="cta-content">
              <h3>Ready to Level Up Your Trading?</h3>
              <p>Access our complete library of resources and start trading smarter today</p>
              <button className="btn btn-primary btn-large">
                <Download size={20} />
                Download Resource Pack
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
