import HeroCards from '../components/Dashboard/HeroCards';
import AIInsightsPanel from '../components/Dashboard/AIInsightsPanel';
import { useData } from '../context/DataContext';

const LeadershipReport = () => {
  const { data, fetchAIInsights, loading } = useData();
  return (
    <div className="space-y-6 pb-12">
      <h2 className="text-2xl font-bold text-white mb-6">Leadership Report</h2>
      <HeroCards deals={data?.RecentDeals} orders={data?.RecentWorkOrders} />
      <AIInsightsPanel 
        summary={data?.ExecutiveSummary} 
        insights={data?.Insights} 
        risks={data?.Risks} 
        recommendations={data?.Recommendations} 
        onAnalyze={() => fetchAIInsights('Generate a comprehensive Leadership Report summarizing our current pipeline, work orders, and overall business health.')}
        isAnalyzing={loading}
      />
    </div>
  );
};
export default LeadershipReport;
