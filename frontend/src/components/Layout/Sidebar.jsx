import { Home, Brain, LineChart, Briefcase, DollarSign, RefreshCw, AlertTriangle, ShieldCheck, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'AI Business Analyst', path: '/ai-business-analyst', icon: Brain },
    { name: 'Leadership Report', path: '/leadership-report', icon: LineChart },
    { name: 'Pipeline Intelligence', path: '/pipeline-intelligence', icon: Briefcase },
    { name: 'Revenue Analytics', path: '/revenue-analytics', icon: DollarSign },
    { name: 'Work Orders', path: '/work-orders', icon: Briefcase },
    { name: 'Cross Board Insights', path: '/cross-board-insights', icon: RefreshCw },
    { name: 'Data Quality', path: '/data-quality', icon: ShieldCheck },
    { name: 'Risk Center', path: '/risk-center', icon: AlertTriangle },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="h-screen sidebar-gradient border-r border-border-subtle flex flex-col transition-all duration-300 relative z-20 shadow-[1px_0_10px_rgba(0,0,0,0.02)]"
    >
      <div className="p-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-primary flex items-center justify-center shrink-0 shadow-premium">
          <Brain className="w-5 h-5 text-white" />
        </div>
        {!isCollapsed && (
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-bold text-[19px] text-slate-900 tracking-tight whitespace-nowrap"
          >
            Skylark BI
          </motion.span>
        )}
      </div>

      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-white border border-border-subtle rounded-full flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-colors shadow-sm"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto overflow-x-hidden">
        <p className={`text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2 ${isCollapsed ? 'hidden' : 'block'}`}>
          Analytics Core
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all duration-200 group relative ${
              isActive 
                ? 'bg-slate-900 text-white shadow-premium' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
            }`}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-800'}`} />
                {!isCollapsed && (
                  <span className={`whitespace-nowrap truncate font-medium text-[15px] ${isActive ? 'text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>{item.name}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
