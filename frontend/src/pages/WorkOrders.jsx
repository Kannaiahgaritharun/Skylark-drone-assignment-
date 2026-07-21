import WorkOrdersTable from '../components/Tables/WorkOrdersTable';
import { useData } from '../context/DataContext';

const WorkOrders = () => {
  const { data } = useData();
  return (
    <div className="space-y-6 pb-12">
      <h2 className="text-2xl font-bold text-white mb-6">Work Orders Management</h2>
      <WorkOrdersTable orders={data?.RecentWorkOrders} />
    </div>
  );
};
export default WorkOrders;
