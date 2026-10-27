import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CalculationHistoryItem } from '../types/calculator';
import { Trash2, X, ArrowUpRight, Copy, Check } from 'lucide-react';

interface HistoryBottomSheetProps {
  isOpen: boolean;
  history: CalculationHistoryItem[];
  onSelectHistoryItem: (item: CalculationHistoryItem, loadAsExpression: boolean) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

export const HistoryBottomSheet: React.FC<HistoryBottomSheetProps> = ({
  isOpen,
  history,
  onSelectHistoryItem,
  onClearHistory,
  onClose,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Bottom Sheet Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-md bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl z-10 max-h-[80vh] flex flex-col"
          >
            {/* Grab Handle */}
            <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-4 shrink-0" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">Calculation History</h2>
                <span className="px-2 py-0.5 text-xs font-mono font-medium bg-slate-800 text-slate-400 rounded-full">
                  {history.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {history.length > 0 && (
                  <button
                    onClick={onClearHistory}
                    className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 font-calculator scrollbar-thin">
              {history.length === 0 ? (
                <div className="py-12 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800/80 flex items-center justify-center text-slate-600">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-sans font-medium">No calculation history yet</p>
                  <p className="text-xs text-slate-600 font-sans">
                    Perform calculations to save them here for quick reload
                  </p>
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onSelectHistoryItem(item, true)}
                    className="group relative bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800/80 hover:border-indigo-500/40 rounded-2xl p-3.5 transition-all cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 font-sans mb-1.5">
                      <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      <span className="px-1.5 py-0.2 text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">
                        {item.angleMode}
                      </span>
                    </div>

                    {/* Expression */}
                    <div className="text-right text-slate-300 text-sm tracking-tight mb-1 truncate">
                      {item.expression}
                    </div>

                    {/* Result */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectHistoryItem(item, false);
                          }}
                          className="px-2 py-1 text-[11px] font-sans font-medium bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 rounded-lg hover:bg-indigo-600/30 flex items-center gap-1 transition-all"
                          title="Load result as input"
                        >
                          <ArrowUpRight className="w-3 h-3" />
                          <span>Use Result</span>
                        </button>

                        <button
                          onClick={(e) => handleCopy(item.id, item.result, e)}
                          className="p-1 text-slate-400 hover:text-slate-200 bg-slate-800 rounded-lg transition-colors"
                          title="Copy result"
                        >
                          {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="text-right text-indigo-400 font-bold text-lg">
                        = {item.result}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
