import { FileWarning } from 'lucide-react';
import { useData } from '../context/DataContext';

const DataQuality = () => {
  const { data } = useData();
  const notes = data?.DataQualityNotes || [];

  return (
    <div className="space-y-6 pb-12">
      <h2 className="text-2xl font-bold text-white mb-6">Data Quality Center</h2>
      <div className="bg-warning/10 border border-warning/20 p-6 rounded-2xl">
        <h4 className="flex items-center text-warning font-medium mb-4 gap-2 text-lg">
          <FileWarning className="w-5 h-5" /> Active Data Quality Issues
        </h4>
        {notes.length === 0 ? (
          <p className="text-gray-400">No data quality issues found.</p>
        ) : (
          <ul className="space-y-3">
            {notes.map((item, idx) => (
              <li key={idx} className="text-gray-300 flex items-start gap-3 bg-bg-dark p-4 rounded-xl border border-white/5">
                <span className="text-warning mt-1">•</span> {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
export default DataQuality;
