import AnalyticsCharts from '../components/Charts/AnalyticsCharts';
import { useData } from '../context/DataContext';

const RevenueAnalytics = () => {
  const { data } = useData();
  return (
    <div className="space-y-6 pb-12">
      <h2 className="text-2xl font-bold text-white mb-6">Revenue Analytics</h2>
      <AnalyticsCharts revenueData={data?.ChartData} sectorData={data?.SectorData} deals={data?.RecentDeals} orders={data?.RecentWorkOrders} />
    </div>
  );
};
export default RevenueAnalytics;
