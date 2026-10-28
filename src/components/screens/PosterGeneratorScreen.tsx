import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  Share2,
  Sparkles,
  Palette,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sliders,
  Type,
  Flame,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AwarenessCategory, UserProfile, ImpactRecord, PosterConfig, PosterTemplateType } from '../../types';
import { ALL_CATEGORIES } from '../../data/mockData';

interface PosterGeneratorScreenProps {
  userProfile: UserProfile;
  impactRecords: ImpactRecord[];
  onAwardPosterPoints: () => void;
}

interface StyleOption {
  id: PosterTemplateType;
  label: string;
  badge: string;
  bgColors: [string, string];
  accent: string;
}

const TEMPLATE_STYLES: StyleOption[] = [
  { id: 'vibrant_eco', label: 'Vibrant Eco', badge: 'Mint & Emerald', bgColors: ['#E8FDF3', '#C8F7DC'], accent: '#00E676' },
  { id: 'bold_neon', label: 'Bold Neon', badge: 'Electric Cyber', bgColors: ['#0F172A', '#1E1B4B'], accent: '#FF5A5F' },
  { id: 'clean_minimal', label: 'Clean Minimal', badge: 'Airy Pastel', bgColors: ['#F8FAFC', '#F1F5F9'], accent: '#00897B' },
  { id: 'infographic', label: 'Infographic', badge: 'Data & Stats', bgColors: ['#EBF4FF', '#D0E7FF'], accent: '#00B0FF' },
  { id: 'community', label: 'Community', badge: 'Warm Coral', bgColors: ['#FFF7ED', '#FED7AA'], accent: '#FF5A5F' },
  { id: 'health', label: 'Health Vibe', badge: 'Cyan & Mint', bgColors: ['#ECFEFF', '#CFFAFE'], accent: '#0288D1' },
  { id: 'school', label: 'School Campaign', badge: 'Lilac & Coral', bgColors: ['#F5F3FF', '#DDD6FE'], accent: '#7C3AED' },
  { id: 'personal_summary', label: 'Impact Recap', badge: 'Personal Stats', bgColors: ['#F0FDF4', '#DCFCE7'], accent: '#10B981' },
];

