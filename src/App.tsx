import React, { useState, useEffect } from 'react';
import { AndroidDeviceFrame } from './components/AndroidDeviceFrame';
import { CalculatorDisplay } from './components/CalculatorDisplay';
import { KeypadGrid } from './components/KeypadGrid';
import { HistoryBottomSheet } from './components/HistoryBottomSheet';
import { GraphPlotterModal } from './components/GraphPlotterModal';
import { UnitConverterModal } from './components/UnitConverterModal';
import { KotlinSourceCodeExporter } from './components/KotlinSourceCodeExporter';
import { AngleMode, CalculationHistoryItem, M3ThemeMode } from './types/calculator';
import { evaluatorTS } from './utils/expressionEvaluator';
import { kotlinSourceFiles } from './data/kotlinSourceCode';

export default function App() {
  const [expression, setExpression] = useState<string>('');
  const [liveResult, setLiveResult] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [isScientificExpanded, setIsScientificExpanded] = useState<boolean>(true);
  const [isHistoryVisible, setIsHistoryVisible] = useState<boolean>(false);
  const [history, setHistory] = useState<CalculationHistoryItem[]>([]);
  const [memory, setMemory] = useState<number>(0);
  const [hasMemory, setHasMemory] = useState<boolean>(false);

  // App & Device Settings State
  const [isDeviceMode, setIsDeviceMode] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [theme, setTheme] = useState<M3ThemeMode>('dynamic-blue');

  // Modals State
  const [isGraphPlotterOpen, setIsGraphPlotterOpen] = useState<boolean>(false);
  const [isUnitConverterOpen, setIsUnitConverterOpen] = useState<boolean>(false);
  const [isCodeExportOpen, setIsCodeExportOpen] = useState<boolean>(false);

  // Calculate live real-time preview result as expression changes
  useEffect(() => {
    if (!expression.trim()) {
      setLiveResult('');
      setErrorMessage(null);
      return;
    }

    const res = evaluatorTS.evaluate(expression, angleMode);
    if (res.success && res.formatted !== undefined) {
      setLiveResult(res.formatted);
      setErrorMessage(null);
    } else {
      setLiveResult('');
      // Only set error message if expression looks ended/invalid e.g. divide by zero
      if (res.error && (res.error.includes('zero') || res.error.includes('domain'))) {
        setErrorMessage(res.error);
      } else {
        setErrorMessage(null);
      }
    }
  }, [expression, angleMode]);

  // Key Handlers
  const handleSymbolInput = (symbol: string) => {
    setExpression((prev) => prev + symbol);
    setErrorMessage(null);
  };

  const handleFunctionInput = (funcName: string) => {
    let appendStr = `${funcName}(`;
    if (funcName === 'x²') appendStr = '^2';
    if (funcName === 'xʸ') appendStr = '^';
    if (funcName === '√') appendStr = '√(';
    if (funcName === '1/x') appendStr = '1/(';
    if (funcName === 'x!') appendStr = '!';
    if (funcName === '|') appendStr = 'abs(';

    setExpression((prev) => prev + appendStr);
    setErrorMessage(null);
  };

  const handleClear = () => {
    setExpression('');
    setLiveResult('');
    setErrorMessage(null);
  };

  const handleDelete = () => {
    setExpression((prev) => (prev.length > 0 ? prev.slice(0, -1) : ''));
  };

  const handleEvaluate = () => {
    if (!expression.trim()) return;

    const res = evaluatorTS.evaluate(expression, angleMode);
    if (res.success && res.formatted !== undefined) {
      const newHistoryItem: CalculationHistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        expression,
        result: res.formatted,
        timestamp: new Date(),
        angleMode,
      };

      setHistory((prev) => [newHistoryItem, ...prev]);
      setExpression(res.formatted);
      setLiveResult('');
      setErrorMessage(null);
    } else {
      setErrorMessage(res.error || 'Syntax Error');
      setLiveResult('');
    }
  };

  const handleToggleAngleMode = () => {
    setAngleMode((prev) => (prev === 'DEG' ? 'RAD' : 'DEG'));
  };

  // Memory Functions
  const handleMemoryClear = () => {
    setMemory(0);
    setHasMemory(false);
  };

  const handleMemoryRecall = () => {
    if (!hasMemory) return;
    setExpression((prev) => prev + memory.toString());
  };

  const handleMemoryAdd = () => {
    const res = evaluatorTS.evaluate(expression, angleMode);
    if (res.success && res.value !== undefined) {
      setMemory((prev) => prev + res.value!);
      setHasMemory(true);
    }
  };

  const handleMemorySubtract = () => {
    const res = evaluatorTS.evaluate(expression, angleMode);
    if (res.success && res.value !== undefined) {
      setMemory((prev) => prev - res.value!);
      setHasMemory(true);
    }
  };

  const handleMemoryStore = () => {
    const res = evaluatorTS.evaluate(expression, angleMode);
    if (res.success && res.value !== undefined) {
      setMemory(res.value);
      setHasMemory(true);
    }
  };

  const handleSelectHistoryItem = (item: CalculationHistoryItem, loadAsExpression: boolean) => {
    setExpression(loadAsExpression ? item.expression : item.result);
    setIsHistoryVisible(false);
  };

  return (
    <AndroidDeviceFrame
      isDeviceMode={isDeviceMode}
      onToggleDeviceMode={() => setIsDeviceMode((prev) => !prev)}
      onOpenCodeExport={() => setIsCodeExportOpen(true)}
      onOpenGraphPlotter={() => setIsGraphPlotterOpen(true)}
      onOpenUnitConverter={() => setIsUnitConverterOpen(true)}
      soundEnabled={soundEnabled}
      onToggleSound={() => setSoundEnabled((prev) => !prev)}
      currentTheme={theme}
      onThemeChange={(newTheme) => setTheme(newTheme)}
    >
      <div className="w-full h-full flex flex-col justify-between overflow-hidden">
        {/* Main Calculator Display */}
        <CalculatorDisplay
          expression={expression}
          previewResult={liveResult}
          angleMode={angleMode}
          hasMemory={hasMemory}
          memoryValue={memory}
          errorMessage={errorMessage}
          onToggleAngleMode={handleToggleAngleMode}
          onToggleHistory={() => setIsHistoryVisible(true)}
          onToggleScientific={() => setIsScientificExpanded((prev) => !prev)}
          isScientificExpanded={isScientificExpanded}
        />

        {/* Keypad Grid */}
        <KeypadGrid
          onSymbolInput={handleSymbolInput}
          onFunctionInput={handleFunctionInput}
          onClear={handleClear}
          onDelete={handleDelete}
          onEvaluate={handleEvaluate}
          onMemoryClear={handleMemoryClear}
          onMemoryRecall={handleMemoryRecall}
          onMemoryAdd={handleMemoryAdd}
          onMemorySubtract={handleMemorySubtract}
          onMemoryStore={handleMemoryStore}
          isScientificExpanded={isScientificExpanded}
          soundEnabled={soundEnabled}
          theme={theme}
        />
      </div>

      {/* History Bottom Sheet Drawer */}
      <HistoryBottomSheet
        isOpen={isHistoryVisible}
        history={history}
        onSelectHistoryItem={handleSelectHistoryItem}
        onClearHistory={() => setHistory([])}
        onClose={() => setIsHistoryVisible(false)}
      />

      {/* Interactive 2D Function Plotter Modal */}
      <GraphPlotterModal
        isOpen={isGraphPlotterOpen}
        onClose={() => setIsGraphPlotterOpen(false)}
        initialExpression={expression || 'sin(x)'}
      />

      {/* Scientific Unit Converter Modal */}
      <UnitConverterModal
        isOpen={isUnitConverterOpen}
        onClose={() => setIsUnitConverterOpen(false)}
      />

      {/* Kotlin Source Code Exporter Modal */}
      <KotlinSourceCodeExporter
        isOpen={isCodeExportOpen}
        onClose={() => setIsCodeExportOpen(false)}
        files={kotlinSourceFiles}
      />
    </AndroidDeviceFrame>
  );
}
