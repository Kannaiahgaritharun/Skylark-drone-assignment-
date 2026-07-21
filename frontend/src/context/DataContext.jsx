import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');
  
  const [isAIOffline, setIsAIOffline] = useState(false);
  const [offlineReason, setOfflineReason] = useState('');

  const fetchInsights = async (query = 'startup_data_only') => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8000/api/chat', {
        query: query
      });
      
      if (response.data.error) {
         throw new Error(response.data.error);
      }
      
      setData(response.data);
      setIsAIOffline(response.data.isAIOffline || false);
      setOfflineReason(response.data.offlineReason || '');
      
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      setError(err.message || 'Failed to fetch insights from AI backend');
    } finally {
      setLoading(false);
    }
  };

  const fetchAIInsights = (customQuery) => {
    const defaultAIQuery = 'Analyze our current pipeline, work orders, and overall business health. Identify risks, metrics, and data quality issues.';
    return fetchInsights(customQuery || defaultAIQuery);
  };

  useEffect(() => {
    fetchInsights('startup_data_only');
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, error, lastUpdated, isAIOffline, offlineReason, fetchInsights, fetchAIInsights }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
