import React from 'react';
import { ArrowRight, Shuffle } from 'lucide-react';
import { TransitionFlow } from '../types.ts';
import { formatDuration, getCategoryColor } from '../utils/formatters.ts';
import { useTheme, t } from '../utils/theme.tsx';

interface TransitionMatrixProps { transitions: TransitionFlow[]; }

export const TransitionMatrix: React.FC<TransitionMatrixProps> = ({ transitions }) => {
  const { isDark } = useTheme();
  const c = t(isDark);
  return (
    <div className="rounded-xl p-5 border flex flex-col" style={{ backgroundColor: c.surface, borderColor: c.border }}>
      <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: c.border }}>
        <div className="flex items-center space-x-2">
          <Shuffle className="w-3.5 h-3.5" style={{ color: c.textDim }} />
          <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: c.textDim }}>Transitions</span>
        </div>
        <span className="text-[9px] font-mono" style={{ color: c.textGhost }}>Recent</span>
      </div>
      <div className="mt-3 space-y-1.5 max-h-64 overflow-y-auto pr-1">
        {transitions && transitions.length > 0 ? transitions.map((item, idx) => {
          const isDist = item.toCategory === 'Social Media' || item.toCategory === 'Entertainment';
          const toColor = getCategoryColor(item.toCategory);
          return (
            <div key={idx} className="p-2.5 rounded-lg border flex items-center justify-between gap-2 text-xs" style={{ backgroundColor: c.surfaceAlt, borderColor: c.border }}>
              <div className="flex items-center space-x-2 min-w-0 flex-1">
                <span className="font-medium truncate max-w-[100px]" style={{ color: c.textSec }}>{item.from}</span>
                <ArrowRight className="w-3 h-3 flex-shrink-0" style={{ color: c.textGhost }} />
                <span className="font-medium truncate" style={{ color: isDist ? c.red : c.text }}>{item.to}</span>
                <span className="text-[9px] font-medium px-1.5 py-0.5 rounded flex-shrink-0" style={{ color: toColor, backgroundColor: toColor + '15' }}>{item.toCategory}</span>
              </div>
              <span className="font-mono text-[10px] font-semibold flex-shrink-0" style={{ color: c.textSec }}>{formatDuration(item.avgPreSwitchDurationSec)}</span>
            </div>
          );
        }) : <div className="py-8 text-center text-xs" style={{ color: c.textGhost }}>No transitions yet.</div>}
      </div>
    </div>
  );
};
