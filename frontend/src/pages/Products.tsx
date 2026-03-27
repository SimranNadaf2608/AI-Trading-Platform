import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Star, TrendingUp, Package, DollarSign, Eye, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Products.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  inStock: boolean;
  featured?: boolean;
}

interface ForexSection {
  title: string;
  content: React.ReactElement;
}

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredSections, setFilteredSections] = useState<ForexSection[]>([]);
  const [loading, setLoading] = useState(true);

  // Forex education sections data
  const forexSections: ForexSection[] = [
    {
      title: "What is Foreign Exchange?",
      content: (
        <React.Fragment>
          <p>Suppose you have ever travelled overseas and converted your money into another currency or shopped online in a currency other than your local one. In that case, you have participated in forex markets.</p>
          
          <div className="forex-definition">
            <h4>Forex Definition: Foreign Exchange, aka Forex or FX</h4>
            <p>Refers to exchanging one currency for another. The impact of Forex affects many aspects of our daily lives, such as the price of fuel, food, imported goods, travel, and more.</p>
          </div>

          <div className="forex-market-info">
            <h4>The Forex Market</h4>
            <p>A thrilling trading environment operating 24/5 and boasting daily trading volumes of trillions of dollars. It is by far the largest and most liquid of all financial markets.</p>
            
            <div className="market-features">
              <div className="feature-item">
                <h5>Decentralized Market</h5>
                <p>Unlike stock markets, there is no centralized exchange. Forex is conducted over the counter (OTC) via a network of banks worldwide.</p>
              </div>
              <div className="feature-item">
                <h5>24/5 Trading</h5>
                <p>Active 24/5 due to overlapping time zones of four primary financial centres: New York, Tokyo, Sydney, and London.</p>
              </div>
              <div className="feature-item">
                <h5>Massive Volume</h5>
                <p>Daily trading volumes of trillions of dollars make it the most liquid financial market globally.</p>
              </div>
            </div>
          </div>
        </React.Fragment>
      )
    },
    {
      title: "How Does Forex Trading Work?",
      content: (
        <React.Fragment>
          <p>Forex trading involves simultaneous buying of one currency while selling another, i.e., exchanging one currency for another.</p>
          
          <div className="currency-pairs">
            <h4>FX Pair Structure</h4>
            <p>When you trade Forex, prices are quoted based on a pair of currencies, referred to as base and quote currencies—for instance, EURUSD or GBPUSD.</p>
            
            <div className="pair-types">
              <div className="pair-type">
                <h5>Majors</h5>
                <p>Eight major currencies with seven major currency pairs. All major pairs have USD as either base or quote currency.</p>
              </div>
              <div className="pair-type">
                <h5>Minors</h5>
                <p>Combinations of major currencies that do not include USD as base or quote currency (cross pairs).</p>
              </div>
              <div className="pair-type">
                <h5>Exotics</h5>
                <p>Pairs that consist of one major currency and a currency from an emerging nation.</p>
              </div>
            </div>
          </div>
        </React.Fragment>
      )
    },
    {
      title: "Forex Trading Terminology",
      content: (
        <React.Fragment>
          <div className="terminology-grid">
            <div className="term-item">
              <h4>Pip</h4>
              <p>The smallest change in price of a currency pair. If EURUSD changes from 1.0000 to 1.0001, it changed by one pip.</p>
            </div>
            <div className="term-item">
              <h4>Bid/Ask Prices</h4>
              <p>Bid: Price broker will pay for base currency. Ask: Price broker will sell base currency for. Bid is always lower than ask.</p>
            </div>
            <div className="term-item">
              <h4>Spread</h4>
              <p>The difference between bid and ask prices. Represents the cost of a forex trade.</p>
            </div>
            <div className="term-item">
              <h4>Leverage</h4>
              <p>A loan facility allowing traders to trade with much higher capital than they have. For example, $1,000 with 100:1 leverage controls $100,000 position.</p>
            </div>
            <div className="term-item">
              <h4>Margin</h4>
              <p>Amount of capital required to open a leveraged position. $1,000 margin needed for $100,000 leveraged position.</p>
            </div>
            <div className="term-item">
              <h4>Lot</h4>
              <p>Unit of measurement: Standard (100,000 units), Mini (10,000 units), Micro (1,000 units), Nano (100 units).</p>
            </div>
          </div>
        </React.Fragment>
      )
    },
    {
      title: "Market Participants",
      content: (
        <React.Fragment>
          <div className="participants-grid">
            <div className="participant">
              <h4>Major Banks</h4>
              <p>At the top of the forex ladder, participating in the interbank market for large transactions between themselves.</p>
            </div>
            <div className="participant">
              <h4>Multinationals</h4>
              <p>Large companies carrying out transactions to facilitate their global businesses, usually through major banks.</p>
            </div>
            <div className="participant">
              <h4>Central Banks</h4>
              <p>Ensure currency stability and maintain foreign reserves. Federal Reserve, Bank of England, ECB, Bank of Japan are key players.</p>
            </div>
            <div className="participant">
              <h4>Retail Traders</h4>
              <p>Individual traders like yourself who trade for personal benefit through retail forex brokers.</p>
            </div>
          </div>
        </React.Fragment>
      )
    },
    {
      title: "Why Trade Forex?",
      content: (
        <React.Fragment>
          <div className="pros-cons">
            <div className="pros">
              <h4>✅ Pros</h4>
              <ul>
                <li><strong>High Liquidity:</strong> World is largest market - buy and sell with ease</li>
                <li><strong>24-hour Market:</strong> Trade round-the-clock from Asian to New York sessions</li>
                <li><strong>Leverage:</strong> Control larger positions with less capital for more profit potential</li>
                <li><strong>Low Costs:</strong> Only pay spreads - no additional commissions</li>
                <li><strong>Decentralized:</strong> No single entity can control the market</li>
              </ul>
            </div>
            <div className="cons">
              <h4>⚠️ Cons</h4>
              <ul>
                <li><strong>Leverage Risk:</strong> Can amplify losses on trades that go against predictions</li>
                <li><strong>Market Volatility:</strong> Large price movements during high-impact news/events</li>
                <li><strong>Complex Analysis:</strong> Requires understanding of multiple factors</li>
              </ul>
            </div>
          </div>
          
          <div className="forex-cta">
            <h3>Start Your Forex Trading Journey</h3>
            <p>Forex trading can be gratifying and profitable, but risks must always be considered. Join AITrade for the most comprehensive trading experience!</p>
            <div className="cta-buttons">
              <button className="btn-primary btn-large">
                Start Trading Now
              </button>
              <button className="btn-secondary btn-large">
                Try Demo Account
              </button>
            </div>
          </div>
        </React.Fragment>
      )
    }
  ];

  useEffect(() => {
    // Simulate loading forex content
    setTimeout(() => {
      setFilteredSections(forexSections);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = forexSections;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(section =>
        section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        section.content.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(section => {
        switch (selectedCategory) {
          case 'basics':
            return section.title.includes('Foreign Exchange');
          case 'trading':
            return section.title.includes('How Does Forex Trading Work');
          case 'terminology':
            return section.title.includes('Terminology');
          case 'participants':
            return section.title.includes('Market Participants');
          case 'analysis':
            return section.title.includes('Why Trade Forex');
          default:
            return true;
        }
      });
    }

    setFilteredSections(filtered);
  }, [forexSections, searchTerm, selectedCategory]);

  const categories = ['all', 'basics', 'trading', 'terminology', 'participants', 'analysis'];

  if (loading) {
    return (
      <div className="products-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading Forex education content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-container">
        <div className="products-header">
          <h1>🌍 Forex Trading Education</h1>
          <p>Master the world's largest financial market with comprehensive guides and expert insights</p>
        </div>

        {filteredSections.length === 0 && (
          <div className="no-products">
            <Package size={48} />
            <h3>No Forex topics found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Filtered Forex Education Sections */}
        {filteredSections.map((section, index) => (
          <div key={index} className="forex-section">
            <h3>{section.title}</h3>
            {section.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
