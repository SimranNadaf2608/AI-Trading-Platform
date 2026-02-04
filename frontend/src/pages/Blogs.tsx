import React from 'react';
import { Calendar, Clock, ExternalLink, TrendingUp, ArrowRight, User, Eye, MessageCircle, Share2, Filter, Search } from 'lucide-react';

const Blogs: React.FC = () => {
  const featuredPosts = [
    {
      id: 1,
      title: "AI Revolution in Trading: How Machine Learning is Transforming Financial Markets",
      excerpt: "Artificial intelligence is reshaping the trading landscape with predictive analytics, automated strategies, and real-time market analysis.",
      author: "Sarah Chen",
      date: "2024-01-15",
      readTime: "8 min read",
      category: "AI & Trading",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      views: "12.5K",
      comments: 45,
      link: "https://www.bloomberg.com/news/articles/2024-01-15/ai-revolution-in-trading"
    },
    {
      id: 2,
      title: "Cryptocurrency Market Analysis: Bitcoin Reaches New Heights",
      excerpt: "Bitcoin surges past $50,000 as institutional adoption continues to grow. Expert analysis of market trends and future predictions.",
      author: "Michael Rodriguez",
      date: "2024-01-14",
      readTime: "6 min read",
      category: "Crypto News",
      image: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      views: "18.2K",
      comments: 89,
      link: "https://www.coindesk.com/markets/2024/01/14/bitcoin-price-analysis"
    },
    {
      id: 3,
      title: "Federal Reserve Interest Rate Decision: Market Impact Analysis",
      excerpt: "Latest Fed decision sends ripples through global markets. Comprehensive analysis of impacts on stocks, bonds, and currencies.",
      author: "Emma Thompson",
      date: "2024-01-13",
      readTime: "10 min read",
      category: "Market Analysis",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      views: "9.8K",
      comments: 67,
      link: "https://www.reuters.com/markets/us/federal-reserve-interest-rate-decision-market-impact-2024-01-13"
    }
  ];

  const latestPosts = [
    {
      id: 4,
      title: "Tech Stocks Rally: NASDAQ Hits Record High",
      excerpt: "Technology sector leads market rally with major gains in AI and semiconductor stocks.",
      author: "David Kim",
      date: "2024-01-12",
      readTime: "5 min read",
      category: "Stocks",
      image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      link: "https://www.cnbc.com/2024/01/12/nasdaq-hits-record-high-tech-stocks-rally"
    },
    {
      id: 5,
      title: "Oil Prices Surge Amid Supply Chain Concerns",
      excerpt: "Crude oil prices jump 5% as global supply chain disruptions continue to affect energy markets.",
      author: "Lisa Wang",
      date: "2024-01-11",
      readTime: "4 min read",
      category: "Commodities",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      link: "https://www.wsj.com/articles/oil-prices-surprise-surge-supply-chain-2024-01-11"
    },
    {
      id: 6,
      title: "European Markets Update: ECB Policy Meeting Results",
      excerpt: "European Central Bank maintains current rates, markets react positively to policy clarity.",
      author: "Pierre Dubois",
      date: "2024-01-10",
      readTime: "7 min read",
      category: "Global Markets",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
      link: "https://www.ft.com/content/ecb-policy-meeting-results-2024-01-10"
    }
  ];

  const categories = ["All", "AI & Trading", "Crypto News", "Market Analysis", "Stocks", "Commodities", "Global Markets"];

  return (
    <div className="blogs-page">
      <div className="blogs-container">
        {/* Hero Section */}
        <div className="blogs-hero">
          <div className="hero-content">
            <h1>Financial Insights & Market Analysis</h1>
            <p>Stay informed with the latest financial news, market trends, and expert analysis from leading sources worldwide.</p>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Expert Articles</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Market Updates</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1M+</span>
                <span className="stat-label">Monthly Readers</span>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <img 
              src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80" 
              alt="Financial Market Analysis" 
              className="hero-img"
            />
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="search-filter-bar">
          <div className="search-container">
            <Search className="search-icon" />
            <input type="text" placeholder="Search articles, topics, or authors..." className="search-input" />
          </div>
          <div className="filter-container">
            <Filter className="filter-icon" />
            <select className="filter-select">
              {categories.map(category => (
                <option key={category} value={category.toLowerCase().replace(' ', '-')}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Featured Posts */}
        <div className="featured-section">
          <h2>Featured Stories</h2>
          <div className="featured-grid">
            {featuredPosts.map(post => (
              <article key={post.id} className="featured-post">
                <div className="post-image">
                  <img src={post.image} alt={post.title} className="post-img" />
                  <div className="post-category">{post.category}</div>
                </div>
                <div className="post-content">
                  <div className="post-meta">
                    <div className="author-info">
                      <User className="author-icon" />
                      <span>{post.author}</span>
                    </div>
                    <div className="post-date">
                      <Calendar className="date-icon" />
                      <span>{post.date}</span>
                    </div>
                    <div className="read-time">
                      <Clock className="time-icon" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <a href={post.link} target="_blank" rel="noopener noreferrer" className="read-more">
                    Read Full Article <ExternalLink size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Latest Posts */}
        <div className="latest-section">
          <h2>Latest Market Updates</h2>
          <div className="latest-grid">
            {latestPosts.map(post => (
              <article key={post.id} className="latest-post">
                <div className="latest-image">
                  <img src={post.image} alt={post.title} className="latest-img" />
                </div>
                <div className="latest-content">
                  <div className="latest-category">{post.category}</div>
                  <h4>{post.title}</h4>
                  <p>{post.excerpt}</p>
                  <div className="latest-meta">
                    <span className="latest-author">{post.author}</span>
                    <span className="latest-date">{post.date}</span>
                    <span className="latest-time">{post.readTime}</span>
                  </div>
                  <a href={post.link} target="_blank" rel="noopener noreferrer" className="latest-link">
                    Read More <ArrowRight size={14} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <h2>Stay Ahead of the Market</h2>
            <p>Get daily market insights and analysis delivered directly to your inbox.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email address" className="newsletter-input" />
              <button className="newsletter-btn">
                Subscribe <TrendingUp size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
