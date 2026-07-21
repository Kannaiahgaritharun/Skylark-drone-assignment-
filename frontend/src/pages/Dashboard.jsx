import HeroCards from '../components/Dashboard/HeroCards';
import AIInsightsPanel from '../components/Dashboard/AIInsightsPanel';
import AnalyticsCharts from '../components/Charts/AnalyticsCharts';
import DealsTable from '../components/Tables/DealsTable';
import WorkOrdersTable from '../components/Tables/WorkOrdersTable';
import { useData } from '../context/DataContext';

const Dashboard = () => {
  const { data, fetchAIInsights, loading } = useData();
  return (
    <div className="space-y-6 pb-12">
      <HeroCards deals={data?.RecentDeals} orders={data?.RecentWorkOrders} />
      <AIInsightsPanel 
        summary={data?.ExecutiveSummary} 
        insights={data?.Insights} 
        risks={data?.Risks} 
        recommendations={data?.Recommendations} 
        dataQuality={data?.DataQualityNotes} 
        onAnalyze={() => fetchAIInsights()}
        isAnalyzing={loading}
      />
      <AnalyticsCharts revenueData={data?.ChartData} sectorData={data?.SectorData} deals={data?.RecentDeals} orders={data?.RecentWorkOrders} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DealsTable deals={data?.RecentDeals} />
        <WorkOrdersTable orders={data?.RecentWorkOrders} />
      </div>
    </div>
  );
};
export default Dashboard;
