import React, { useEffect, useState, useRef } from 'react';
import { Terminal, ShieldAlert, Bot, Rocket, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';
import { LogEntry } from '../types.ts';
import { logger } from '../utils/logger.ts';

export const SystemMonitor: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to global logger
  useEffect(() => {
    const unsubscribe = logger.subscribe(setLogs);
    return () => unsubscribe();
  }, []);

  // DevOps Agent Logic: Watch for errors and respond automatically
  useEffect(() => {
    if (logs.length === 0) return;
    
    const latestLog = logs[0]; // Logs are prepended, so index 0 is the newest
    
    if (latestLog.level === 'error' && !latestLog.message.includes('Agent:')) {
      // Simulate agent analyzing the error
      const timer = setTimeout(() => {
        let recommendation = "General fault detected. Recommend checking stack trace.";
        if (latestLog.message.includes('API') || latestLog.message.includes('fetch')) {
          recommendation = "Network anomaly detected. Verifying API endpoints and rate limits. Applying exponential backoff.";
        } else if (latestLog.message.includes('Simulated')) {
          recommendation = "Simulated crash detected. Guard rails successfully prevented application termination.";
        }
        
        logger.agent(`Analysis complete for error [${latestLog.id}]: ${recommendation}`);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [logs]);

  const handleSimulateError = () => {
    console.error("Simulated Critical Failure: Unable to parse incoming websocket data stream.");
  };

  const handleDeploy = () => {
    if (isDeploying) return;
    setIsDeploying(true);
    
    logger.system("Initiating deployment sequence...");
    
    setTimeout(() => logger.info("Building assets and optimizing bundles..."), 1000);
    setTimeout(() => logger.info("Running pre-deployment test suite..."), 2500);
    setTimeout(() => logger.info("Pushing to edge nodes (us-east, eu-west, ap-south)..."), 4000);
    setTimeout(() => {
      logger.system("Deployment successful. Application is live.");
      logger.agent("Deployment monitored. All systems nominal. Performance metrics within acceptable parameters.");
      setIsDeploying(false);
    }, 6000);
  };

  const getLogColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'info': return 'text-blue-400';
      case 'warn': return 'text-amber-400';
      case 'error': return 'text-rose-500 font-bold';
      case 'agent': return 'text-purple-400 font-semibold';
      case 'system': return 'text-emerald-400 font-bold';
      default: return 'text-slate-300';
    }
  };

  const getLogIcon = (level: LogEntry['level']) => {
    switch (level) {
      case 'info': return <Activity className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />;
      case 'warn': return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />;
      case 'error': return <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />;
      case 'agent': return <Bot className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />;
      case 'system': return <Terminal className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />;
      default: return <Activity className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />;
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}.${date.getMilliseconds().toString().padStart(3, '0')}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">DevOps Agent</h1>
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-sm font-medium border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Systems Online
            </span>
          </div>
          <p className="text-slate-400 text-lg">Autonomous monitoring, deployment, and error resolution.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSimulateError}
            className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl transition-colors text-sm font-bold flex items-center gap-2"
          >
            <AlertTriangle className="w-4 h-4" />
            Simulate Error
          </button>
          <button 
            onClick={handleDeploy}
            disabled={isDeploying}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:text-emerald-400 text-white rounded-xl transition-colors font-bold flex items-center gap-2 shadow-lg shadow-emerald-900/20"
          >
            <Rocket className={`w-4 h-4 ${isDeploying ? 'animate-bounce' : ''}`} />
            {isDeploying ? 'Deploying...' : 'Deploy App'}
          </button>
        </div>
      </header>

      {/* Terminal Window */}
      <div className="flex-1 bg-[#0a0f1a] rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col font-mono text-sm">
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center gap-2 shrink-0">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>
          <div className="ml-4 text-slate-500 text-xs font-sans flex items-center gap-2">
            <Terminal className="w-3 h-3" /> nexus-core-agent-tty1
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col-reverse">
          <div ref={logsEndRef} />
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 hover:bg-white/5 p-1 rounded transition-colors">
              <span className="text-slate-600 shrink-0">[{formatTime(log.timestamp)}]</span>
              {getLogIcon(log.level)}
              <span className={`break-all ${getLogColor(log.level)}`}>
                {log.level === 'agent' && <span className="text-slate-400 mr-2">Agent:</span>}
                {log.message}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
