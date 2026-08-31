import React from 'react';
import { TrendingUp, TrendingDown, Activity, LineChart, Building2, TerminalSquare } from 'lucide-react';
import { StockInfo } from '../types.ts';

interface SidebarProps {
  stocks: StockInfo[];
  selectedTicker: string;
  onSelectStock: (ticker: string) => void;
  currentView: 'analyzer' | 'institutional' | 'monitor';
  onViewChange: (view: 'analyzer' | 'institutional' | 'monitor') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  stocks, 
  selectedTicker, 
  onSelectStock,
  currentView,
  onViewChange
}) => {
  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 h-screen flex flex-col overflow-hidden shrink-0">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Activity className="w-6 h-6 text-blue-400" />
        </div>
        <h1 className="text-xl font-bold text-slate-100 tracking-tight">Nexus<span className="text-blue-400">AI</span></h1>
      </div>
      
      <div className="p-4 border-b border-slate-800 space-y-2">
        <button 
          onClick={() => onViewChange('analyzer')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
            currentView === 'analyzer' 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <LineChart className="w-5 h-5" />
          Stock Analyzer
        </button>
        <button 
          onClick={() => onViewChange('institutional')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
            currentView === 'institutional' 
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-5 h-5" />
          Smart Money Flow
        </button>
        <button 
          onClick={() => onViewChange('monitor')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
            currentView === 'monitor' 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <TerminalSquare className="w-5 h-5" />
          System Monitor
        </button>
      </div>

      <div className="p-4 flex-1 overflow-hidden flex flex-col">
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Watchlist</h2>
        <div className="space-y-1 overflow-y-auto flex-1 pb-4">
          {stocks.map((stock) => {
            const isSelected = stock.ticker === selectedTicker && currentView === 'analyzer';
            const isPositive = stock.change >= 0;
            
            return (
              <button
                key={stock.ticker}
                onClick={() => {
                  onSelectStock(stock.ticker);
                  if (currentView !== 'analyzer') onViewChange('analyzer');
                }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group ${
                  isSelected 
                    ? 'bg-slate-800 shadow-sm border border-slate-700' 
                    : 'hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div>
                  <div className="font-bold text-slate-200 group-hover:text-white transition-colors">{stock.ticker}</div>
                  <div className="text-xs text-slate-500 truncate w-24">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-slate-200">${stock.currentPrice.toFixed(2)}</div>
                  <div className={`text-xs flex items-center justify-end gap-1 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(stock.changePercent)}%
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
