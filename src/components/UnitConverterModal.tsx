import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeftRight } from 'lucide-react';
import { UnitCategory } from '../types/calculator';

interface UnitConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UnitConverterModal: React.FC<UnitConverterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const categories: UnitCategory[] = [
    {
      name: 'Length',
      icon: '📏',
      units: [
        { name: 'Meters', symbol: 'm', toBase: (v) => v, fromBase: (v) => v },
        { name: 'Kilometers', symbol: 'km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
        { name: 'Centimeters', symbol: 'cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
        { name: 'Millimeters', symbol: 'mm', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
        { name: 'Inches', symbol: 'in', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
        { name: 'Feet', symbol: 'ft', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
        { name: 'Miles', symbol: 'mi', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
      ],
    },
    {
      name: 'Weight / Mass',
      icon: '⚖️',
      units: [
        { name: 'Kilograms', symbol: 'kg', toBase: (v) => v, fromBase: (v) => v },
        { name: 'Grams', symbol: 'g', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
        { name: 'Milligrams', symbol: 'mg', toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
        { name: 'Pounds', symbol: 'lbs', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
        { name: 'Ounces', symbol: 'oz', toBase: (v) => v * 0.028349523, fromBase: (v) => v / 0.028349523 },
      ],
    },
    {
      name: 'Temperature',
      icon: '🌡️',
      units: [
        { name: 'Celsius', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
        { name: 'Fahrenheit', symbol: '°F', toBase: (v) => (v - 32) * (5 / 9), fromBase: (v) => v * (9 / 5) + 32 },
        { name: 'Kelvin', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
      ],
    },
    {
      name: 'Volume',
      icon: '🧪',
      units: [
        { name: 'Liters', symbol: 'L', toBase: (v) => v, fromBase: (v) => v },
        { name: 'Milliliters', symbol: 'mL', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
        { name: 'Gallons (US)', symbol: 'gal', toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
        { name: 'Fluid Ounces', symbol: 'fl oz', toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
      ],
    },
    {
      name: 'Speed',
      icon: '⚡',
      units: [
        { name: 'Meters / second', symbol: 'm/s', toBase: (v) => v, fromBase: (v) => v },
        { name: 'Kilometers / hour', symbol: 'km/h', toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
        { name: 'Miles / hour', symbol: 'mph', toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
        { name: 'Knots', symbol: 'kn', toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
      ],
    },
  ];

  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnitIndex, setFromUnitIndex] = useState<number>(0);
  const [toUnitIndex, setToUnitIndex] = useState<number>(1);

  const cat = categories[activeCategory];
  const fromUnit = cat.units[fromUnitIndex] || cat.units[0];
  const toUnit = cat.units[toUnitIndex] || cat.units[1] || cat.units[0];

  const numVal = parseFloat(inputValue) || 0;
  const baseValue = fromUnit.toBase(numVal);
  const convertedValue = toUnit.fromBase(baseValue);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
            className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl z-10 flex flex-col gap-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-100">Scientific Unit Converter</h3>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((c, idx) => (
                <button
                  key={c.name}
                  onClick={() => {
                    setActiveCategory(idx);
                    setFromUnitIndex(0);
                    setToUnitIndex(1);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-xl border shrink-0 transition-all flex items-center gap-1.5 ${
                    activeCategory === idx
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                      : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200'
                  }`}
                >
                  <span>{c.icon}</span>
                  <span>{c.name}</span>
                </button>
              ))}
            </div>

            {/* Conversion Form */}
            <div className="flex flex-col gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
              {/* FROM */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">From</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl font-mono text-base text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                  <select
                    value={fromUnitIndex}
                    onChange={(e) => setFromUnitIndex(Number(e.target.value))}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-medium text-slate-200 focus:outline-none"
                  >
                    {cat.units.map((u, i) => (
                      <option key={u.name} value={i}>
                        {u.name} ({u.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* TO */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-slate-400 font-medium">To</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-xl font-mono text-lg font-bold text-cyan-400 truncate">
                    {isNaN(convertedValue) ? '0' : convertedValue.toFixed(6).replace(/\.?0+$/, '')}
                  </div>
                  <select
                    value={toUnitIndex}
                    onChange={(e) => setToUnitIndex(Number(e.target.value))}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm font-medium text-slate-200 focus:outline-none"
                  >
                    {cat.units.map((u, i) => (
                      <option key={u.name} value={i}>
                        {u.name} ({u.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
