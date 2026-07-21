import { motion } from 'framer-motion';
import { Search, Filter, AlertCircle, Clock } from 'lucide-react';

const WorkOrdersTable = ({ orders }) => {
  const displayOrders = orders?.length > 0 ? orders : [
    { id: 'Loading', project: 'Waiting for AI Analysis...', client: '-', date: '-', priority: '-', status: 'Loading' }
  ];

  const getPriorityBadge = (priority) => {
    const p = String(priority).toLowerCase();
    if (p.includes('critical') || p.includes('high')) return <span className="flex items-center gap-1 text-danger font-semibold"><AlertCircle className="w-3 h-3" /> {priority}</span>;
    if (p.includes('medium')) return <span className="text-warning font-semibold">{priority}</span>;
    return <span className="text-slate-400 font-semibold">{priority}</span>;
  };

  const getStatusColor = (status) => {
    const s = String(status).toLowerCase();
    if (s.includes('completed') || s.includes('done')) return 'text-success bg-success/15 border-success/30';
    if (s.includes('progress') || s.includes('active')) return 'text-primary bg-primary/15 border-primary/30';
    if (s.includes('delay') || s.includes('risk')) return 'text-danger bg-danger/15 border-danger/30';
    if (s.includes('loading')) return 'text-slate-400 bg-slate-100 border-slate-200 animate-pulse';
    return 'text-slate-500 bg-slate-100 border-slate-200';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white border border-border-subtle rounded-3xl overflow-hidden shadow-premium"
    >
      <div className="p-6 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">Recent Work Orders</h3>
        
        <div className="flex items-center gap-2">
          <button className="p-2 bg-slate-50 border border-border-subtle rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors">
            <Search className="w-4 h-4" />
          </button>
          <button className="p-2 bg-slate-50 border border-border-subtle rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto relative">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead className="bg-slate-50/90 backdrop-blur-sm sticky top-0 z-10 border-b border-border-subtle">
            <tr>
              <th className="p-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Order ID</th>
              <th className="p-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Project / Client</th>
              <th className="p-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
              <th className="p-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Priority</th>
              <th className="p-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {displayOrders.map((order, idx) => (
              <tr key={order.id || idx} className="hover:bg-slate-50/80 transition-colors cursor-pointer group">
                <td className="p-5 text-[14px] font-bold text-primary group-hover:text-accent-secondary transition-colors">{order.id}</td>
                <td className="p-5">
                  <div className="font-semibold text-slate-900 text-[15px] mb-0.5">{order.project}</div>
                  <div className="text-[13px] text-slate-500">{order.client}</div>
                </td>
                <td className="p-5 text-[14px] text-slate-500">
                  <div className="flex items-center gap-2 font-medium">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {order.date}
                  </div>
                </td>
                <td className="p-5 text-[14px]">
                  {getPriorityBadge(order.priority)}
                </td>
                <td className="p-5">
                  <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border shadow-sm ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default WorkOrdersTable;
