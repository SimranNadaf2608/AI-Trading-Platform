import React from 'react';
import { TrendingUp, Users, Award, Shield, Globe, Target, ArrowRight, Play } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>About Us</h1>
          <h2>The Future of Crypto Trading.</h2>
          <p>Trader-friendly and trusted by thousands, our mission is to make trading in crypto as simple as it should be, using AI-powered trading tools, automation, and a single dashboard to trade smarter each day.</p>
          <div className="hero-buttons">
            <button className="btn-primary">
              Get Started
              <ArrowRight size={20} />
            </button>
            <button className="btn-secondary">
              <Play size={20} />
              Watch Demo
            </button>
          </div>
        </div>
        <div className="hero-image">
          <div className="trading-illustration">
            <img 
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
              alt="Cryptocurrency Trading" 
              className="hero-trading-image"
            />
            <div className="crypto-icons">
              <div className="crypto-icon btc">₿</div>
              <div className="crypto-icon eth">Ξ</div>
              <div className="crypto-icon usdt">₮</div>
            </div>
          </div>
        </div>
      </div>

      <div className="about-container">
        <div className="about-content">

          <div className="about-stats">
            <div className="stat-card">
              <div className="stat-number">19K+</div>
              <div className="stat-label">Active Traders</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">$9M+</div>
              <div className="stat-label">Trading Volume</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">4.8/5</div>
              <div className="stat-label">User Rating</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">85%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>          

          {/* Founder Section */}
          <div className="founder-section">
            <div className="founder-content">
              <div className="founder-image">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" 
                  alt="Founder - Alex Chen" 
                  className="founder-photo"
                />
              </div>
              <div className="founder-info">
                <h2>Meet Our Founder</h2>
                <h3>Alex Chen</h3>
                <p className="founder-title">CEO & Founder</p>
                <p className="founder-bio">
                  With over 15 years of experience in quantitative trading and artificial intelligence, Alex Chen founded AITrade with a vision to democratize sophisticated trading tools for everyone. Previously a senior quantitative analyst at Goldman Sachs and lead AI researcher at MIT's Computer Science and Artificial Intelligence Laboratory, Alex brings together deep financial expertise and cutting-edge technology.
                </p>
                <p className="founder-bio">
                  Under his leadership, AITrade has grown from a startup to serving over 19,000 active traders worldwide, managing more than $500 million in trading volume. Alex's commitment to transparency, innovation, and user success continues to drive AITrade's mission to make AI-powered trading accessible to all.
                </p>
                <div className="founder-achievements">
                  <div className="achievement-item">
                    <span className="achievement-icon">🎓</span>
                    <span>MIT PhD in Computer Science</span>
                  </div>
                  <div className="achievement-item">
                    <span className="achievement-icon">💼</span>
                    <span>Ex-Goldman Sachs Quant Analyst</span>
                  </div>
                  <div className="achievement-item">
                    <span className="achievement-icon">🏆</span>
                    <span>Forbes 30 Under 30 in Finance</span>
                  </div>
                  <div className="achievement-item">
                    <span className="achievement-icon">📈</span>
                    <span>15+ Years Trading Experience</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="about-section">
            <div className="section-icon">
              <TrendingUp size={48} />
            </div>
            <h2>Our Mission</h2>
            <p>To democratize trading by making advanced AI-powered trading tools accessible to everyone, from beginners to professional traders. We believe that technology should level the playing field and give every trader the opportunity to succeed.</p>
          </div>

          <div className="about-section">
            <div className="section-icon">
              <Users size={48} />
            </div>
            <h2>Who We Are</h2>
            <p>AITrade is a team of experienced traders, data scientists, and technology experts passionate about revolutionizing the trading industry. With decades of combined experience in financial markets and artificial intelligence, we've built a platform that truly understands traders' needs.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