export const PosterGeneratorScreen: React.FC<PosterGeneratorScreenProps> = ({
  userProfile,
  impactRecords,
  onAwardPosterPoints
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [posterConfig, setPosterConfig] = useState<PosterConfig>({
    type: 'custom',
    category: 'Waste Management & Recycling',
    template: 'vibrant_eco',
    headline: 'Small Swaps, Big Impact',
    subheadline: 'Every reusable choice keeps our streets and waterways free of plastic waste.',
    callToAction: 'Choose Reusable Today',
    bullets: [
      'Carry your own water bottle and canvas tote',
      'Decline single-use plastic cutlery and wrappers',
      'Sort recyclables responsibly at school and home'
    ],
    authorOrOrgName: userProfile.displayName || 'CHANGE360 Changemaker',
    includeImpactStats: true,
    hashtag: '#Change360Action'
  });

  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Calculate actual user impact statistics for this category
  const categoryRecords = impactRecords.filter(r => r.category === posterConfig.category);
  const verifiedCount = categoryRecords.filter(r => r.proofTier === 'VERIFIED_ACTIVITY' || r.proofTier === 'MEASURED_OUTCOME').length;
  const selfReportedCount = categoryRecords.filter(r => r.proofTier === 'SELF_REPORTED_ACTION').length;

  // Render canvas whenever config changes
  useEffect(() => {
    renderCanvas();
  }, [posterConfig, verifiedCount, selfReportedCount]);

  const drawMultilineText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ): number => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
    return currentY + lineHeight;
  };

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1080;
    const height = 1350;
    canvas.width = width;
    canvas.height = height;

    const styleInfo = TEMPLATE_STYLES.find(s => s.id === posterConfig.template) || TEMPLATE_STYLES[0];
    const isDark = posterConfig.template === 'bold_neon';

    const bgColors = styleInfo.bgColors;
    const innerCardBg = isDark ? '#1E293B' : '#FFFFFF';
    const textColorPrimary = isDark ? '#FFFFFF' : '#0F172A';
    const textColorSecondary = isDark ? '#94A3B8' : '#475569';
    const cardBorderColor = isDark ? '#334155' : '#E2E8F0';

    // 1. Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, bgColors[0]);
    gradient.addColorStop(1, bgColors[1]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative geometric accents
    ctx.fillStyle = styleInfo.accent;
    ctx.globalAlpha = isDark ? 0.2 : 0.15;
    ctx.beginPath();
    ctx.arc(980, 160, 240, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(120, 1220, 200, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // 2. Inner Rounded Card Container
    const cardX = 60;
    const cardY = 80;
    const cardW = width - 120;
    const cardH = height - 150;
    const cardRadius = 36;

    ctx.save();
    ctx.fillStyle = innerCardBg;
    ctx.shadowColor = isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.08)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 16;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, cardRadius);
    ctx.fill();
    ctx.restore();

    // Card border
    ctx.strokeStyle = cardBorderColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, cardRadius);
    ctx.stroke();

    // 3. Category Chip Badge
    const badgeY = cardY + 50;
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    const catText = posterConfig.category.toUpperCase();
    const catMetrics = ctx.measureText(catText);
    const badgeW = catMetrics.width + 48;
    const badgeH = 46;

    ctx.fillStyle = isDark ? '#334155' : '#F1F5F9';
    ctx.beginPath();
    ctx.roundRect(cardX + 44, badgeY, badgeW, badgeH, 23);
    ctx.fill();

    ctx.fillStyle = styleInfo.accent;
    ctx.beginPath();
    ctx.arc(cardX + 66, badgeY + 23, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = isDark ? '#F8FAFC' : '#0F172A';
    ctx.fillText(catText, cardX + 82, badgeY + 31);

    // 4. Headline
    ctx.font = '900 60px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = textColorPrimary;
    let textY = badgeY + 115;
    textY = drawMultilineText(ctx, posterConfig.headline, cardX + 44, textY, cardW - 88, 72);

    // 5. Subheadline
    ctx.font = '500 28px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = textColorSecondary;
    textY += 10;
    textY = drawMultilineText(ctx, posterConfig.subheadline, cardX + 44, textY, cardW - 88, 38);

    // Divider line
    textY += 24;
    ctx.strokeStyle = isDark ? '#334155' : '#F1F5F9';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cardX + 44, textY);
    ctx.lineTo(cardX + cardW - 44, textY);
    ctx.stroke();

    // 6. Action Checklist Bullets
    textY += 50;
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = styleInfo.accent;
    ctx.fillText('RECOMMENDED ACTIONS & HABITS', cardX + 44, textY);

    textY += 40;
    posterConfig.bullets.forEach((bullet, index) => {
      // Bullet icon circle
      ctx.fillStyle = isDark ? '#334155' : '#E2E8F0';
      ctx.beginPath();
      ctx.arc(cardX + 64, textY - 8, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = styleInfo.accent;
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${index + 1}`, cardX + 64, textY - 2);
      ctx.textAlign = 'left';

      // Bullet text
      ctx.font = '600 24px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = textColorPrimary;
      textY = drawMultilineText(ctx, bullet, cardX + 96, textY - 2, cardW - 140, 34);
      textY += 18;
    });

    // 7. Verified Proof of Impact Banner
    if (posterConfig.includeImpactStats) {
      const bannerY = cardY + cardH - 240;
      const bannerH = 80;
      ctx.fillStyle = isDark ? '#0F172A' : '#F8FAFC';
      ctx.beginPath();
      ctx.roundRect(cardX + 44, bannerY, cardW - 88, bannerH, 20);
      ctx.fill();

      ctx.strokeStyle = isDark ? '#334155' : '#E2E8F0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cardX + 44, bannerY, cardW - 88, bannerH, 20);
      ctx.stroke();

      ctx.font = 'bold 20px system-ui, sans-serif';
      ctx.fillStyle = styleInfo.accent;
      ctx.fillText('VERIFIED PROOF OF IMPACT', cardX + 68, bannerY + 34);

      ctx.font = '500 18px system-ui, sans-serif';
      ctx.fillStyle = textColorSecondary;
      ctx.fillText(
        `${verifiedCount} Verified Activities • ${selfReportedCount} Self-Reported Actions • 0 Fabricated Claims`,
        cardX + 68,
        bannerY + 62
      );
    }

    // 8. Call to Action Banner
    const ctaY = cardY + cardH - 135;
    const ctaH = 68;
    ctx.fillStyle = styleInfo.accent;
    ctx.beginPath();
    ctx.roundRect(cardX + 44, ctaY, cardW - 88, ctaH, 20);
    ctx.fill();

    ctx.font = '900 26px system-ui, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(posterConfig.callToAction.toUpperCase(), width / 2, ctaY + 44);
    ctx.textAlign = 'left';

    // 9. Footer Branding
    const footerY = cardY + cardH + 34;
    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.fillStyle = isDark ? '#94A3B8' : '#64748B';
    ctx.fillText(`CHANGE360 • Created by ${posterConfig.authorOrOrgName}`, cardX, footerY);

    ctx.textAlign = 'right';
    ctx.fillText(posterConfig.hashtag, width - cardX, footerY);
    ctx.textAlign = 'left';
  };

  // Generate with AI
  const handleGenerateAiCopy = async () => {
    setIsGeneratingAi(true);
    try {
      const response = await fetch('/api/ai-poster-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: posterConfig.category,
          posterType: posterConfig.type,
          audience: 'Youth, School & Community Changemakers',
          tone: 'Inspiring, positive, verifiable and action-oriented'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setPosterConfig(prev => ({
          ...prev,
          headline: data.headline || prev.headline,
          subheadline: data.subheadline || prev.subheadline,
          callToAction: data.callToAction || prev.callToAction,
          bullets: data.actionBullets?.length ? data.actionBullets : prev.bullets,
          hashtag: data.hashtag || prev.hashtag
        }));
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Failed to generate AI poster copy:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Download high-res PNG image
  const handleDownloadPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const imageUri = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `Change360_${posterConfig.category.replace(/[^a-zA-Z0-9]/g, '_')}_Poster.png`;
      link.href = imageUri;
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);

      // Award points and badges
      onAwardPosterPoints();
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Error exporting poster PNG:', err);
    }
  };

  // Share Poster
  const handleSharePoster = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async blob => {
        if (!blob) return;
        const file = new File([blob], 'change360-poster.png', { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `CHANGE360: ${posterConfig.headline}`,
            text: `${posterConfig.subheadline} - ${posterConfig.hashtag}`,
            files: [file]
          });
        } else {
          handleDownloadPoster();
        }
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      });
    } catch (err) {
      handleDownloadPoster();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] text-slate-800 overflow-hidden">
      {/* Scrollable Content Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none pb-24">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              AI Impact Poster Studio
            </h2>
            <p className="text-[11px] text-teal-700 font-bold">
              8 High-Vibrancy Styles • Verifiable Proof • 1080x1350 HD
            </p>
          </div>
          <button
            onClick={handleGenerateAiCopy}
            disabled={isGeneratingAi}
            className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-teal-600 to-rose-500 hover:from-teal-500 hover:to-rose-400 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>{isGeneratingAi ? 'Writing...' : 'AI Slogan'}</span>
          </button>
        </div>

        {/* Live Canvas Preview Frame */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-3 shadow-xs flex flex-col items-center">
          <div className="w-full max-w-[280px] aspect-[4/5] rounded-xl overflow-hidden shadow-md border border-slate-200">
            <canvas ref={canvasRef} className="w-full h-full object-contain" />
          </div>

          {/* Action Export Buttons */}
          <div className="w-full grid grid-cols-2 gap-2 mt-3">
            <button
              onClick={handleDownloadPoster}
              className="py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadSuccess ? 'Downloaded!' : 'Save PNG (HD)'}</span>
            </button>

            <button
              onClick={handleSharePoster}
              className="py-2.5 px-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{shareSuccess ? 'Shared!' : 'Share / FileProvider'}</span>
            </button>
          </div>
        </div>

        {/* 8 Visual Style Selection Chips */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-2.5">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-teal-600" />
            Choose 1 of 8 Visual Styles
          </label>
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATE_STYLES.map(style => {
              const isSelected = posterConfig.template === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => setPosterConfig(prev => ({ ...prev, template: style.id }))}
                  className={`p-2.5 rounded-xl border text-left transition active:scale-95 ${
                    isSelected
                      ? 'bg-teal-50 border-teal-500 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{style.label}</span>
                    <span
                      className="w-3 h-3 rounded-full border border-white shrink-0"
                      style={{ backgroundColor: style.accent }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{style.badge}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Customize Content Editor */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
          <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-teal-600" />
            Poster Text & Category
          </label>

          {/* Category Select */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              Social Awareness Category:
            </label>
            <select
              value={posterConfig.category}
              onChange={e =>
                setPosterConfig(prev => ({
                  ...prev,
                  category: e.target.value as AwarenessCategory
                }))
              }
              className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
            >
              {ALL_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Headline */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              Headline:
            </label>
            <input
              type="text"
              value={posterConfig.headline}
              onChange={e => setPosterConfig(prev => ({ ...prev, headline: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
            />
          </div>

          {/* Subheadline */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              Subheadline / Message:
            </label>
            <textarea
              rows={2}
              value={posterConfig.subheadline}
              onChange={e => setPosterConfig(prev => ({ ...prev, subheadline: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl p-2.5 text-xs text-slate-900 outline-none"
            />
          </div>

          {/* Call to action */}
          <div>
            <label className="text-[11px] font-bold text-slate-600 block mb-1">
              Call to Action Button:
            </label>
            <input
              type="text"
              value={posterConfig.callToAction}
              onChange={e => setPosterConfig(prev => ({ ...prev, callToAction: e.target.value }))}
              className="w-full bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
            />
          </div>

          {/* Include stats toggle */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-700">
              Display Verifiable Evidence Level
            </span>
            <input
              type="checkbox"
              checked={posterConfig.includeImpactStats}
              onChange={e =>
                setPosterConfig(prev => ({ ...prev, includeImpactStats: e.target.checked }))
              }
              className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
