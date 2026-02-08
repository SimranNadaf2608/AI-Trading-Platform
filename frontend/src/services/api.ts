import axios from 'axios';

const API_BASE_URL = 'http://localhost:8003/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Stock {
  symbol: string;
  price: number;
  change: number;
  change_percent: number;
  volume: number;
}

export interface PredictionRequest {
  symbol: string;
  days?: number;
}

export interface PredictionResponse {
  symbol: string;
  current_price: number;
  predicted_price: number;
  confidence: number;
  recommendation: string;
  prediction_date: string;
}

export interface TradeRequest {
  symbol: string;
  quantity: number;
  order_type: 'buy' | 'sell';
  price?: number;
}

export interface PortfolioItem {
  symbol: string;
  quantity: number;
  average_price: number;
  current_price: number;
  total_value: number;
  profit_loss: number;
  profit_loss_percent: number;
}

export interface Analytics {
  total_invested: number;
  total_value: number;
  total_profit_loss: number;
  profit_loss_percent: number;
  cash_balance: number;
  total_assets: number;
  num_positions: number;
}

export interface Balance {
  balance: number;
}

// API Functions
export const getStocks = async (): Promise<Stock[]> => {
  const response = await api.get('/stocks');
  return response.data;
};

export const predictStock = async (request: PredictionRequest): Promise<PredictionResponse> => {
  const response = await api.post('/predict', request);
  return response.data;
};

export const executeTrade = async (trade: TradeRequest) => {
  const response = await api.post('/trade', trade);
  return response.data;
};

export const getPortfolio = async (): Promise<PortfolioItem[]> => {
  const response = await api.get('/portfolio');
  return response.data;
};

export const getBalance = async (): Promise<Balance> => {
  const response = await api.get('/balance');
  return response.data;
};

export const getAnalytics = async (): Promise<Analytics> => {
  const response = await api.get('/analytics');
  return response.data;
};
