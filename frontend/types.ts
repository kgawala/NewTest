export interface StockDataPoint {
  date: string;
  price: number;
}

export interface StockInfo {
  ticker: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  history: StockDataPoint[];
}

export interface AIAnalysis {
  summary: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  keyDrivers: string[];
  support: number;
  resistance: number;
}

export interface InstitutionalTrade {
  id: string;
  ticker: string;
  institution: string;
  type: 'BUY' | 'SELL';
  shares: number;
  price: number;
  totalValue: number;
  date: string;
}

export interface TopAccumulated {
  ticker: string;
  name: string;
  netValue: number;
  sentiment: 'STRONG_BUY' | 'BUY' | 'NEUTRAL';
  avgPrice: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'agent' | 'system';
  message: string;
}
