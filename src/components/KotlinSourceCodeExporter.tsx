import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, Download, Code, FileText, CheckCircle2 } from 'lucide-react';
import { CodeFile } from '../types/calculator';

interface KotlinSourceCodeExporterProps {
  isOpen: boolean;
  onClose: () => void;
  files: CodeFile[];
}

export const KotlinSourceCodeExporter: React.FC<KotlinSourceCodeExporterProps> = ({
  isOpen,
  onClose,
  files,
}) => {
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentFile = files[activeFileIndex] || files[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([currentFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
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
          className="relative w-full max-w-5xl h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl z-10 flex flex-col gap-4 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  Android Kotlin & Jetpack Compose Source Code
                  <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">
                    Compilation Ready
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  {files.length} production source files built for Android Studio & Material 3
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body: Left File Explorer Sidebar + Right Code Viewer */}
          <div className="flex-1 flex flex-col md:flex-row gap-4 min-h-0 overflow-hidden">
            {/* File List Explorer */}
            <div className="w-full md:w-64 bg-slate-950 border border-slate-800/80 rounded-2xl p-2 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-y-auto shrink-0 scrollbar-thin">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 hidden md:block">
                Kotlin Files
              </div>
              {files.map((file, idx) => (
                <button
                  key={file.name}
                  onClick={() => setActiveFileIndex(idx)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 shrink-0 ${
                    activeFileIndex === idx
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="truncate">{file.name}</span>
                </button>
              ))}
            </div>

            {/* Code Content Viewer */}
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col overflow-hidden min-h-0">
              {/* File Action Top Bar */}
              <div className="px-4 py-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-xs font-mono text-slate-400 font-semibold truncate">
                    {currentFile.path}
                  </span>
                  <span className="hidden sm:inline-block text-[11px] text-slate-500 font-sans">
                    — {currentFile.description}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md transition-all"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadFile}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
                    title="Download File"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Code View Canvas */}
              <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-200 leading-relaxed scrollbar-thin selection:bg-indigo-500/30">
                <pre>
                  <code>{currentFile.content}</code>
                </pre>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
