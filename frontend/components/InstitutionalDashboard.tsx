import React, { useEffect, useState } from 'react';
import { Building2, ArrowRightLeft, DollarSign, TrendingUp, BarChart3, ShieldCheck, Pause, Play } from 'lucide-react';
import { InstitutionalTrade, TopAccumulated } from '../types.ts';

interface InstitutionalDashboardProps {
  trades: InstitutionalTrade[];
  topAccumulated: TopAccumulated[];
  isLiveFeedActive: boolean;
  onToggleLiveFeed: () => void;
}

export const InstitutionalDashboard: React.FC<InstitutionalDashboardProps> = ({ 
  trades, 
  topAccumulated,
  isLiveFeedActive,
  onToggleLiveFeed
}) => {
  const [highlightedRow, setHighlightedRow] = useState<string | null>(null);

  // Highlight the newest trade when it arrives from the agent
  useEffect(() => {
    if (trades.length > 0 && isLiveFeedActive) {
      const newestTradeId = trades[0].id;
      if (newestTradeId.includes('live')) {
        setHighlightedRow(newestTradeId);
        const timer = setTimeout(() => setHighlightedRow(null), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [trades, isLiveFeedActive]);
  
  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Smart Money Flow</h1>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium border border-purple-500/30 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Verified Data
            </span>
          </div>
          <p className="text-slate-400 text-lg">Track block trades and accumulation by large institutions.</p>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-850 rounded-2xl p-6 border border-slate-800 flex items-center gap-4">
          <div className="p-4 bg-emerald-500/10 rounded-xl">
            <DollarSign className="w-8 h-8 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Net Institutional Inflow</p>
            <p className="text-2xl font-bold text-white">+$12.4B</p>
            <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +4.2% vs last week
            </p>
          </div>
        </div>
        
        <div className="bg-slate-850 rounded-2xl p-6 border border-slate-800 flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 rounded-xl">
            <Building2 className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Active Institutions</p>
            <p className="text-2xl font-bold text-white">142</p>
            <p className="text-xs text-slate-500 mt-1">Tracking major funds & banks</p>
          </div>
        </div>

        <div className="bg-slate-850 rounded-2xl p-6 border border-slate-800 flex items-center gap-4">
          <div className="p-4 bg-purple-500/10 rounded-xl">
            <BarChart3 className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Top Sector</p>
            <p className="text-2xl font-bold text-white">Technology</p>
            <p className="text-xs text-purple-400 mt-1">68% of total inflow</p>
          </div>
        </div>
      </div>

      {/* Top Accumulated Stocks */}
      <section>
        <h2 className="text-xl font-bold text-slate-200 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" /> Top Accumulated (7 Days)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topAccumulated.map((stock) => (
            <div key={stock.ticker} className="bg-slate-850 rounded-xl p-5 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{stock.ticker}</h3>
                  <p className="text-xs text-slate-400 truncate w-24">{stock.name}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                  stock.sentiment === 'STRONG_BUY' ? 'bg-emerald-500/20 text-emerald-400' :
                  stock.sentiment === 'BUY' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-slate-700 text-slate-300'
                }`}>
                  {stock.sentiment.replace('_', ' ')}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Net Inflow</span>
                  <span className="font-semibold text-emerald-400">{formatCurrency(stock.netValue)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Avg Entry</span>
                  <span className="font-medium text-slate-300">${stock.avgPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Block Trades Table */}
      <section className="bg-slate-850 rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-blue-400" /> Live Block Trades
          </h2>
          
          {/* Guard Rail: Live Feed Toggle */}
          <button
            onClick={onToggleLiveFeed}
            className={`flex items-center gap-2 text-sm px-4 py-2 rounded-full border transition-all duration-300 ${
              isLiveFeedActive
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
            }`}
            title={isLiveFeedActive ? "Pause live updates" : "Resume live updates"}
          >
            {isLiveFeedActive ? (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-current"></span>
                </span>
                Agent Active
                <Pause className="w-4 h-4 ml-1" />
              </>
            ) : (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-current"></span>
                </span>
                Agent Paused
                <Play className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium">Time</th>
                <th className="p-4 font-medium">Ticker</th>
                <th className="p-4 font-medium">Institution</th>
                <th className="p-4 font-medium">Action</th>
                <th className="p-4 font-medium text-right">Shares</th>
                <th className="p-4 font-medium text-right">Price</th>
                <th className="p-4 font-medium text-right">Total Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {trades.map((trade) => {
                const isHighlighted = highlightedRow === trade.id;
                return (
                  <tr 
                    key={trade.id} 
                    className={`transition-all duration-500 ${
                      isHighlighted ? 'bg-blue-500/20' : 'hover:bg-slate-800/30'
                    }`}
                  >
                    <td className="p-4 text-sm text-slate-400">{formatTime(trade.date)}</td>
                    <td className="p-4 font-bold text-white">{trade.ticker}</td>
                    <td className="p-4 text-sm text-slate-300">{trade.institution}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        trade.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {trade.type}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-300 text-right">{trade.shares.toLocaleString()}</td>
                    <td className="p-4 text-sm text-slate-300 text-right">${trade.price.toFixed(2)}</td>
                    <td className="p-4 text-sm font-medium text-white text-right">{formatCurrency(trade.totalValue)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
