import DealsTable from '../components/Tables/DealsTable';
import WorkOrdersTable from '../components/Tables/WorkOrdersTable';
import { useData } from '../context/DataContext';

const CrossBoardInsights = () => {
  const { data } = useData();
  return (
    <div className="space-y-6 pb-12">
      <h2 className="text-2xl font-bold text-white mb-6">Cross Board Insights</h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <DealsTable deals={data?.RecentDeals} />
        <WorkOrdersTable orders={data?.RecentWorkOrders} />
      </div>
    </div>
  );
};
export default CrossBoardInsights;
