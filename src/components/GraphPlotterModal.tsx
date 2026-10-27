import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, ZoomOut, RefreshCw, Sparkles, Check } from 'lucide-react';
import { AngleMode } from '../types/calculator';
import { evaluatorTS } from '../utils/expressionEvaluator';

interface GraphPlotterModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialExpression?: string;
}

export const GraphPlotterModal: React.FC<GraphPlotterModalProps> = ({
  isOpen,
  onClose,
  initialExpression = 'sin(x)',
}) => {
  const [funcExpr, setFuncExpr] = useState<string>(initialExpression.includes('x') ? initialExpression : 'sin(x)');
  const [presetFuncs] = useState<string[]>([
    'sin(x)',
    'cos(x)',
    'x^2 - 4',
    'x^3 - 3*x',
    'exp(-x/2) * cos(3*x)',
    'sqrt(abs(x))',
    'tan(x)',
  ]);

  const [scale, setScale] = useState<number>(30); // pixels per unit
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDragging = useRef<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (!isOpen) return;
    drawGraph();
  }, [isOpen, funcExpr, scale, offsetX, offsetY]);

  const evaluateForX = (expr: string, xVal: number): number | null => {
    try {
      // Replace x or X with value enclosed in parens
      const prepared = expr.replace(/\bx\b/gi, `(${xVal})`);
      const res = evaluatorTS.evaluate(prepared, 'RAD');
      if (res.success && res.value !== undefined && !isNaN(res.value) && isFinite(res.value)) {
        return res.value;
      }
    } catch {
      // Error in expression
    }
    return null;
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2 + offsetX;
    const centerY = height / 2 + offsetY;

    // Grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    const startX = Math.floor((-centerX) / scale);
    const endX = Math.ceil((width - centerX) / scale);
    const startY = Math.floor((-centerY) / scale);
    const endY = Math.ceil((height - centerY) / scale);

    // Minor Grid Lines
    for (let x = startX; x <= endX; x++) {
      const canvasX = centerX + x * scale;
      ctx.beginPath();
      ctx.moveTo(canvasX, 0);
      ctx.lineTo(canvasX, height);
      ctx.stroke();
    }
    for (let y = startY; y <= endY; y++) {
      const canvasY = centerY - y * scale;
      ctx.beginPath();
      ctx.moveTo(0, canvasY);
      ctx.lineTo(width, canvasY);
      ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;

    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Axis Numbers
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';

    for (let x = startX; x <= endX; x++) {
      if (x === 0) continue;
      const canvasX = centerX + x * scale;
      ctx.fillText(x.toString(), canvasX - 6, centerY + 14);
    }
    for (let y = startY; y <= endY; y++) {
      if (y === 0) continue;
      const canvasY = centerY - y * scale;
      ctx.fillText(y.toString(), centerX + 6, canvasY + 4);
    }

    // Plot Function Line
    ctx.strokeStyle = '#6366f1'; // Indigo-500
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    let firstPoint = true;

    for (let px = 0; px <= width; px += 1.5) {
      const xVal = (px - centerX) / scale;
      const yVal = evaluateForX(funcExpr, xVal);

      if (yVal !== null && !isNaN(yVal) && isFinite(yVal)) {
        const py = centerY - yVal * scale;

        // Clip huge vertical jumps
        if (py >= -height * 2 && py <= height * 3) {
          if (firstPoint) {
            ctx.moveTo(px, py);
            firstPoint = false;
          } else {
            ctx.lineTo(px, py);
          }
        } else {
          firstPoint = true;
        }
      } else {
        firstPoint = true;
      }
    }
    ctx.stroke();

    // Draw Hover Marker
    if (hoverCoord) {
      const hoverXVal = (hoverCoord.x - centerX) / scale;
      const hoverYVal = evaluateForX(funcExpr, hoverXVal);

      if (hoverYVal !== null) {
        const py = centerY - hoverYVal * scale;

        // Vertical Guide
        ctx.strokeStyle = '#818cf855';
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(hoverCoord.x, 0);
        ctx.lineTo(hoverCoord.x, height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, py);
        ctx.lineTo(width, py);
        ctx.stroke();
        ctx.setLineDash([]);

        // Point Dot
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.arc(hoverCoord.x, py, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX - offsetX, y: e.clientY - offsetY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setHoverCoord({ x: mouseX, y: mouseY });

    if (isDragging.current) {
      setOffsetX(e.clientX - dragStart.current.x);
      setOffsetY(e.clientY - dragStart.current.y);
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const resetView = () => {
    setScale(30);
    setOffsetX(0);
    setOffsetY(0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl z-10 flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                  f(x)
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100">Interactive Function Plotter</h3>
                  <p className="text-xs text-slate-400">Plot mathematical equations y = f(x)</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Expression Input & Presets */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold text-indigo-400">y =</span>
                <input
                  type="text"
                  value={funcExpr}
                  onChange={(e) => setFuncExpr(e.target.value)}
                  placeholder="e.g. sin(x), x^2 - 4"
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl font-mono text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Preset Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                <span className="text-xs text-slate-500 font-medium shrink-0">Presets:</span>
                {presetFuncs.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setFuncExpr(preset)}
                    className={`px-2.5 py-1 text-xs font-mono rounded-lg border shrink-0 transition-all ${
                      funcExpr === preset
                        ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
                        : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas Plotter Container */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
              <canvas
                ref={canvasRef}
                width={560}
                height={320}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="w-full h-[280px] sm:h-[320px] cursor-grab active:cursor-grabbing block"
              />

              {/* Graph Zoom & Pan Controls Floating */}
              <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-lg backdrop-blur-sm">
                <button
                  onClick={() => setScale((s) => Math.min(s * 1.25, 200))}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setScale((s) => Math.max(s / 1.25, 5))}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={resetView}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  title="Reset Axis"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Coordinates Overlay */}
              {hoverCoord && canvasRef.current && (
                <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-slate-900/90 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 backdrop-blur-sm shadow-md">
                  x: {(((hoverCoord.x - (canvasRef.current.width / 2 + offsetX))) / scale).toFixed(2)}, y: {((-(hoverCoord.y - (canvasRef.current.height / 2 + offsetY))) / scale).toFixed(2)}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
