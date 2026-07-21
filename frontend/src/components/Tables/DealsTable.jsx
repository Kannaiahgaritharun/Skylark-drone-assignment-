import { motion } from 'framer-motion';
import { Search, ChevronDown, MoreHorizontal, User } from 'lucide-react';

const DealsTable = ({ deals }) => {
  const displayDeals = deals?.length > 0 ? deals : [
    { id: 1, name: 'Waiting for AI Analysis...', customer: '-', owner: '-', value: '-', stage: '-', probability: '0%', status: 'Loading' }
  ];

  const getStatusColor = (status) => {
    const s = String(status).toLowerCase();
    if (s.includes('completed') || s.includes('done') || s.includes('won')) return 'bg-success/15 text-success border-success/30';
    if (s.includes('progress') || s.includes('active')) return 'bg-primary/15 text-primary border-primary/30';
    if (s.includes('delay')) return 'bg-warning/15 text-warning border-warning/30';
    if (s.includes('risk') || s.includes('lost')) return 'bg-danger/15 text-danger border-danger/30';
    if (s.includes('loading')) return 'bg-slate-100 text-slate-400 border-slate-200 animate-pulse';
    return 'bg-slate-100 text-slate-500 border-slate-200'; // Pending/Other
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-border-subtle rounded-3xl overflow-hidden shadow-premium"
    >
      <div className="p-6 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Active Deals</h3>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search deals..." 
              className="bg-slate-50 border border-border-subtle rounded-xl pl-10 pr-4 py-2 text-[14px] text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 focus:bg-white transition-all w-64 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 bg-slate-50 border border-border-subtle rounded-xl px-4 py-2 text-[14px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all shadow-sm">
            Filter <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto relative">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-slate-50/90 backdrop-blur-sm sticky top-0 z-10 border-b border-border-subtle">
            <tr>
              <th className="p-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Deal Name</th>
              <th className="p-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Owner</th>
              <th className="p-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Value</th>
              <th className="p-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Stage</th>
              <th className="p-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Health</th>
              <th className="p-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {displayDeals.map((deal, idx) => (
              <tr key={deal.id || idx} className="hover:bg-slate-50/80 transition-colors group">
                <td className="p-5">
                  <div className="font-semibold text-slate-900 text-[15px] mb-0.5">{deal.name}</div>
                  <div className="text-[13px] text-slate-500 font-medium">{deal.customer}</div>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-sm border border-primary/20">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-[14px] font-medium text-slate-700">{deal.owner}</span>
                  </div>
                </td>
                <td className="p-5 text-[15px] text-slate-900 font-bold tracking-tight">{deal.value}</td>
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-full bg-slate-200 rounded-full h-2 max-w-[80px] shadow-inner">
                      <div className="bg-primary h-2 rounded-full shadow-sm" style={{ width: deal.probability }} />
                    </div>
                    <span className="text-[13px] font-semibold text-slate-600">{deal.stage}</span>
                  </div>
                </td>
                <td className="p-5">
                  <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-sm ${getStatusColor(deal.status)}`}>
                    {deal.status}
                  </span>
                </td>
                <td className="p-5 text-right">
                  <button className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default DealsTable;
