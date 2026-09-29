import React, { useEffect, useRef } from 'react';
import { Globe, AppWindow, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { ActiveTarget, AttentionMetrics } from '../types.ts';
import { formatDuration, getAttentionStateDetails, getCategoryColor } from '../utils/formatters.ts';
import { useTheme, t } from '../utils/theme.tsx';

interface LiveGaugeProps {
  target: ActiveTarget | null;
  metrics: AttentionMetrics;
}

export const LiveGauge: React.FC<LiveGaugeProps> = ({ target, metrics }) => {
  const { isDark } = useTheme();
  const c = t(isDark);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateDetails = getAttentionStateDetails(metrics.attentionState);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    let step = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width, h = canvas.height, midY = h / 2;
      const isHyper = metrics.attentionState === 'HYPERACTIVE_SWITCHING';
      const isFlow = metrics.attentionState === 'FLOW';
      ctx.beginPath();
      ctx.strokeStyle = stateDetails.color;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.6;
      for (let x = 0; x < w; x += 3) {
        const freq = isHyper ? 0.06 : isFlow ? 0.02 : 0.035;
        const spd = isHyper ? 0.08 : isFlow ? 0.02 : 0.04;
        const amp = (isHyper ? 14 : isFlow ? 7 : 10) * Math.sin((x / w) * Math.PI);
        const y = midY + Math.sin(x * freq + step * spd) * amp;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
      step++;
      animId = requestAnimationFrame(render);
    };
    render();
    return () => cancelAnimationFrame(animId);
  }, [metrics.attentionState, stateDetails.color]);

  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (metrics.attentionScore / 100) * circumference;

  return (
    <div className="rounded-xl p-5 select-none border" style={{ backgroundColor: c.surface, borderColor: c.border }}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-4 flex flex-col items-center justify-center lg:border-r py-2" style={{ borderColor: c.border }}>
          <div className="relative flex items-center justify-center">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle cx="72" cy="72" r={radius} stroke={c.raised} strokeWidth="6" fill="transparent" />
              <circle cx="72" cy="72" r={radius} stroke={stateDetails.color} strokeWidth="6" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" fill="transparent" className="transition-all duration-700 ease-out" />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold tracking-tight font-mono" style={{ color: c.text }}>{metrics.attentionScore}</span>
              <span className="text-[10px] font-medium uppercase tracking-widest mt-0.5" style={{ color: c.textDim }}>Focus</span>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stateDetails.color }} />
            <span className="text-xs" style={{ color: c.textMuted }}>{stateDetails.label}</span>
          </div>
        </div>

        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: c.textDim }}>Current Focus</span>
              {target?.isUserIdle ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  Away / Paused (No interaction &gt; 5m)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Mouse Active (Checked every 5m)
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Clock className="w-3 h-3" style={{ color: c.textDim }} />
              <span className="font-mono font-semibold" style={{ color: c.textSec }}>
                {target ? (target.isUserIdle ? 'Paused' : formatDuration(target.currentDurationSec)) : '0s'}
              </span>
            </div>
          </div>

          {target ? (
            <div className="p-4 rounded-lg border" style={{ backgroundColor: c.surfaceAlt, borderColor: c.borderSub }}>
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-md flex-shrink-0 border" style={{ backgroundColor: c.raised, borderColor: c.borderSub }}>
                  {target.isBrowser ? <Globe className="w-4 h-4" style={{ color: c.blue }} /> : <AppWindow className="w-4 h-4" style={{ color: c.textSec }} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm" style={{ color: c.text }}>{target.appName}</span>
                    {target.domain && <span className="font-mono text-[11px]" style={{ color: c.blue }}>{target.domain}</span>}
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ color: getCategoryColor(target.category), backgroundColor: getCategoryColor(target.category) + '15' }}>{target.category}</span>
                  </div>
                  <p className="mt-1 text-xs truncate" style={{ color: c.textMuted }}>{target.tabTitle || target.windowTitle || 'Foreground Window'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-lg border border-dashed text-center" style={{ backgroundColor: c.surfaceAlt, borderColor: c.borderSub }}>
              <p className="text-xs" style={{ color: c.textDim }}>Waiting for window focus…</p>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between text-[10px] mb-1.5" style={{ color: c.textDim }}>
              <span className="uppercase tracking-widest font-medium">Waveform</span>
              {metrics.recentSwitchVelocity >= 4 ? (
                <span className="flex items-center gap-1" style={{ color: c.red }}><AlertTriangle className="w-2.5 h-2.5" /> {metrics.recentSwitchVelocity} switches/3m</span>
              ) : (
                <span className="flex items-center gap-1" style={{ color: c.green }}><CheckCircle2 className="w-2.5 h-2.5" /> Stable</span>
              )}
            </div>
            <div className="h-8 w-full rounded overflow-hidden border" style={{ backgroundColor: c.surfaceAlt, borderColor: c.border }}>
              <canvas ref={canvasRef} width={500} height={32} className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
