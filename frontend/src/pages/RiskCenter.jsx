import { AlertTriangle } from 'lucide-react';
import { useData } from '../context/DataContext';

const RiskCenter = () => {
  const { data } = useData();
  const risks = data?.Risks || [];

  return (
    <div className="space-y-6 pb-12">
      <h2 className="text-2xl font-bold text-white mb-6">Risk Center</h2>
      <div className="bg-danger/10 border border-danger/20 p-6 rounded-2xl">
        <h4 className="flex items-center text-danger font-medium mb-4 gap-2 text-lg">
          <AlertTriangle className="w-5 h-5" /> Active Risks Identified
        </h4>
        {risks.length === 0 ? (
          <p className="text-gray-400">No risks identified.</p>
        ) : (
          <ul className="space-y-3">
            {risks.map((item, idx) => (
              <li key={idx} className="text-gray-300 flex items-start gap-3 bg-bg-dark p-4 rounded-xl border border-white/5">
                <span className="text-danger mt-1">•</span> {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export default RiskCenter;
