import { Search, Bell, Sparkles, Moon, AlertOctagon } from 'lucide-react';
import { useData } from '../../context/DataContext';

const Topbar = ({ lastUpdated, isSyncing }) => {
  const { isAIOffline, offlineReason } = useData();
  
  return (
    <header className="h-[72px] glass-header border-b border-border-subtle sticky top-0 z-10 px-8 flex items-center justify-between shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-[420px] max-w-full group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search deals, orders, or ask AI..." 
            className="w-full bg-slate-100/50 hover:bg-slate-100 border border-transparent hover:border-slate-200 rounded-xl pl-10 pr-12 py-2.5 text-[14px] text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 focus:bg-white transition-all shadow-sm"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-block border border-slate-200 bg-white rounded px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 font-mono shadow-sm">⌘</kbd>
            <kbd className="hidden sm:inline-block border border-slate-200 bg-white rounded px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 font-mono shadow-sm">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {isAIOffline && (
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-danger bg-danger/10 px-3 py-1.5 rounded-full border border-danger/20" title={offlineReason}>
            <AlertOctagon className="w-3 h-3" />
            AI Offline
          </div>
        )}
      
        {/* Monday API Connected Badge */}
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
          <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(37,99,235,0.6)] animate-pulse" />
          Monday.com API Live
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-border-subtle">
          <div className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-warning animate-pulse' : 'bg-success'}`} />
          {isSyncing ? 'Syncing...' : 'Synced'}
          <span className="opacity-50 ml-1 border-l border-slate-200 pl-2">
            {lastUpdated || 'Just now'}
          </span>
        </div>

        <button className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
          <Sparkles className="w-4 h-4" />
        </button>
        
        <button className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
          <Moon className="w-4 h-4" />
        </button>

        <button className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
          <Bell className="w-4 h-4" />
        </button>

        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 border-2 border-white ml-2 cursor-pointer shadow-md overflow-hidden flex items-center justify-center text-xs font-bold text-white">
          JS
        </div>
      </div>
    </header>
  );
};

export default Topbar;
