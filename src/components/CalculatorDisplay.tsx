import React from 'react';
import { AngleMode } from '../types/calculator';
import { History, SlidersHorizontal, AlertCircle } from 'lucide-react';

interface CalculatorDisplayProps {
  expression: string;
  previewResult: string;
  angleMode: AngleMode;
  hasMemory: boolean;
  memoryValue: number;
  errorMessage: string | null;
  onToggleAngleMode: () => void;
  onToggleHistory: () => void;
  onToggleScientific: () => void;
  isScientificExpanded: boolean;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  expression,
  previewResult,
  angleMode,
  hasMemory,
  memoryValue,
  errorMessage,
  onToggleAngleMode,
  onToggleHistory,
  onToggleScientific,
  isScientificExpanded,
}) => {
  return (
    <div className="w-full flex flex-col justify-between p-4 sm:p-5 bg-gradient-to-b from-slate-900/90 to-slate-950 rounded-t-3xl border-b border-slate-800/80 transition-all select-none">
      {/* Top Display Toolbar */}
      <div className="flex items-center justify-between w-full mb-3">
        <div className="flex items-center gap-2">
          {/* DEG / RAD Angle Mode Pill Badge */}
          <button
            onClick={onToggleAngleMode}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/30 active:scale-95 transition-all flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            {angleMode}
          </button>

          {/* Memory Active Indicator */}
          {hasMemory && (
            <span className="px-2 py-0.5 text-[11px] font-mono font-bold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1" title={`Memory: ${memoryValue}`}>
              M ({memoryValue})
            </span>
          )}
        </div>

        {/* Toolbar Utility Icons */}
        <div className="flex items-center gap-1 text-slate-400">
          <button
            onClick={onToggleScientific}
            className={`p-1.5 rounded-lg border transition-all ${
              isScientificExpanded
                ? 'bg-indigo-600/30 border-indigo-500/40 text-indigo-300'
                : 'bg-slate-800/60 border-slate-700/60 hover:text-slate-200'
            }`}
            title="Toggle Scientific Keypad"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleHistory}
            className="p-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 hover:text-slate-200 transition-all"
            title="Calculation History"
          >
            <History className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary Formula Display Area */}
      <div className="min-h-[110px] flex flex-col justify-end text-right overflow-x-auto py-1 space-y-1">
        {/* Expression Text with Caret */}
        <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-none font-calculator text-slate-100 font-light tracking-tight transition-all">
          <span
            className={`${
              expression.length > 25 ? 'text-xl' : expression.length > 15 ? 'text-2xl' : 'text-3xl sm:text-4xl'
            }`}
          >
            {expression || '0'}
          </span>
          <span className="inline-block w-0.5 h-6 ml-0.5 bg-indigo-400 animate-pulse align-middle" />
        </div>

        {/* Real-time Preview Result or Error Message */}
        <div className="min-h-[36px] flex items-center justify-end font-calculator">
          {errorMessage ? (
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 animate-fade-in">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMessage}</span>
            </div>
          ) : previewResult ? (
            <div className="text-xl sm:text-2xl font-bold text-indigo-400 flex items-center gap-1">
              <span className="text-slate-500 text-sm font-normal">=</span>
              <span>{previewResult}</span>
            </div>
          ) : (
            <div className="text-sm text-slate-600 font-mono">0</div>
          )}
        </div>
      </div>
    </div>
  );
};
