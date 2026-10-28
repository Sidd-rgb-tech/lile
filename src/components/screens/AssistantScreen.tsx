import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  PlusCircle,
  HelpCircle,
  BookOpen,
  ListTodo,
  BrainCircuit,
  AlertCircle
} from 'lucide-react';
import { AssistantMode, ChatMessage, Challenge } from '../../types';

interface AssistantScreenProps {
  onAddCustomChallenge: (challenge: Partial<Challenge>) => void;
}

export const AssistantScreen: React.FC<AssistantScreenProps> = ({
  onAddCustomChallenge
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: `Hello! I am your CHANGE360 Awareness Assistant.
I can explain social causes simply, provide detailed breakdowns, build step-by-step practical action plans, or quiz your knowledge across our 20 awareness areas.

What topic would you like to explore today?`,
      isUser: false,
      timestamp: Date.now(),
      mode: 'explain_simply'
    }
  ]);

  const [input, setInput] = useState('');
  const [mode, setMode] = useState<AssistantMode>('explain_simply');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [addedActionId, setAddedActionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'How can I reduce plastic waste at school?',
    'How can I identify online scams & phishing?',
    'What are practical steps to promote road safety?',
    'How can I support someone facing cyberbullying?',
    'What simple daily habits boost mental well-being?',
    'How can our youth group organize a community cleanup?'
  ];

  const modeDescriptions: Record<AssistantMode, { title: string; icon: any; color: string }> = {
    explain_simply: { title: 'Explain Simply', icon: BookOpen, color: 'text-teal-700 bg-teal-50' },
    detailed_explanation: { title: 'Detailed', icon: BrainCircuit, color: 'text-sky-700 bg-sky-50' },
    action_guide: { title: 'Action Guide', icon: ListTodo, color: 'text-emerald-700 bg-emerald-50' },
    quiz_me: { title: 'Quiz Me', icon: HelpCircle, color: 'text-amber-700 bg-amber-50' }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: query,
      isUser: true,
      timestamp: Date.now(),
      mode
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          mode,
          category: 'Social Awareness'
        })
      });

      if (!response.ok) {
        throw new Error('Server request failed');
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        text: data.reply,
        isUser: false,
        timestamp: Date.now(),
        isDemoNotice: !data.isLiveAi,
        model: data.model,
        mode: data.mode
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        text: 'I encountered an error connecting to the awareness service. Please check your network or try again.',
        isUser: false,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateActionPlan = (msg: ChatMessage) => {
    onAddCustomChallenge({
      title: `Plan from AI Assistant: ${msg.mode?.replace('_', ' ')}`,
      category: 'Education & Literacy',
      difficulty: 'MEDIUM',
      estimatedDurationMinutes: 20,
      shortDescription: 'Custom action plan generated from CHANGE360 AI Assistant guidance.',
      learningObjective: 'Apply conversational insights into a verifiable daily community action.',
      instructions: msg.text.substring(0, 300) + '...',
      expectedOutcome: 'Completed planned action steps.',
      points: 40,
      status: 'NOT_STARTED',
      proofTier: 'SELF_REPORTED_ACTION',
      isPointsAwarded: false
    });
    setAddedActionId(msg.id);
    setTimeout(() => setAddedActionId(null), 3000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] text-slate-800 overflow-hidden">
      {/* Mode Selector Strip */}
      <div className="px-3 py-2 bg-white border-b border-slate-200/90 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0 shadow-2xs">
        {(Object.keys(modeDescriptions) as AssistantMode[]).map(key => {
          const item = modeDescriptions[key];
          const Icon = item.icon;
          const isSelected = mode === key;

          return (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition active:scale-95 ${
                isSelected
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.title}</span>
            </button>
          );
        })}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none pb-20">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed transition ${
                msg.isUser
                  ? 'bg-teal-600 text-white rounded-br-xs shadow-xs'
                  : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-xs'
              }`}
            >
              {!msg.isUser && (
                <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-100 text-[10px] text-teal-700 font-bold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-teal-600" />
                    <span>CHANGE360 Assistant</span>
                  </span>
                  {msg.isDemoNotice && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      Demo Mode
                    </span>
                  )}
                </div>
              )}

              <div className="whitespace-pre-wrap font-normal leading-relaxed">
                {msg.text}
              </div>

              {!msg.isUser && msg.id !== 'welcome' && (
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100 justify-end">
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] text-slate-600 hover:text-slate-900 transition font-medium"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleCreateActionPlan(msg)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 border border-teal-200 text-[10px] text-teal-800 font-bold transition"
                    title="Convert to actionable challenge"
                  >
                    {addedActionId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-teal-700" />
                        <span>Added to Challenges!</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-3 h-3 text-teal-700" />
                        <span>Create Action Plan</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start">
            <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs p-3 text-xs flex items-center gap-2 text-teal-700 shadow-xs">
              <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
              <span className="font-medium">Analyzing social awareness knowledge base...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions Chips */}
      <div className="px-3 py-1.5 bg-white border-t border-slate-200/90 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider shrink-0 mr-1">
          Try:
        </span>
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium transition active:scale-95 whitespace-nowrap"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Bottom Input Field */}
      <div className="p-3 bg-white border-t border-slate-200/90 flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
          placeholder={`Ask about causes in ${modeDescriptions[mode].title} mode...`}
          className="flex-1 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none transition"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!input.trim() || isLoading}
          className="w-9 h-9 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white flex items-center justify-center shrink-0 shadow-xs transition active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
