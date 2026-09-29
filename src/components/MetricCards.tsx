import React from 'react';
import { Timer, Repeat, ZapOff, Target } from 'lucide-react';
import { AttentionMetrics } from '../types.ts';
import { formatDuration } from '../utils/formatters.ts';
import { useTheme, t } from '../utils/theme.tsx';

interface MetricCardsProps { metrics: AttentionMetrics; }

const Card: React.FC<{
  label: string; value: string; suffix?: string; icon: React.ReactNode; accentColor: string; footer: React.ReactNode;
  c: ReturnType<typeof t>;
}> = ({ label, value, suffix, icon, accentColor, footer, c }) => (
  <div className="rounded-xl p-4 border transition-colors" style={{ backgroundColor: c.surface, borderColor: c.border }}>
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: c.textDim }}>{label}</span>
      <div className="p-1.5 rounded-md border" style={{ backgroundColor: c.surfaceAlt, borderColor: c.borderSub, color: accentColor }}>{icon}</div>
    </div>
    <div className="mt-3 flex items-baseline gap-1.5">
      <span className="text-2xl font-bold font-mono tracking-tight" style={{ color: c.text }}>{value}</span>
      {suffix && <span className="text-[11px] font-medium" style={{ color: c.textDim }}>{suffix}</span>}
    </div>
    <div className="mt-3 pt-3 border-t flex items-center justify-between text-[11px]" style={{ borderColor: c.border, color: c.textDim }}>{footer}</div>
  </div>
);

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics }) => {
  const { isDark } = useTheme();
  const c = t(isDark);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      <Card c={c} label="Mean Attention Span" value={formatDuration(metrics.meanAttentionSpanSec)} suffix="/ burst" icon={<Timer className="w-3.5 h-3.5" />} accentColor={c.blue} footer={<><span>Median: <strong className="font-mono" style={{ color: c.textSec }}>{formatDuration(metrics.medianAttentionSpanSec)}</strong></span><span style={{ color: c.blue }}>Continuous</span></>} />
      <Card c={c} label="Context Switches" value={String(metrics.totalSwitchesToday)} suffix="today" icon={<Repeat className="w-3.5 h-3.5" />} accentColor={c.textSec} footer={<><span>Rate: <strong className="font-mono" style={{ color: c.textSec }}>{metrics.switchesPerHour}/hr</strong></span><span style={{ color: metrics.switchesPerHour > 25 ? c.red : c.green }}>{metrics.switchesPerHour > 25 ? 'High' : 'Normal'}</span></>} />
      <Card c={c} label="Micro-Hopping" value={`${metrics.microHopsRatio}%`} suffix={`(${metrics.microHopsCount} <15s)`} icon={<ZapOff className="w-3.5 h-3.5" />} accentColor={c.red} footer={<><span>Leak:</span><span style={{ color: metrics.microHopsRatio > 25 ? c.red : c.green }}>{metrics.microHopsRatio > 25 ? 'High' : 'Minimal'}</span></>} />
      <Card c={c} label="Deep Work" value={formatDuration(metrics.deepWorkDurationSec)} suffix={`/ ${formatDuration(metrics.totalTrackedDurationSec)}`} icon={<Target className="w-3.5 h-3.5" />} accentColor={c.accent} footer={<><span>Ratio:</span><span className="font-mono font-semibold" style={{ color: c.accent }}>{metrics.totalTrackedDurationSec > 0 ? Math.round((metrics.deepWorkDurationSec / metrics.totalTrackedDurationSec) * 100) : 0}%</span></>} />
    </div>
  );
};
