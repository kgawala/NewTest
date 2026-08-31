import { LogEntry } from '../types.ts';

class SystemLogger {
  private logs: LogEntry[] = [];
  private listeners: ((logs: LogEntry[]) => void)[] = [];
  private isInitialized = false;

  private addLog(level: LogEntry['level'], message: string) {
    const entry: LogEntry = {
      id: Math.random().toString(36).substring(2, 11),
      timestamp: new Date().toISOString(),
      level,
      message,
    };
    
    // Keep the last 100 logs to prevent memory leaks
    this.logs = [entry, ...this.logs].slice(0, 100);
    this.notify();
  }

  subscribe(listener: (logs: LogEntry[]) => void) {
    this.listeners.push(listener);
    listener(this.logs); // Send current state immediately
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    // Use setTimeout to decouple from React's render cycle and avoid update-during-render warnings
    setTimeout(() => {
      this.listeners.forEach(l => l([...this.logs]));
    }, 0);
  }

  init() {
    if (this.isInitialized) return;
    this.isInitialized = true;

    const origWarn = console.warn;
    const origError = console.error;

    console.warn = (...args) => {
      this.addLog('warn', args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
      origWarn.apply(console, args);
    };

    console.error = (...args) => {
      this.addLog('error', args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
      origError.apply(console, args);
    };
    
    this.addLog('system', 'System Logger initialized. Intercepting console streams.');
    this.addLog('agent', 'DevOps Agent online. Monitoring for anomalies and errors.');
  }
  
  info(message: string) {
    this.addLog('info', message);
  }

  system(message: string) {
    this.addLog('system', message);
  }

  agent(message: string) {
    this.addLog('agent', message);
  }
}

export const logger = new SystemLogger();
