import React from 'react';
import { Clock, Pause, Play, Maximize2, X, Globe, AppWindow } from 'lucide-react';
import { ActiveTarget, AttentionMetrics } from '../types.ts';
import { formatDuration, getAttentionStateDetails } from '../utils/formatters.ts';
import { useTheme, t } from '../utils/theme.tsx';

interface FloatingHudProps { target: ActiveTarget | null; metrics: AttentionMetrics; trackingEnabled: boolean; onToggleTracking: () => void; onOpenDashboard?: () => void; onCloseHud?: () => void; }

export const FloatingHud: React.FC<FloatingHudProps> = ({ target, metrics, trackingEnabled, onToggleTracking, onOpenDashboard, onCloseHud }) => {
  const { isDark } = useTheme();
  const c = t(isDark);
  const stateDetails = getAttentionStateDetails(metrics.attentionState);

  return (
    <div className="w-full h-full rounded-xl p-3 select-none flex flex-col justify-between border" style={{ backgroundColor: c.surface, borderColor: c.border, WebkitAppRegion: 'drag' } as React.CSSProperties}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stateDetails.color }} />
          <span className="text-xs font-bold font-mono" style={{ color: c.text }}>{metrics.attentionScore}</span>
          <span className="text-[9px]" style={{ color: c.textGhost }}>/100</span>
          <span style={{ color: c.borderSub }}>|</span>
          <div className="flex items-center gap-1 font-mono text-xs" style={{ color: c.textSec }}>
            <Clock className="w-3 h-3" style={{ color: c.textDim }} />
            <span>{target ? (target.isUserIdle ? 'Idle (Paused)' : formatDuration(target.currentDurationSec)) : '0s'}</span>
          </div>
        </div>
        <div className="flex items-center space-x-1" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          <button onClick={onToggleTracking} className="p-1 rounded transition-colors" style={{ color: c.textDim }}>{trackingEnabled ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}</button>
          {onOpenDashboard && <button onClick={onOpenDashboard} className="p-1 rounded transition-colors" style={{ color: c.textDim }}><Maximize2 className="w-3 h-3" /></button>}
          {onCloseHud && <button onClick={onCloseHud} className="p-1 rounded transition-colors" style={{ color: c.textDim }}><X className="w-3 h-3" /></button>}
        </div>
      </div>
      <div className="mt-1.5 pt-1.5 border-t flex items-center text-xs min-w-0" style={{ borderColor: c.border }}>
        <div className="flex items-center space-x-1.5 min-w-0 flex-1 pr-2">
          {target?.isBrowser ? <Globe className="w-3 h-3 flex-shrink-0" style={{ color: c.blue }} /> : <AppWindow className="w-3 h-3 flex-shrink-0" style={{ color: c.textDim }} />}
          <span className="font-medium truncate text-[11px]" style={{ color: target?.isUserIdle ? '#f59e0b' : c.textSec }}>
            {target?.isUserIdle ? 'Away (No interaction >5m)' : (target?.domain || target?.appName || 'Monitoring…')}
          </span>
        </div>
      </div>
    </div>
  );
};
