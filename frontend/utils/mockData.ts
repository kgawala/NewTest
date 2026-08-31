import { StockInfo, StockDataPoint, InstitutionalTrade, TopAccumulated } from '../types.ts';

function generateRandomWalk(basePrice: number, volatility: number, days: number): StockDataPoint[] {
  let currentPrice = basePrice;
  const data: StockDataPoint[] = [];
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Add some trend and randomness
    const trend = (Math.random() - 0.45) * (volatility * 0.1); // Slight upward bias
    const randomShock = (Math.random() - 0.5) * volatility;
    
    currentPrice = Math.max(1, currentPrice + trend + randomShock);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price: Number(currentPrice.toFixed(2))
    });
  }
  return data;
}

export const generateMockStocks = (): StockInfo[] => {
  const configs = [
    { ticker: 'AAPL', name: 'Apple Inc.', base: 175, vol: 3 },
    { ticker: 'MSFT', name: 'Microsoft Corp.', base: 410, vol: 5 },
    { ticker: 'NVDA', name: 'NVIDIA Corp.', base: 850, vol: 15 },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', base: 145, vol: 2.5 },
    { ticker: 'AMZN', name: 'Amazon.com Inc.', base: 180, vol: 3.5 },
    { ticker: 'TSLA', name: 'Tesla Inc.', base: 170, vol: 8 },
  ];

  return configs.map(config => {
    const history = generateRandomWalk(config.base, config.vol, 30);
    const currentPrice = history[history.length - 1].price;
    const previousPrice = history[history.length - 2].price;
    const change = Number((currentPrice - previousPrice).toFixed(2));
    const changePercent = Number(((change / previousPrice) * 100).toFixed(2));

    return {
      ticker: config.ticker,
      name: config.name,
      currentPrice,
      change,
      changePercent,
      history
    };
  });
};

export const generateInstitutionalTrades = (): InstitutionalTrade[] => {
  const institutions = ['BlackRock', 'Vanguard', 'State Street', 'Renaissance Tech', 'Two Sigma', 'Citadel', 'Bridgewater'];
  const tickers = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'TSLA', 'META', 'AMD'];
  
  const trades: InstitutionalTrade[] = [];
  const now = new Date();

  for (let i = 0; i < 15; i++) {
    const type = Math.random() > 0.3 ? 'BUY' : 'SELL'; // Bias towards buying
    const shares = Math.floor(Math.random() * 500000) + 50000;
    const price = Math.floor(Math.random() * 500) + 100;
    const date = new Date(now.getTime() - Math.random() * 86400000 * 2); // Last 48 hours

    trades.push({
      id: `trd-${Math.random().toString(36).substr(2, 9)}`,
      ticker: tickers[Math.floor(Math.random() * tickers.length)],
      institution: institutions[Math.floor(Math.random() * institutions.length)],
      type,
      shares,
      price,
      totalValue: shares * price,
      date: date.toISOString(),
    });
  }

  return trades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Agent function to generate a single live trade
export const generateSingleTrade = (): InstitutionalTrade => {
  const institutions = ['BlackRock', 'Vanguard', 'State Street', 'Renaissance Tech', 'Two Sigma', 'Citadel', 'Bridgewater', 'Jane Street', 'AQR', 'Point72'];
  const tickers = ['AAPL', 'MSFT', 'NVDA', 'GOOGL', 'AMZN', 'TSLA', 'META', 'AMD', 'NFLX', 'INTC'];
  
  const type = Math.random() > 0.35 ? 'BUY' : 'SELL'; // Bias towards buying
  const shares = Math.floor(Math.random() * 300000) + 10000;
  const price = Math.floor(Math.random() * 600) + 50;
  
  return {
    id: `trd-live-${Math.random().toString(36).substr(2, 9)}`,
    ticker: tickers[Math.floor(Math.random() * tickers.length)],
    institution: institutions[Math.floor(Math.random() * institutions.length)],
    type,
    shares,
    price,
    totalValue: shares * price,
    date: new Date().toISOString(),
  };
};

export const generateTopAccumulated = (): TopAccumulated[] => {
  return [
    { ticker: 'NVDA', name: 'NVIDIA Corp.', netValue: 4500000000, sentiment: 'STRONG_BUY', avgPrice: 845.20 },
    { ticker: 'MSFT', name: 'Microsoft Corp.', netValue: 3200000000, sentiment: 'BUY', avgPrice: 408.50 },
    { ticker: 'AMZN', name: 'Amazon.com Inc.', netValue: 2100000000, sentiment: 'BUY', avgPrice: 178.90 },
    { ticker: 'AAPL', name: 'Apple Inc.', netValue: 1500000000, sentiment: 'NEUTRAL', avgPrice: 172.30 },
  ];
};
