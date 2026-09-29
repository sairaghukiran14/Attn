import React from 'react';
import { Lightbulb, AlertTriangle, Flame, BrainCircuit } from 'lucide-react';
import { AttentionAlert, AttentionMetrics } from '../types.ts';
import { formatDuration } from '../utils/formatters.ts';
import { useTheme, t } from '../utils/theme.tsx';

interface FocusCoachProps { metrics: AttentionMetrics; activeAlerts: AttentionAlert[]; onDismissAlert: (id: string) => void; }

export const FocusCoach: React.FC<FocusCoachProps> = ({ metrics, activeAlerts, onDismissAlert }) => {
  const { isDark } = useTheme();
  const c = t(isDark);
  const insights: { title: string; desc: string; type: 'tip' | 'warning' | 'achievement' }[] = [];

  if (metrics.microHopsRatio > 25) {
    insights.push({ type: 'warning', title: 'Attention Leak Detected', desc: `${metrics.microHopsRatio}% of switches last under 15s.` });
  } else if (metrics.deepWorkDurationSec > 3600) {
    insights.push({ type: 'achievement', title: 'Strong Deep Work', desc: `${formatDuration(metrics.deepWorkDurationSec)} of unbroken focus blocks.` });
  }
  if (metrics.switchesPerHour > 20) {
    insights.push({ type: 'warning', title: 'High Switch Density', desc: `${metrics.switchesPerHour} switches/hr. Cluster communication checks.` });
  } else {
    insights.push({ type: 'tip', title: 'Sustained Rhythm', desc: `Mean attention: ${formatDuration(metrics.meanAttentionSpanSec)}. Above 3m boosts output.` });
  }

  const getIcon = (type: string) => {
    if (type === 'warning') return <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: c.yellow }} />;
    if (type === 'achievement') return <Flame className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: c.accent }} />;
    return <Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: c.green }} />;
  };
  const getBg = (type: string) => type === 'warning' ? { bg: c.warnBg, bd: c.warnBdr } : type === 'achievement' ? { bg: c.achieveBg, bd: c.achieveBdr } : { bg: c.tipBg, bd: c.tipBdr };

  return (
    <div className="rounded-xl p-5 border space-y-4" style={{ backgroundColor: c.surface, borderColor: c.border }}>
      <div className="flex items-center space-x-2 pb-3 border-b" style={{ borderColor: c.border }}>
        <BrainCircuit className="w-3.5 h-3.5" style={{ color: c.textDim }} />
        <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: c.textDim }}>Intelligence</span>
      </div>
      {activeAlerts && activeAlerts.length > 0 && (
        <div className="space-y-1.5">
          {activeAlerts.map(alert => (
            <div key={alert.id} className="p-3 rounded-lg border flex items-start justify-between gap-3" style={{ backgroundColor: c.alertBg, borderColor: c.alertBdr }}>
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: c.red }} />
                <div>
                  <h4 className="font-semibold text-xs" style={{ color: c.red }}>{alert.title}</h4>
                  <p className="mt-0.5 text-[11px] leading-relaxed" style={{ color: c.textSec }}>{alert.message}</p>
                </div>
              </div>
              <button onClick={() => onDismissAlert(alert.id)} className="text-[10px] font-mono px-2 py-0.5 rounded border transition-colors" style={{ color: c.textMuted, backgroundColor: c.raised, borderColor: c.borderSub }}>Dismiss</button>
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {insights.map((item, idx) => {
          const { bg, bd } = getBg(item.type);
          return (
            <div key={idx} className="p-3.5 rounded-lg border" style={{ backgroundColor: bg, borderColor: bd }}>
              <div className="flex items-start space-x-2.5">
                {getIcon(item.type)}
                <div>
                  <h4 className="font-semibold text-xs" style={{ color: c.text }}>{item.title}</h4>
                  <p className="mt-1 text-[11px] leading-relaxed" style={{ color: c.textMuted }}>{item.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
