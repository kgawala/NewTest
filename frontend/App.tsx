import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Sidebar } from './components/Sidebar.tsx';
import { StockChart } from './components/StockChart.tsx';
import { AnalysisPanel } from './components/AnalysisPanel.tsx';
import { InstitutionalDashboard } from './components/InstitutionalDashboard.tsx';
import { SystemMonitor } from './components/SystemMonitor.tsx';
import { generateMockStocks, generateInstitutionalTrades, generateTopAccumulated, generateSingleTrade } from './utils/mockData.ts';
import { getStockAnalysis } from './services/geminiService.ts';
import { StockInfo, AIAnalysis, InstitutionalTrade, TopAccumulated } from './types.ts';
import { ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'analyzer' | 'institutional' | 'monitor'>('analyzer');
  
  // Stock Analyzer State
  const [stocks, setStocks] = useState<StockInfo[]>([]);
  const [selectedTicker, setSelectedTicker] = useState<string>('');
  const [analyses, setAnalyses] = useState<Record<string, AIAnalysis>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Institutional Dashboard State
  const [instTrades, setInstTrades] = useState<InstitutionalTrade[]>([]);
  const [topAccumulated, setTopAccumulated] = useState<TopAccumulated[]>([]);
  const [isLiveFeedActive, setIsLiveFeedActive] = useState(true);

  // Initialize mock data
  useEffect(() => {
    const initialStocks = generateMockStocks();
    setStocks(initialStocks);
    if (initialStocks.length > 0) {
      setSelectedTicker(initialStocks[0].ticker);
    }
    
    setInstTrades(generateInstitutionalTrades());
    setTopAccumulated(generateTopAccumulated());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Real-time Data Agent with Guard Rail (Pause/Resume)
  useEffect(() => {
    if (!isLiveFeedActive) return;

    // Simulates an agent pushing live institutional block trades to the dashboard
    const agentInterval = setInterval(() => {
      setInstTrades(prevTrades => {
        const newTrade = generateSingleTrade();
        // Prepend the new trade and keep the list at a maximum of 50 items to prevent memory bloat
        return [newTrade, ...prevTrades].slice(0, 50);
      });
    }, 3500); // Inject a new trade every 3.5 seconds

    return () => clearInterval(agentInterval);
  }, [isLiveFeedActive]);

  const selectedStock = useMemo(() => 
    stocks.find(s => s.ticker === selectedTicker), 
  [stocks, selectedTicker]);

  const handleGenerateAnalysis = useCallback(async () => {
    // Guard Rail: Prevent multiple simultaneous calls or calls without a selected stock
    if (!selectedStock || isAnalyzing) return;
    
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
      // Create a brief summary of recent history to feed the prompt
      const recentPrices = selectedStock.history.slice(-5).map(h => h.price).join(', ');
      const historySummary = `Last 5 days prices: [${recentPrices}]. Overall 30-day trend is ${selectedStock.change >= 0 ? 'up' : 'down'} by ${Math.abs(selectedStock.changePercent)}%.`;
      
      const result = await getStockAnalysis(selectedStock.ticker, selectedStock.currentPrice, historySummary);
      
      setAnalyses(prev => ({
        ...prev,
        [selectedStock.ticker]: result
      }));
    } catch (err: any) {
      setAnalysisError(err.message || "An unexpected error occurred.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedStock, isAnalyzing]);

  // Reset analysis error when switching stocks
  useEffect(() => {
    setAnalysisError(null);
  }, [selectedTicker]);

  const handleRefreshData = () => {
    setStocks(generateMockStocks());
    setInstTrades(generateInstitutionalTrades());
    setTopAccumulated(generateTopAccumulated());
  };

  if (!selectedStock) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Loading market data...</div>;
  }

  const isPositive = selectedStock.change >= 0;
  const currentAnalysis = analyses[selectedTicker];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      <Sidebar 
        stocks={stocks} 
        selectedTicker={selectedTicker} 
        onSelectStock={setSelectedTicker}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <main className="flex-1 overflow-y-auto relative flex flex-col">
        {/* Header Background Gradient */}
        <div className={`absolute top-0 left-0 right-0 h-64 bg-gradient-to-b pointer-events-none ${
          currentView === 'analyzer' ? 'from-blue-900/20' : 
          currentView === 'institutional' ? 'from-purple-900/20' : 
          'from-emerald-900/20'
        } to-transparent transition-colors duration-500`} />
        
        <div className="max-w-6xl mx-auto p-8 relative z-10 flex-1 w-full flex flex-col">
          
          {currentView === 'analyzer' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Top Header Section */}
              <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">{selectedStock.ticker}</h1>
                    <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-full text-sm font-medium border border-slate-700">
                      {selectedStock.name}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-4">
                    <span className="text-5xl font-bold text-white tracking-tighter">
                      ${selectedStock.currentPrice.toFixed(2)}
                    </span>
                    <div className={`flex items-center text-lg font-semibold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isPositive ? <ArrowUpRight className="w-5 h-5 mr-1" /> : <ArrowDownRight className="w-5 h-5 mr-1" />}
                      {Math.abs(selectedStock.change).toFixed(2)} ({Math.abs(selectedStock.changePercent)}%)
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleRefreshData}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-xl transition-colors border border-slate-700"
                    title="Refresh Market Data"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </header>

              {/* Chart Section */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-300">30-Day Performance</h2>
                </div>
                <StockChart data={selectedStock.history} isPositive={isPositive} />
              </section>

              {/* AI Analysis Section */}
              <section className="pb-12">
                <AnalysisPanel 
                  ticker={selectedStock.ticker}
                  analysis={currentAnalysis || null}
                  isLoading={isAnalyzing}
                  error={analysisError}
                  onGenerate={handleGenerateAnalysis}
                />
              </section>
            </div>
          )}

          {currentView === 'institutional' && (
            <InstitutionalDashboard 
              trades={instTrades} 
              topAccumulated={topAccumulated}
              isLiveFeedActive={isLiveFeedActive}
              onToggleLiveFeed={() => setIsLiveFeedActive(!isLiveFeedActive)}
            />
          )}

          {currentView === 'monitor' && (
            <SystemMonitor />
          )}
          
        </div>
      </main>
    </div>
  );
}
