import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Briefcase } from 'lucide-react';
import { getPortfolio, getBalance, PortfolioItem, Balance } from '../services/api';

const Portfolio: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      const [portfolioData, balanceData] = await Promise.all([
        getPortfolio(),
        getBalance()
      ]);
      setPortfolio(portfolioData);
      setBalance(balanceData);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalValue = portfolio.reduce((sum, item) => sum + item.total_value, 0);
  const totalCost = portfolio.reduce((sum, item) => sum + (item.average_price * item.quantity), 0);
  const totalProfitLoss = totalValue - totalCost;
  const totalProfitLossPercent = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0;

  if (loading) {
    return <div className="loading">Loading portfolio...</div>;
  }

  return (
    <div className="portfolio">
      <h1>Portfolio</h1>
      
      <div className="portfolio-summary">
        <div className="summary-cards">
          <div className="summary-card">
            <div className="card-icon">
              <DollarSign />
            </div>
            <div className="card-content">
              <h3>Cash Balance</h3>
              <p className="card-value">${balance?.balance.toFixed(2) || '0.00'}</p>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="card-icon">
              <Briefcase />
            </div>
            <div className="card-content">
              <h3>Total Investment</h3>
              <p className="card-value">${totalCost.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="card-icon">
              <DollarSign />
            </div>
            <div className="card-content">
              <h3>Current Value</h3>
              <p className="card-value">${totalValue.toFixed(2)}</p>
            </div>
          </div>
          
          <div className="summary-card">
            <div className="card-icon">
              {totalProfitLoss >= 0 ? <TrendingUp /> : <TrendingDown />}
            </div>
            <div className="card-content">
              <h3>Total P&L</h3>
              <p className={`card-value ${totalProfitLoss >= 0 ? 'positive' : 'negative'}`}>
                ${totalProfitLoss.toFixed(2)} ({totalProfitLossPercent.toFixed(2)}%)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="holdings-section">
        <h2>Your Holdings</h2>
        {portfolio.length === 0 ? (
          <div className="empty-portfolio">
            <Briefcase size={48} />
            <h3>No holdings yet</h3>
            <p>Start trading to build your portfolio</p>
          </div>
        ) : (
          <div className="holdings-grid">
            {portfolio.map((item) => (
              <div key={item.symbol} className="holding-card">
                <div className="holding-header">
                  <h3>{item.symbol}</h3>
                  <span className={`holding-change ${item.profit_loss >= 0 ? 'positive' : 'negative'}`}>
                    {item.profit_loss >= 0 ? '+' : ''}{item.profit_loss_percent.toFixed(2)}%
                  </span>
                </div>
                
                <div className="holding-details">
                  <div className="detail-row">
                    <span className="label">Quantity:</span>
                    <span className="value">{item.quantity}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Avg Price:</span>
                    <span className="value">${item.average_price.toFixed(2)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Current Price:</span>
                    <span className="value">${item.current_price.toFixed(2)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Total Value:</span>
                    <span className="value">${item.total_value.toFixed(2)}</span>
                  </div>
                  <div className="detail-row profit-loss">
                    <span className="label">P&L:</span>
                    <span className={`value ${item.profit_loss >= 0 ? 'positive' : 'negative'}`}>
                      ${item.profit_loss.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;
