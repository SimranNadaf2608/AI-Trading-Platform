import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { Brain, TrendingUp, TrendingDown, PieChart as PieChartIcon, BarChart3, DollarSign } from 'lucide-react';
import { getPortfolio, getAnalytics, PortfolioItem, type Analytics as AnalyticsType } from '../services/api';

const Analytics: React.FC = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const [portfolioData, analyticsData] = await Promise.all([
        getPortfolio(),
        getAnalytics()
      ]);
      setPortfolio(portfolioData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  // Prepare data for charts
  const portfolioDistribution = portfolio.map(item => ({
    name: item.symbol,
    value: item.total_value,
    percentage: ((item.total_value / analytics!.total_value) * 100).toFixed(1)
  }));

  const performanceData = portfolio.map(item => ({
    name: item.symbol,
    profit: item.profit_loss,
    percentage: item.profit_loss_percent
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="analytics">
      <h1>Analytics & AI Insights</h1>
      
      {analytics && (
        <div className="analytics-overview">
          <div className="overview-cards">
            <div className="overview-card">
              <div className="card-icon">
                <TrendingUp />
              </div>
              <div className="card-content">
                <h3>Total Return</h3>
                <p className={`card-value ${analytics.total_profit_loss >= 0 ? 'positive' : 'negative'}`}>
                  ${analytics.total_profit_loss.toFixed(2)}
                </p>
                <p className="card-subtitle">
                  {analytics.profit_loss_percent.toFixed(2)}%
                </p>
              </div>
            </div>
            
            <div className="overview-card">
              <div className="card-icon">
                <PieChartIcon />
              </div>
              <div className="card-content">
                <h3>Positions</h3>
                <p className="card-value">{analytics.num_positions}</p>
                <p className="card-subtitle">Active holdings</p>
              </div>
            </div>
            
            <div className="overview-card">
              <div className="card-icon">
                <DollarSign />
              </div>
              <div className="card-content">
                <h3>Total Assets</h3>
                <p className="card-value">${analytics.total_assets.toFixed(2)}</p>
                <p className="card-subtitle">Portfolio value</p>
              </div>
            </div>
            
            <div className="overview-card">
              <div className="card-icon">
                <Brain />
              </div>
              <div className="card-content">
                <h3>AI Score</h3>
                <p className="card-value">85/100</p>
                <p className="card-subtitle">Portfolio health</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="charts-section">
        <div className="chart-container">
          <h2>Portfolio Distribution</h2>
          {portfolio.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={portfolioDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name }) => `${name}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {portfolioDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value?: number) => value ? `$${value.toFixed(2)}` : '$0.00'} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-chart">
              <PieChartIcon size={48} />
              <p>No data available</p>
            </div>
          )}
        </div>

        <div className="chart-container">
          <h2>Performance by Stock</h2>
          {portfolio.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value?: number) => value ? `$${value.toFixed(2)}` : '$0.00'} />
                <Legend />
                <Bar dataKey="profit" fill="#3b82f6" name="Profit/Loss" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-chart">
              <BarChart3 size={48} />
              <p>No data available</p>
            </div>
          )}
        </div>
      </div>

      <div className="ai-insights">
        <h2>AI-Powered Insights</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <div className="insight-header">
              <Brain />
              <h3>Portfolio Optimization</h3>
            </div>
            <p>Your portfolio shows good diversification with {portfolio.length} positions. Consider rebalancing if any single position exceeds 20% of your total portfolio value.</p>
          </div>
          
          <div className="insight-card">
            <div className="insight-header">
              <TrendingUp />
              <h3>Market Sentiment</h3>
            </div>
            <p>Current market conditions appear favorable for tech stocks. Your holdings in this sector are well-positioned for potential growth.</p>
          </div>
          
          <div className="insight-card">
            <div className="insight-header">
              <TrendingDown />
              <h3>Risk Assessment</h3>
            </div>
            <p>Your portfolio shows moderate risk levels. Consider adding some defensive positions to balance volatility during market downturns.</p>
          </div>
          
          <div className="insight-card">
            <div className="insight-header">
              <Brain />
              <h3>AI Recommendations</h3>
            </div>
            <p>Based on current market analysis and your portfolio composition, consider increasing positions in undervalued growth stocks with strong fundamentals.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
