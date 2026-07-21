import { motion } from 'framer-motion';
import { DollarSign, Briefcase, Activity, CheckCircle, Clock, ShieldCheck } from 'lucide-react';

const HeroCards = ({ deals = [], orders = [] }) => {
  const safeDeals = deals || [];
  const safeOrders = orders || [];

  // 1 Total Deals
  const totalDeals = safeDeals.length;
  // 2 Active Work Orders
  const activeOrders = safeOrders.filter(o => o.status !== 'Completed' && o.status !== 'Done').length;
  // 3 Revenue Pipeline
  const revenueStr = safeDeals.reduce((sum, d) => {
    const val = parseFloat(String(d.value).replace(/[^0-9.-]+/g,""));
    return sum + (isNaN(val) ? 0 : val);
  }, 0);
  const revenue = revenueStr > 0 ? `$${revenueStr.toLocaleString()}` : (safeDeals[0]?.value || 'Syncing...');
  
  // 4 Delayed Projects
  const delayedProjects = safeOrders.filter(o => String(o.status).toLowerCase().includes('delay')).length;
  // 5 High Risk Deals
  const highRiskDeals = safeDeals.filter(d => String(d.status).toLowerCase().includes('risk')).length;
  // 6 Completion %
  const completedOrders = safeOrders.filter(o => o.status === 'Completed' || o.status === 'Done').length;
  const completionPercent = safeOrders.length > 0 ? Math.round((completedOrders / safeOrders.length) * 100) + '%' : '0%';

  const displayMetrics = [
    { label: "Total Deals", value: totalDeals, icon: Briefcase, color: "text-primary bg-primary/10" },
    { label: "Active Work Orders", value: activeOrders, icon: Activity, color: "text-accent-secondary bg-accent-secondary/10" },
    { label: "Revenue Pipeline", value: revenue, icon: DollarSign, color: "text-success bg-success/10" },
    { label: "Delayed Projects", value: delayedProjects, icon: Clock, color: "text-danger bg-danger/10" },
    { label: "High Risk Deals", value: highRiskDeals, icon: ShieldCheck, color: "text-warning bg-warning/10" },
    { label: "Completion %", value: completionPercent, icon: CheckCircle, color: "text-success bg-success/10" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {displayMetrics.map((metric, idx) => {
        const Icon = metric.icon;
        
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            className="group bg-white border border-border-subtle rounded-2xl p-6 shadow-sm hover:shadow-premium transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[140px]"
          >
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className={`p-2.5 rounded-[14px] ${metric.color} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase bg-slate-50 px-2 py-0.5 rounded border border-slate-100 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                Live
              </span>
            </div>
            
            <div className="relative z-10 mt-auto">
              <p className="text-slate-500 text-[13px] font-medium mb-1.5 tracking-wide">{metric.label}</p>
              <h3 className="text-[28px] font-bold text-slate-900 tracking-tight leading-none">{metric.value}</h3>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/15 transition-colors z-0" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        );
      })}
    </div>
  );
};

export default HeroCards;
