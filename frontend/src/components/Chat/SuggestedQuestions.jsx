import { motion } from 'framer-motion';

const suggestions = [
  "How is our pipeline this quarter?",
  "Which projects are delayed?",
  "Show sector performance.",
  "Generate leadership update.",
  "Which deals are high risk?",
  "Revenue summary."
];

const SuggestedQuestions = ({ onSelect }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto w-full mt-10"
    >
      <h3 className="text-slate-500 text-sm font-bold mb-4 text-center">Suggested Questions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {suggestions.map((question, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(question)}
            className="bg-white border border-border-subtle hover:border-primary/40 hover:shadow-md transition-all text-left p-4 rounded-xl text-[14px] text-slate-700 font-medium shadow-sm"
          >
            {question}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default SuggestedQuestions;
