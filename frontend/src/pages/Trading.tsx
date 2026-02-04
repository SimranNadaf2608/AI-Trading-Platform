import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, Brain } from 'lucide-react';
import { getStocks, predictStock, executeTrade, Stock, PredictionResponse } from '../services/api';

const Trading: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [selectedStock, setSelectedStock] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStocks();
  }, []);

  const fetchStocks = async () => {
    try {
      const stocksData = await getStocks();
      setStocks(stocksData);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  const handlePredict = async () => {
    if (!selectedStock) return;
    
    setLoading(true);
    try {
      const predictionData = await predictStock({ symbol: selectedStock, days: 7 });
      setPrediction(predictionData);
    } catch (error) {
      console.error('Error getting prediction:', error);
      setMessage('Failed to get AI prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleTrade = async () => {
    if (!selectedStock || quantity <= 0) {
      setMessage('Please select a stock and enter a valid quantity');
      return;
    }

    setLoading(true);
    try {
      await executeTrade({
        symbol: selectedStock,
        quantity,
        order_type: orderType
      });
      setMessage(`${orderType === 'buy' ? 'Buy' : 'Sell'} order executed successfully!`);
      setQuantity(1);
    } catch (error) {
      console.error('Error executing trade:', error);
      setMessage('Trade execution failed');
    } finally {
      setLoading(false);
    }
  };

  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Strong Buy': return 'strong-buy';
      case 'Buy': return 'buy';
      case 'Hold': return 'hold';
      case 'Sell': return 'sell';
      default: return 'hold';
    }
  };

  return (
    <div className="trading">
      <h1>Trading</h1>
      
      <div className="trading-layout">
        <div className="stock-selector">
          <h2>Select Stock</h2>
          <div className="search-bar">
            <Search />
            <input
              type="text"
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="stock-list">
            {filteredStocks.map((stock) => (
              <div
                key={stock.symbol}
                className={`stock-item ${selectedStock === stock.symbol ? 'selected' : ''}`}
                onClick={() => setSelectedStock(stock.symbol)}
              >
                <div className="stock-info">
                  <h3>{stock.symbol}</h3>
                  <p className="price">${stock.price.toFixed(2)}</p>
                </div>
                <div className={`stock-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                  {stock.change >= 0 ? <TrendingUp /> : <TrendingDown />}
                  <span>{stock.change_percent.toFixed(2)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="trading-panel">
          <div className="trade-form">
            <h2>Place Order</h2>
            
            {selectedStock && (
              <div className="selected-stock">
                <h3>Selected: {selectedStock}</h3>
                {stocks.find(s => s.symbol === selectedStock) && (
                  <p>Current Price: ${stocks.find(s => s.symbol === selectedStock)!.price.toFixed(2)}</p>
                )}
              </div>
            )}

            <div className="form-group">
              <label>Order Type</label>
              <div className="order-type-selector">
                <button
                  className={`order-type-btn ${orderType === 'buy' ? 'buy-active' : ''}`}
                  onClick={() => setOrderType('buy')}
                >
                  Buy
                </button>
                <button
                  className={`order-type-btn ${orderType === 'sell' ? 'sell-active' : ''}`}
                  onClick={() => setOrderType('sell')}
                >
                  Sell
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>

            <div className="form-actions">
              <button
                className="btn btn-primary"
                onClick={handleTrade}
                disabled={!selectedStock || loading}
              >
                {loading ? 'Processing...' : `${orderType === 'buy' ? 'Buy' : 'Sell'} ${selectedStock}`}
              </button>
              
              <button
                className="btn btn-secondary"
                onClick={handlePredict}
                disabled={!selectedStock || loading}
              >
                <Brain size={16} />
                AI Prediction
              </button>
            </div>

            {message && (
              <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
          </div>

          {prediction && (
            <div className="prediction-panel">
              <h3>AI Prediction for {prediction.symbol}</h3>
              <div className="prediction-content">
                <div className="prediction-item">
                  <label>Current Price:</label>
                  <span>${prediction.current_price.toFixed(2)}</span>
                </div>
                <div className="prediction-item">
                  <label>Predicted Price (7 days):</label>
                  <span>${prediction.predicted_price.toFixed(2)}</span>
                </div>
                <div className="prediction-item">
                  <label>Confidence:</label>
                  <span>{(prediction.confidence * 100).toFixed(1)}%</span>
                </div>
                <div className="prediction-item">
                  <label>Recommendation:</label>
                  <span className={`recommendation ${getRecommendationColor(prediction.recommendation)}`}>
                    {prediction.recommendation}
                  </span>
                </div>
                <div className="prediction-item">
                  <label>Prediction Date:</label>
                  <span>{prediction.prediction_date}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trading;
