import DealsTable from '../components/Tables/DealsTable';
import { useData } from '../context/DataContext';

const PipelineIntelligence = () => {
  const { data } = useData();
  return (
    <div className="space-y-6 pb-12">
      <h2 className="text-2xl font-bold text-white mb-6">Pipeline Intelligence</h2>
      <DealsTable deals={data?.RecentDeals} />
    </div>
  );
};
export default PipelineIntelligence;
