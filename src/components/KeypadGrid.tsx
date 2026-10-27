import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete, Equal } from 'lucide-react';
import { playKeySound, triggerHaptic } from '../utils/audio';

interface KeypadGridProps {
  onSymbolInput: (symbol: string) => void;
  onFunctionInput: (func: string) => void;
  onClear: () => void;
  onDelete: () => void;
  onEvaluate: () => void;
  onMemoryClear: () => void;
  onMemoryRecall: () => void;
  onMemoryAdd: () => void;
  onMemorySubtract: () => void;
  onMemoryStore: () => void;
  isScientificExpanded: boolean;
  soundEnabled: boolean;
  theme: string;
}

export const KeypadGrid: React.FC<KeypadGridProps> = ({
  onSymbolInput,
  onFunctionInput,
  onClear,
  onDelete,
  onEvaluate,
  onMemoryClear,
  onMemoryRecall,
  onMemoryAdd,
  onMemorySubtract,
  onMemoryStore,
  isScientificExpanded,
  soundEnabled,
  theme,
}) => {

  const handlePress = (
    type: 'number' | 'operator' | 'function' | 'equals' | 'action',
    action: () => void
  ) => {
    playKeySound(type, soundEnabled);
    triggerHaptic();
    action();
  };

  // M3 Theme Colors definition
  const getThemeStyles = () => {
    switch (theme) {
      case 'dynamic-purple':
        return {
          equals: 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30',
          operator: 'bg-purple-950/60 hover:bg-purple-900/60 text-purple-200 border-purple-800/40',
          function: 'bg-slate-800/80 hover:bg-slate-700/80 text-purple-300 border-slate-700/60',
          action: 'bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border-rose-800/40',
          number: 'bg-slate-900/90 hover:bg-slate-800 text-slate-100 border-slate-800/80',
          memory: 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 border-slate-800',
        };
      case 'emerald':
        return {
          equals: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30',
          operator: 'bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-200 border-emerald-800/40',
          function: 'bg-slate-800/80 hover:bg-slate-700/80 text-emerald-300 border-slate-700/60',
          action: 'bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border-rose-800/40',
          number: 'bg-slate-900/90 hover:bg-slate-800 text-slate-100 border-slate-800/80',
          memory: 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 border-slate-800',
        };
      case 'sunset':
        return {
          equals: 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/30',
          operator: 'bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 border-amber-800/40',
          function: 'bg-slate-800/80 hover:bg-slate-700/80 text-amber-300 border-slate-700/60',
          action: 'bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border-rose-800/40',
          number: 'bg-slate-900/90 hover:bg-slate-800 text-slate-100 border-slate-800/80',
          memory: 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 border-slate-800',
        };
      case 'amoled-dark':
        return {
          equals: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30',
          operator: 'bg-zinc-900 hover:bg-zinc-800 text-indigo-300 border-zinc-800',
          function: 'bg-zinc-900 hover:bg-zinc-800 text-slate-300 border-zinc-800',
          action: 'bg-zinc-900 hover:bg-zinc-800 text-rose-400 border-zinc-800',
          number: 'bg-zinc-950 hover:bg-zinc-900 text-slate-100 border-zinc-800/60',
          memory: 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-zinc-800',
        };
      default: // dynamic-blue
        return {
          equals: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30',
          operator: 'bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-200 border-indigo-800/40',
          function: 'bg-slate-800/80 hover:bg-slate-700/80 text-indigo-300 border-slate-700/60',
          action: 'bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border-rose-800/40',
          number: 'bg-slate-900/90 hover:bg-slate-800 text-slate-100 border-slate-800/80',
          memory: 'bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 border-slate-800',
        };
    }
  };

  const styles = getThemeStyles();

  const keyBtnClass = "h-11 sm:h-12 rounded-2xl font-calculator font-medium text-sm sm:text-base flex items-center justify-center border transition-all active:scale-95 shadow-sm select-none";

  return (
    <div className="w-full flex flex-col p-3 sm:p-4 gap-2.5 bg-slate-950 rounded-b-3xl">
      {/* Memory Bar */}
      <div className="grid grid-cols-5 gap-1.5">
        {[
          { label: 'MC', action: onMemoryClear },
          { label: 'MR', action: onMemoryRecall },
          { label: 'M+', action: onMemoryAdd },
          { label: 'M-', action: onMemorySubtract },
          { label: 'MS', action: onMemoryStore },
        ].map((m) => (
          <motion.button
            key={m.label}
            whileTap={{ scale: 0.92 }}
            onClick={() => handlePress('action', m.action)}
            className={`h-8 text-xs font-mono font-semibold rounded-xl border ${styles.memory} transition-colors`}
          >
            {m.label}
          </motion.button>
        ))}
      </div>

      {/* Scientific Keypad Section (Expandable) */}
      <AnimatePresence>
        {isScientificExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden flex flex-col gap-2"
          >
            {/* Scientific Row 1 */}
            <div className="grid grid-cols-5 gap-2">
              <button onClick={() => handlePress('function', () => onFunctionInput('sin'))} className={`${keyBtnClass} ${styles.function}`}>sin</button>
              <button onClick={() => handlePress('function', () => onFunctionInput('cos'))} className={`${keyBtnClass} ${styles.function}`}>cos</button>
              <button onClick={() => handlePress('function', () => onFunctionInput('tan'))} className={`${keyBtnClass} ${styles.function}`}>tan</button>
              <button onClick={() => handlePress('function', () => onFunctionInput('ln'))} className={`${keyBtnClass} ${styles.function}`}>ln</button>
              <button onClick={() => handlePress('function', () => onFunctionInput('log'))} className={`${keyBtnClass} ${styles.function}`}>log</button>
            </div>

            {/* Scientific Row 2 */}
            <div className="grid grid-cols-5 gap-2">
              <button onClick={() => handlePress('function', () => onFunctionInput('√'))} className={`${keyBtnClass} ${styles.function}`}>√</button>
              <button onClick={() => handlePress('function', () => onFunctionInput('xʸ'))} className={`${keyBtnClass} ${styles.function}`}>x^y</button>
              <button onClick={() => handlePress('function', () => onFunctionInput('x²'))} className={`${keyBtnClass} ${styles.function}`}>x²</button>
              <button onClick={() => handlePress('function', () => onSymbolInput('π'))} className={`${keyBtnClass} ${styles.function}`}>π</button>
              <button onClick={() => handlePress('function', () => onSymbolInput('e'))} className={`${keyBtnClass} ${styles.function}`}>e</button>
            </div>

            {/* Scientific Row 3 */}
            <div className="grid grid-cols-5 gap-2">
              <button onClick={() => handlePress('function', () => onSymbolInput('('))} className={`${keyBtnClass} ${styles.function}`}>(</button>
              <button onClick={() => handlePress('function', () => onSymbolInput(')'))} className={`${keyBtnClass} ${styles.function}`}>)</button>
              <button onClick={() => handlePress('function', () => onFunctionInput('x!'))} className={`${keyBtnClass} ${styles.function}`}>n!</button>
              <button onClick={() => handlePress('function', () => onFunctionInput('1/x'))} className={`${keyBtnClass} ${styles.function}`}>1/x</button>
              <button onClick={() => handlePress('function', () => onFunctionInput('|'))} className={`${keyBtnClass} ${styles.function}`}>|x|</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Standard Numeric + Operator Keypad Grid */}
      <div className="flex flex-col gap-2">
        {/* Row 1: Actions + Basic Division */}
        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => handlePress('action', onClear)} className={`${keyBtnClass} ${styles.action} font-bold text-base`}>AC</button>
          <button onClick={() => handlePress('action', onDelete)} className={`${keyBtnClass} ${styles.action} text-rose-300`}>
            <Delete className="w-5 h-5" />
          </button>
          <button onClick={() => handlePress('operator', () => onSymbolInput('%'))} className={`${keyBtnClass} ${styles.operator}`}>%</button>
          <button onClick={() => handlePress('operator', () => onSymbolInput('÷'))} className={`${keyBtnClass} ${styles.operator} text-lg font-bold`}>÷</button>
        </div>

        {/* Row 2: 7, 8, 9, × */}
        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => handlePress('number', () => onSymbolInput('7'))} className={`${keyBtnClass} ${styles.number}`}>7</button>
          <button onClick={() => handlePress('number', () => onSymbolInput('8'))} className={`${keyBtnClass} ${styles.number}`}>8</button>
          <button onClick={() => handlePress('number', () => onSymbolInput('9'))} className={`${keyBtnClass} ${styles.number}`}>9</button>
          <button onClick={() => handlePress('operator', () => onSymbolInput('×'))} className={`${keyBtnClass} ${styles.operator} text-lg font-bold`}>×</button>
        </div>

        {/* Row 3: 4, 5, 6, − */}
        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => handlePress('number', () => onSymbolInput('4'))} className={`${keyBtnClass} ${styles.number}`}>4</button>
          <button onClick={() => handlePress('number', () => onSymbolInput('5'))} className={`${keyBtnClass} ${styles.number}`}>5</button>
          <button onClick={() => handlePress('number', () => onSymbolInput('6'))} className={`${keyBtnClass} ${styles.number}`}>6</button>
          <button onClick={() => handlePress('operator', () => onSymbolInput('−'))} className={`${keyBtnClass} ${styles.operator} text-lg font-bold`}>−</button>
        </div>

        {/* Row 4: 1, 2, 3, + */}
        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => handlePress('number', () => onSymbolInput('1'))} className={`${keyBtnClass} ${styles.number}`}>1</button>
          <button onClick={() => handlePress('number', () => onSymbolInput('2'))} className={`${keyBtnClass} ${styles.number}`}>2</button>
          <button onClick={() => handlePress('number', () => onSymbolInput('3'))} className={`${keyBtnClass} ${styles.number}`}>3</button>
          <button onClick={() => handlePress('operator', () => onSymbolInput('+'))} className={`${keyBtnClass} ${styles.operator} text-lg font-bold`}>+</button>
        </div>

        {/* Row 5: 0, ., = */}
        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => handlePress('number', () => onSymbolInput('0'))} className={`${keyBtnClass} ${styles.number} col-span-2`}>0</button>
          <button onClick={() => handlePress('number', () => onSymbolInput('.'))} className={`${keyBtnClass} ${styles.number} font-bold`}>.</button>
          <button onClick={() => handlePress('equals', onEvaluate)} className={`${keyBtnClass} ${styles.equals} font-bold`}>
            <Equal className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
