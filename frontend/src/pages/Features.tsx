import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Zap, Shield, Brain, BarChart3, PieChart, TrendingUp, Lock, Globe, Clock, Award, Users, Target, ArrowRight, CheckCircle } from 'lucide-react';

const Features: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="features-page">
      <div className="features-container">
        <div className="features-header">
          <h1>Platform Features</h1>
          <p>Discover the powerful tools and capabilities that make AITrade the leading AI-powered trading platform</p>
        </div>

        {/* Hero Feature Section */}
        <div className="hero-feature">
          <div className="hero-feature-content">
            <div className="hero-feature-text">
              <h2>AI-Powered Intelligence</h2>
              <p>Our advanced machine learning algorithms analyze millions of data points in real-time, providing you with predictive insights that give you an edge in the market.</p>
              <div className="hero-stats">
                <div className="hero-stat">
                  <span className="stat-number">85%</span>
                  <span className="stat-label">Accuracy Rate</span>
                </div>
                <div className="hero-stat">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Market Analysis</span>
                </div>
                <div className="hero-stat">
                  <span className="stat-number">1M+</span>
                  <span className="stat-label">Data Points</span>
                </div>
              </div>
            </div>
            <div className="hero-feature-main-image">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                alt="AI Trading Dashboard" 
                className="hero-ai-image"
              />
            </div>
          </div>
        </div>

        {/* Timeline Features */}
        <div className="timeline-section">
          <h2>Complete Trading Ecosystem</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-marker">
                <Zap size={24} />
              </div>
              <div className="timeline-content">
                <h3>Lightning Fast Execution</h3>
                <p>Execute trades in milliseconds with our high-performance trading engine. Never miss opportunities due to slow execution times.</p>
                <div className="timeline-badge">
                  <span>&lt;1ms</span> Execution Time
                </div>
              </div>
              <div className="timeline-image">
                <img 
                  src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" 
                  alt="Fast Trading Execution" 
                  className="timeline-img"
                />
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-marker">
                <Shield size={24} />
              </div>
              <div className="timeline-content">
                <h3>Bank-Level Security</h3>
                <p>Your funds and data are protected with military-grade encryption, multi-factor authentication, and cold storage solutions.</p>
                <div className="timeline-badge">
                  <span>256-bit</span> Encryption
                </div>
              </div>
              <div className="timeline-image">
                <img 
                  src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" 
                  alt="Bank Security" 
                  className="timeline-img"
                />
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-marker">
                <BarChart3 size={24} />
              </div>
              <div className="timeline-content">
                <h3>Advanced Analytics Dashboard</h3>
                <p>Comprehensive market analysis with real-time charts, technical indicators, and customizable dashboards tailored to your trading style.</p>
                <div className="timeline-badge">
                  <span>100+</span> Technical Indicators
                </div>
              </div>
              <div className="timeline-image">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" 
                  alt="Analytics Dashboard" 
                  className="timeline-img"
                />
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-marker">
                <Lock size={24} />
              </div>
              <div className="timeline-content">
                <h3>Multi-Exchange Integration</h3>
                <p>Seamlessly connect multiple crypto wallets and exchanges with secure API integration and instant synchronization.</p>
                <div className="timeline-badge">
                  <span>20+</span> Supported Exchanges
                </div>
              </div>
              <div className="timeline-image">
                <img 
                  src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80" 
                  alt="Multi-Exchange Integration" 
                  className="timeline-img"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="feature-grid-section">
          <h2>Powerful Capabilities</h2>
          <div className="feature-grid">
            <div className="feature-item">
              <div className="feature-icon">
                <Bot size={32} />
              </div>
              <h4>Automated Trading</h4>
              <p>Set up custom trading strategies and let our AI execute them automatically based on your parameters.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <PieChart size={32} />
              </div>
              <h4>Portfolio Optimization</h4>
              <p>AI-driven portfolio rebalancing ensures optimal asset allocation based on your risk tolerance.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <Globe size={32} />
              </div>
              <h4>Global Markets</h4>
              <p>Trade stocks, crypto, forex, and commodities from markets around the world 24/7.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <Clock size={32} />
              </div>
              <h4>24/7 Monitoring</h4>
              <p>Our AI never sleeps. Monitor markets and execute trades around the clock, even while you rest.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <Target size={32} />
              </div>
              <h4>Risk Management</h4>
              <p>Intelligent risk assessment automatically adjusts positions based on market volatility.</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <TrendingUp size={32} />
              </div>
              <h4>Real-time Insights</h4>
              <p>Get instant market insights and alerts based on AI analysis of market conditions.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="features-cta">
          <div className="cta-content">
            <h2>Ready to Transform Your Trading?</h2>
            <p>Join thousands of traders who are already using AI to gain an edge in the market.</p>
            <div className="cta-buttons">
              <button className="cta-primary" onClick={() => navigate('/signup')}>
                Get Started Now
                <ArrowRight size={20} />
              </button>
              <button className="cta-secondary">
                View Demo
              </button>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="trust-indicators">
          <div className="trust-item">
            <Award className="trust-icon" />
            <div className="trust-text">
              <h4>Award Winning</h4>
              <p>Best AI Trading Platform 2023</p>
            </div>
          </div>
          <div className="trust-item">
            <Users className="trust-icon" />
            <div className="trust-text">
              <h4>19,000+ Users</h4>
              <p>Trusted by traders worldwide</p>
            </div>
          </div>
          <div className="trust-item">
            <CheckCircle className="trust-icon" />
            <div className="trust-text">
              <h4>Proven Results</h4>
              <p>25% average annual returns</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
