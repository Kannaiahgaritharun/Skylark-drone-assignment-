import { useState } from 'react';
import { Bot, User, Copy, Check, AlertTriangle, Lightbulb, FileWarning, TrendingUp, BarChart2, PieChart, Briefcase, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatMessage = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isAI = message.role === 'ai';

  const handleCopy = () => {
    let textToCopy = '';
    if (isAI && typeof message.content === 'object') {
      textToCopy = message.content.ExecutiveSummary || '';
      if (message.content.Insights?.length) {
        textToCopy += '\n\nInsights:\n' + message.content.Insights.map(i => `- ${i}`).join('\n');
      }
      if (message.content.Risks?.length) {
        textToCopy += '\n\nRisks:\n' + message.content.Risks.map(r => `- ${r}`).join('\n');
      }
      if (message.content.Recommendations?.length) {
        textToCopy += '\n\nRecommendations:\n' + message.content.Recommendations.map(r => `- ${r}`).join('\n');
      }
    } else {
      textToCopy = message.content;
    }
    
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderAIContent = (data) => {
    if (typeof data === 'string') return <p className="text-gray-200 leading-relaxed">{data}</p>;
    
    return (
      <div className="space-y-6 w-full">
        {data.ConfidenceScore && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Confidence</span>
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold shadow-sm ${data.ConfidenceScore.toLowerCase() === 'high' ? 'bg-success/15 text-success border border-success/30' : data.ConfidenceScore.toLowerCase() === 'medium' ? 'bg-warning/15 text-warning border border-warning/30' : 'bg-danger/15 text-danger border border-danger/30'}`}>
              {data.ConfidenceScore}
            </span>
          </div>
        )}

        {data.ExecutiveSummary && (
          <div className="text-slate-700 leading-relaxed text-[15px]">
            {data.ExecutiveSummary}
          </div>
        )}

        {data.BusinessMetrics && data.BusinessMetrics.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mt-5">
            {data.BusinessMetrics.map((metric, idx) => (
              <div key={idx} className="bg-white hover:bg-slate-50 transition-all duration-300 p-4 rounded-[16px] border border-border-subtle shadow-sm hover:shadow-premium hover:-translate-y-0.5">
                <p className="text-slate-400 text-[11px] mb-1 font-bold tracking-widest uppercase truncate" title={metric.label}>{metric.label}</p>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">{metric.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4 mt-4">
          {data.Insights && data.Insights.length > 0 && (
            <div className="bg-primary/5 border-l-4 border-l-primary border-t border-t-primary/10 border-r border-r-primary/10 border-b border-b-primary/10 p-4 rounded-r-2xl rounded-l-md shadow-sm">
              <h4 className="flex items-center text-primary font-bold mb-3 gap-2 text-sm tracking-wide">
                <Lightbulb className="w-4 h-4" /> Key Insights
              </h4>
              <ul className="space-y-2.5">
                {data.Insights.map((item, idx) => (
                  <li key={idx} className="text-[14px] text-slate-700 flex items-start gap-2.5 leading-relaxed">
                    <span className="text-primary mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 shadow-sm" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.Risks && data.Risks.length > 0 && (
            <div className="bg-danger/5 border-l-4 border-l-danger border-t border-t-danger/10 border-r border-r-danger/10 border-b border-b-danger/10 p-4 rounded-r-2xl rounded-l-md shadow-sm">
              <h4 className="flex items-center text-danger font-bold mb-3 gap-2 text-sm tracking-wide">
                <AlertTriangle className="w-4 h-4" /> Risks Identified
              </h4>
              <ul className="space-y-2.5">
                {data.Risks.map((item, idx) => (
                  <li key={idx} className="text-[14px] text-slate-700 flex items-start gap-2.5 leading-relaxed">
                    <span className="text-danger mt-2 w-1.5 h-1.5 rounded-full bg-danger flex-shrink-0 shadow-sm" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.Recommendations && data.Recommendations.length > 0 && (
            <div className="bg-success/5 border-l-4 border-l-success border-t border-t-success/10 border-r border-r-success/10 border-b border-b-success/10 p-4 rounded-r-2xl rounded-l-md shadow-sm">
              <h4 className="flex items-center text-success font-bold mb-3 gap-2 text-sm tracking-wide">
                <TrendingUp className="w-4 h-4" /> Recommendations
              </h4>
              <ul className="space-y-2.5">
                {data.Recommendations.map((item, idx) => (
                  <li key={idx} className="text-[14px] text-slate-700 flex items-start gap-2.5 leading-relaxed">
                    <span className="text-success mt-2 w-1.5 h-1.5 rounded-full bg-success flex-shrink-0 shadow-sm" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.DataQualityNotes && data.DataQualityNotes.length > 0 && (
            <div className="bg-warning/5 border-l-4 border-l-warning border-t border-t-warning/10 border-r border-r-warning/10 border-b border-b-warning/10 p-4 rounded-r-2xl rounded-l-md shadow-sm">
              <h4 className="flex items-center text-warning font-bold mb-3 gap-2 text-sm tracking-wide">
                <FileWarning className="w-4 h-4" /> Data Quality Issues
              </h4>
              <ul className="space-y-2.5">
                {data.DataQualityNotes.map((item, idx) => (
                  <li key={idx} className="text-[14px] text-slate-700 flex items-start gap-2.5 leading-relaxed">
                    <span className="text-warning mt-2 w-1.5 h-1.5 rounded-full bg-warning flex-shrink-0 shadow-sm" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {data.ChartData && data.ChartData.length > 0 && (
            <div className="bg-slate-50 border border-border-subtle p-4 rounded-2xl shadow-sm">
              <h4 className="flex items-center text-slate-700 font-bold mb-2 gap-2 text-sm">
                <BarChart2 className="w-4 h-4 text-primary" /> Revenue Trend
              </h4>
              <div className="space-y-2.5 mt-3">
                {data.ChartData.slice(0,5).map((cd, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm border-b border-border-subtle pb-2 last:border-0 last:pb-0">
                    <span className="text-slate-500 font-medium">{cd.name}</span>
                    <span className="text-slate-900 font-bold">{cd.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {data.SectorData && data.SectorData.length > 0 && (
            <div className="bg-slate-50 border border-border-subtle p-4 rounded-2xl shadow-sm">
              <h4 className="flex items-center text-slate-700 font-bold mb-2 gap-2 text-sm">
                <PieChart className="w-4 h-4 text-primary" /> Sector Distribution
              </h4>
              <div className="space-y-2.5 mt-3">
                {data.SectorData.slice(0,5).map((sd, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm border-b border-border-subtle pb-2 last:border-0 last:pb-0">
                    <span className="text-slate-500 font-medium">{sd.name}</span>
                    <span className="text-slate-900 font-bold">{sd.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {data.RecentDeals && data.RecentDeals.length > 0 && (
            <div className="bg-slate-50 border border-border-subtle p-4 rounded-2xl shadow-sm">
              <h4 className="flex items-center text-slate-700 font-bold mb-3 gap-2 text-sm">
                <Briefcase className="w-4 h-4 text-primary" /> Deals Snapshot
              </h4>
              <div className="space-y-2.5">
                {data.RecentDeals.slice(0, 3).map((deal, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-[12px] border border-border-subtle flex flex-col gap-1.5 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-[14px] font-bold text-slate-900 truncate max-w-[150px]">{deal.name}</span>
                      <span className="text-[14px] font-bold text-slate-900">{deal.value}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                      <span>{deal.stage}</span>
                      <span className={`px-2 py-0.5 rounded-full ${deal.status?.toLowerCase().includes('won') ? 'bg-success/15 text-success border border-success/30' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>{deal.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {data.RecentWorkOrders && data.RecentWorkOrders.length > 0 && (
            <div className="bg-slate-50 border border-border-subtle p-4 rounded-2xl shadow-sm">
              <h4 className="flex items-center text-slate-700 font-bold mb-3 gap-2 text-sm">
                <Settings className="w-4 h-4 text-primary" /> Work Orders Snapshot
              </h4>
              <div className="space-y-2.5">
                {data.RecentWorkOrders.slice(0, 3).map((wo, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-[12px] border border-border-subtle flex flex-col gap-1.5 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-[14px] font-bold text-slate-900 truncate max-w-[150px]">{wo.project}</span>
                      <span className="text-xs text-slate-400 font-medium">{wo.date}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500 font-medium">
                      <span>{wo.client}</span>
                      <span className={`px-2 py-0.5 rounded-full ${wo.status?.toLowerCase().includes('done') ? 'bg-success/15 text-success border border-success/30' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>{wo.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className={`py-3 px-6 flex gap-4 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-sm ${isAI ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
        {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>
      
      <div className={`flex flex-col min-w-0 max-w-[85%] ${isAI ? 'items-start' : 'items-end'}`}>
        <div className={`flex items-center gap-2 mb-1.5 px-2 ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
          <span className="font-bold text-[13px] text-slate-700">{isAI ? 'Skylark Copilot' : 'You'}</span>
          <span className="text-[11px] text-slate-400 font-medium">{message.timestamp}</span>
        </div>
        
        <div className={`relative px-5 py-4 shadow-premium ${isAI ? 'bg-white rounded-[24px] rounded-tl-sm border border-border-subtle' : 'bg-gradient-to-br from-accent to-accent-secondary text-white rounded-[24px] rounded-tr-sm'}`}>
          <div className={`prose max-w-none w-full text-[15px] leading-[1.7] ${isAI ? 'prose-slate text-slate-700' : 'text-white'}`}>
            {isAI ? renderAIContent(message.content) : (
              <p className="whitespace-pre-wrap m-0 font-medium">{message.content}</p>
            )}
          </div>

          {message.isError && (
            <div className="mt-4 text-danger text-sm flex items-center gap-2 bg-danger/10 p-3 rounded-lg border border-danger/20 shadow-sm">
              <AlertTriangle className="w-4 h-4" />
              {message.error || "An error occurred fetching the response."}
            </div>
          )}
        </div>
      </div>

      {isAI && !message.isError && (
        <div className="flex-shrink-0 self-start mt-8">
          <button 
            onClick={handleCopy}
            className="text-gray-500 hover:text-gray-300 p-1.5 rounded-md hover:bg-white/5 transition-colors"
            title="Copy response"
          >
            {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
