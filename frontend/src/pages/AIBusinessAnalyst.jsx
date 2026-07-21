import ChatInterface from '../components/Chat/ChatInterface';
import AIInsightsPanel from '../components/Dashboard/AIInsightsPanel';
import { useData } from '../context/DataContext';

const AIBusinessAnalyst = () => {
  const { data } = useData();
  return (
    <div className="space-y-6 h-full flex flex-col pb-12">
      <AIInsightsPanel summary={data?.ExecutiveSummary} insights={data?.Insights} />
      <div className="flex-1 min-h-[600px] border border-white/10 rounded-2xl overflow-hidden bg-bg-dark shadow-2xl">
        <ChatInterface />
      </div>
    </div>
  );
};
export default AIBusinessAnalyst;
