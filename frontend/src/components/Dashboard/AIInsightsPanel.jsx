import { motion } from 'framer-motion';
import { BrainCircuit, AlertCircle, Lightbulb, Target, ShieldAlert, Sparkles } from 'lucide-react';

const AIInsightsPanel = ({ summary, insights, risks, recommendations, dataQuality, onAnalyze, isAnalyzing }) => {
  const safeInsights = insights || [];
  const safeRisks = risks || [];
  const safeRecommendations = recommendations || [];
  const safeDataQuality = dataQuality || [];

  if (!summary && safeInsights.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-border-subtle rounded-2xl p-6 shadow-sm relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6 border-b border-border-subtle pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BrainCircuit className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">AI Executive Analysis</h2>
            <p className="text-sm text-slate-500">Real-time business intelligence</p>
          </div>
        </div>
        {onAnalyze && (
          <button 
            onClick={onAnalyze} 
            disabled={isAnalyzing}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
          </button>
        )}
      </div>

      <div className="space-y-6 relative z-10">
        {summary && (
          <div className="prose max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed font-medium">{summary}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {safeInsights.length > 0 && (
            <div className="bg-slate-50 border border-border-subtle rounded-xl p-4">
              <h3 className="flex items-center gap-2 text-primary font-semibold mb-3">
                <Lightbulb className="w-4 h-4" /> Key Insights
              </h3>
              <ul className="space-y-2">
                {safeInsights.map((item, idx) => (
                  <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-primary mt-1">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {safeRisks.length > 0 && (
            <div className="bg-danger/5 border border-danger/10 rounded-xl p-4">
              <h3 className="flex items-center gap-2 text-danger font-semibold mb-3">
                <AlertCircle className="w-4 h-4" /> Risks Identified
              </h3>
              <ul className="space-y-2">
                {safeRisks.map((item, idx) => (
                  <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-danger mt-1">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {safeRecommendations.length > 0 && (
            <div className="bg-success/5 border border-success/10 rounded-xl p-4">
              <h3 className="flex items-center gap-2 text-success font-semibold mb-3">
                <Target className="w-4 h-4" /> Recommendations
              </h3>
              <ul className="space-y-2">
                {safeRecommendations.map((item, idx) => (
                  <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-success mt-1">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {safeDataQuality.length > 0 && (
          <div className="mt-4 flex items-start gap-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <ShieldAlert className="w-4 h-4 text-warning mt-0.5 shrink-0" />
            <div className="text-sm text-warning">
              <span className="font-semibold text-slate-800">Data Quality Warning:</span> {safeDataQuality.join(" ")}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AIInsightsPanel;
