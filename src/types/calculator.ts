export type AngleMode = 'DEG' | 'RAD';

export type M3ThemeMode = 'dynamic-blue' | 'dynamic-purple' | 'emerald' | 'sunset' | 'amoled-dark';

export interface CalculationHistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
  angleMode: AngleMode;
}

export interface UnitCategory {
  name: string;
  icon: string;
  units: { name: string; symbol: string; toBase: (val: number) => number; fromBase: (val: number) => number }[];
}

export interface CodeFile {
  name: string;
  path: string;
  language: string;
  description: string;
  content: string;
}
