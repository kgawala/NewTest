import React from 'react';
import { Sparkles, AlertCircle, Target, Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AIAnalysis } from '../types.ts';

interface AnalysisPanelProps {
  analysis: AIAnalysis | null;
  isLoading: boolean;
  error: string | null;
  onGenerate: () => void;
  ticker: string;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ 
  analysis, 
  isLoading, 
  error, 
  onGenerate,
  ticker
}) => {
  if (isLoading) {
    return (
      <div className="bg-slate-850 rounded-2xl p-8 border border-slate-800 flex flex-col items-center justify-center min-h-[300px] space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-500/20 rounded-full animate-spin border-t-blue-500"></div>
          <Sparkles className="w-5 h-5 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="text-slate-400 font-medium animate-pulse">Nexus AI is analyzing {ticker}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-500/10 rounded-2xl p-6 border border-rose-500/20 flex items-start gap-4">
        <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-1" />
        <div>
          <h3 className="text-rose-400 font-semibold mb-1">Analysis Failed</h3>
          <p className="text-slate-300 text-sm mb-4">{error}</p>
          <button 
            onClick={onGenerate}
            disabled={isLoading}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-slate-850 rounded-2xl p-8 border border-slate-800 flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-blue-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-200 mb-2">AI-Powered Insights</h3>
        <p className="text-slate-400 max-w-md mb-6">
          Generate a comprehensive daily analysis for {ticker} using advanced Gemini AI models to understand market sentiment and key levels.
        </p>
        <button 
          onClick={onGenerate}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-4 h-4" />
          Generate Analysis
        </button>
      </div>
    );
  }

  const getSentimentIcon = () => {
    switch (analysis.sentiment) {
      case 'BULLISH': return <TrendingUp className="w-5 h-5 text-emerald-400" />;
      case 'BEARISH': return <TrendingDown className="w-5 h-5 text-rose-400" />;
      default: return <Minus className="w-5 h-5 text-slate-400" />;
    }
  };

  const getSentimentColor = () => {
    switch (analysis.sentiment) {
      case 'BULLISH': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      case 'BEARISH': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      default: return 'text-slate-300 bg-slate-700/50 border-slate-600';
    }
  };

  return (
    <div className="bg-slate-850 rounded-2xl border border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Sparkles className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">Gemini Analysis</h3>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onGenerate}
            disabled={isLoading}
            className="text-xs font-medium text-slate-400 hover:text-white transition-colors disabled:opacity-50"
          >
            Regenerate
          </button>
          <div className={`px-3 py-1.5 rounded-full border flex items-center gap-2 text-sm font-bold tracking-wide ${getSentimentColor()}`}>
            {getSentimentIcon()}
            {analysis.sentiment}
          </div>
        </div>
      </div>
      
      <div className="p-6 space-y-8">
        {/* Summary */}
        <div>
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Executive Summary</h4>
          <p className="text-slate-300 leading-relaxed text-lg">
            {analysis.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Key Drivers */}
          <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800/50">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Target className="w-4 h-4" /> Key Drivers
            </h4>
            <ul className="space-y-3">
              {analysis.keyDrivers.map((driver, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                  <span className="text-sm leading-relaxed">{driver}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Levels */}
          <div className="bg-slate-900/50 rounded-xl p-5 border border-slate-800/50 flex flex-col justify-center gap-6">
            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4" /> Technical Levels
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-emerald-500/5 rounded-lg border border-emerald-500/10">
                <span className="text-slate-400 text-sm font-medium">Resistance</span>
                <span className="text-emerald-400 font-bold text-lg">${analysis.resistance.toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-rose-500/5 rounded-lg border border-rose-500/10">
                <span className="text-slate-400 text-sm font-medium">Support</span>
                <span className="text-rose-400 font-bold text-lg">${analysis.support.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
