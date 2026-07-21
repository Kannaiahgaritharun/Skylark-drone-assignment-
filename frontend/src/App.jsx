import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, MessageSquare, AlertOctagon } from 'lucide-react';
import AppLayout from './components/Layout/AppLayout';
import ChatInterface from './components/Chat/ChatInterface';
import { useData } from './context/DataContext';

// Pages
import Dashboard from './pages/Dashboard';
import AIBusinessAnalyst from './pages/AIBusinessAnalyst';
import LeadershipReport from './pages/LeadershipReport';
import PipelineIntelligence from './pages/PipelineIntelligence';
import RevenueAnalytics from './pages/RevenueAnalytics';
import WorkOrders from './pages/WorkOrders';
import CrossBoardInsights from './pages/CrossBoardInsights';
import DataQuality from './pages/DataQuality';
import RiskCenter from './pages/RiskCenter';
import Settings from './pages/Settings';

import './index.css';

function App() {
  const { data, loading, error, lastUpdated, fetchInsights, isAIOffline, offlineReason } = useData();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <AppLayout lastUpdated={lastUpdated} isSyncing={loading}>
      {/* AI Chat Copilot Toggle */}
      {!isChatOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-accent text-white p-4 rounded-full shadow-[0_0_20px_rgba(var(--color-accent),0.4)] flex items-center justify-center group"
          title="Open AI Copilot"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap pl-0 group-hover:pl-2 font-medium">
            Ask AI Copilot
          </span>
        </motion.button>
      )}

      {/* Slide-out Chat Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full md:w-[480px] h-screen bg-bg-dark/95 backdrop-blur-2xl border-l border-white/10 z-50 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col"
          >
            <ChatInterface onClose={() => setIsChatOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`transition-all duration-300 ${isChatOpen ? 'md:pr-[480px]' : ''}`}>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-danger/10 border border-danger/20 text-danger p-4 rounded-xl flex items-center justify-between mb-6"
          >
            <span>Error: {error}</span>
            <button onClick={fetchInsights} className="text-sm underline hover:text-white">Retry</button>
          </motion.div>
        )}

        {isAIOffline && !error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-warning/10 border border-warning/20 p-4 rounded-xl flex items-center justify-between mb-6 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-warning/20 flex items-center justify-center shrink-0">
                <AlertOctagon className="w-4 h-4 text-warning" />
              </div>
              <div>
                <p className="text-warning font-semibold text-sm">AI service is temporarily unavailable ({offlineReason}).</p>
                <p className="text-warning/80 text-xs mt-0.5">Business data from Monday.com is still available. Please try again later.</p>
              </div>
            </div>
            <button 
              onClick={() => fetchInsights()}
              className="ml-auto px-4 py-1.5 bg-warning-dark hover:bg-warning-dark/90 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
            >  Retry Connection
            </button>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {loading && !data ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-[60vh] gap-4"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-white/5" />
                <Loader2 className="w-16 h-16 text-accent animate-spin absolute top-0 left-0" />
              </div>
              <p className="text-gray-400 font-medium animate-pulse">AI Agent is analyzing Monday.com data...</p>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full h-full"
            >
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/ai-business-analyst" element={<AIBusinessAnalyst />} />
                <Route path="/leadership-report" element={<LeadershipReport />} />
                <Route path="/pipeline-intelligence" element={<PipelineIntelligence />} />
                <Route path="/revenue-analytics" element={<RevenueAnalytics />} />
                <Route path="/work-orders" element={<WorkOrders />} />
                <Route path="/cross-board-insights" element={<CrossBoardInsights />} />
                <Route path="/data-quality" element={<DataQuality />} />
                <Route path="/risk-center" element={<RiskCenter />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}

export default App;
