import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

const AnalyticsCharts = ({ revenueData, sectorData, deals = [], orders = [] }) => {
  const displayRevenue = revenueData?.length > 0 ? revenueData : [{ name: 'Loading', value: 0 }];
  const displaySector = sectorData?.length > 0 ? sectorData : [{ name: 'Loading', value: 0 }];

  // Compute Deal Status Distribution
  const statusCounts = (deals || []).reduce((acc, deal) => {
    acc[deal.status] = (acc[deal.status] || 0) + 1;
    return acc;
  }, {});
  const dealStatusData = Object.keys(statusCounts).map(key => ({ name: key, value: statusCounts[key] }));
  const PIE_COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#0EA5E9', '#8B5CF6'];

  // Compute Owner Performance
  const ownerCounts = (deals || []).reduce((acc, deal) => {
    acc[deal.owner] = (acc[deal.owner] || 0) + 1;
    return acc;
  }, {});
  const ownerData = Object.keys(ownerCounts).map(key => ({ name: key, value: ownerCounts[key] })).sort((a,b) => b.value - a.value).slice(0, 5);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-border-subtle p-3 rounded-xl shadow-lg backdrop-blur-md">
          <p className="text-slate-500 font-medium mb-1">{label}</p>
          <p className="text-primary font-bold">
            {payload[0].name === 'value' && payload[0].payload.value > 100 
              ? `$${payload[0].value.toLocaleString()}`
              : payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* 1. Revenue Trend */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-border-subtle rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={displayRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{fill: '#64748B', fontSize: 12}} tickLine={false} axisLine={false} />
              <YAxis tick={{fill: '#64748B', fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(value) => value > 1000 ? `$${value/1000}k` : value} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 2. Sector Performance */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-border-subtle rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue by Sector</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={displaySector} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{fill: '#64748B', fontSize: 12}} tickLine={false} axisLine={false} />
              <YAxis tick={{fill: '#64748B', fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(value) => value > 1000 ? `$${value/1000}k` : value} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: '#F1F5F9'}} />
              <Bar dataKey="value" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 3. Deal Status Distribution */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white border border-border-subtle rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-6">Deal Status Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dealStatusData.length > 0 ? dealStatusData : [{name: 'Loading', value: 1}]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {dealStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* 4. Owner Performance */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white border border-border-subtle rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
      >
        <h3 className="text-lg font-bold text-slate-900 mb-6">Top Performers</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ownerData.length > 0 ? ownerData : [{name: 'Loading', value: 0}]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
              <XAxis type="number" tick={{fill: '#64748B', fontSize: 12}} tickLine={false} axisLine={false} />
              <YAxis dataKey="name" type="category" tick={{fill: '#64748B', fontSize: 12}} tickLine={false} axisLine={false} width={100} />
              <Tooltip content={<CustomTooltip />} cursor={{fill: '#F1F5F9'}} />
              <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};

export default AnalyticsCharts;
