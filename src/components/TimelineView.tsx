import React, { useState } from 'react';
import { History, Globe, AppWindow, ZapOff, Flame, Search, X } from 'lucide-react';
import { SessionBurst, AppCategory } from '../types.ts';
import { formatDuration, formatTimeAgo, getCategoryColor } from '../utils/formatters.ts';
import { useTheme, t } from '../utils/theme.tsx';

interface TimelineViewProps { sessions: SessionBurst[]; selectedCategory: AppCategory | 'ALL'; onClearCategoryFilter: () => void; }

export const TimelineView: React.FC<TimelineViewProps> = ({ sessions, selectedCategory, onClearCategoryFilter }) => {
  const { isDark } = useTheme();
  const c = t(isDark);
  const [filter, setFilter] = useState<'all' | 'deep' | 'micro'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSessions = (sessions || []).filter(s => {
    if (selectedCategory !== 'ALL' && s.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!s.appName.toLowerCase().includes(q) && !s.domain?.toLowerCase().includes(q) && !s.tabTitle?.toLowerCase().includes(q)) return false;
    }
    if (filter === 'deep') return s.isDeepWork;
    if (filter === 'micro') return s.isMicroDistraction;
    return true;
  });

  return (
    <div className="rounded-xl p-5 border flex flex-col space-y-4" style={{ backgroundColor: c.surface, borderColor: c.border }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b" style={{ borderColor: c.border }}>
        <div className="flex items-center space-x-2">
          <History className="w-3.5 h-3.5" style={{ color: c.textDim }} />
          <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: c.textDim }}>Focus Stream</span>
          {selectedCategory !== 'ALL' && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium border" style={{ backgroundColor: c.raised, color: c.textSec, borderColor: c.borderSub }}>
              {selectedCategory}
              <button onClick={onClearCategoryFilter} className="ml-0.5"><X className="w-2.5 h-2.5" /></button>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2" style={{ color: c.textGhost }} />
            <input id="timeline-search-input" type="text" placeholder="Search…" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-7 pr-3 py-1 rounded-md text-xs focus:outline-none w-28" style={{ backgroundColor: c.surfaceAlt, borderColor: c.borderSub, color: c.text, border: `1px solid ${c.borderSub}` }} />
          </div>
          <div className="flex rounded-md p-0.5 border text-[11px]" style={{ backgroundColor: c.surfaceAlt, borderColor: c.borderSub }}>
            {[{ key: 'all' as const, label: `All (${sessions.length})` }, { key: 'micro' as const, label: 'Micro' }, { key: 'deep' as const, label: 'Deep' }].map(fb => (
              <button key={fb.key} onClick={() => setFilter(fb.key)} className="px-2 py-1 rounded font-medium transition-colors" style={{ backgroundColor: filter === fb.key ? c.raised : 'transparent', color: filter === fb.key ? c.text : c.textDim }}>{fb.label}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
        {filteredSessions.length > 0 ? filteredSessions.map((session) => {
          const catColor = getCategoryColor(session.category);
          return (
            <div key={session.id} className="p-3 rounded-lg border transition-colors flex items-center justify-between gap-3" style={{ backgroundColor: c.surfaceAlt, borderColor: c.border }}>
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="p-1.5 rounded-md border flex-shrink-0" style={{ backgroundColor: c.raised, borderColor: c.borderSub }}>
                  {session.isBrowser ? <Globe className="w-3.5 h-3.5" style={{ color: c.blue }} /> : <AppWindow className="w-3.5 h-3.5" style={{ color: c.textMuted }} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-xs truncate" style={{ color: c.text }}>{session.appName}</span>
                    {session.domain && <span className="font-mono text-[10px]" style={{ color: c.blue }}>{session.domain}</span>}
                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded" style={{ color: catColor, backgroundColor: catColor + '15' }}>{session.category}</span>
                    {session.isMicroDistraction && <span className="flex items-center gap-0.5 text-[9px] font-mono" style={{ color: c.red }}><ZapOff className="w-2.5 h-2.5" /> &lt;15s</span>}
                    {session.isDeepWork && <span className="flex items-center gap-0.5 text-[9px] font-mono" style={{ color: c.accent }}><Flame className="w-2.5 h-2.5" /> Deep</span>}
                  </div>
                  <p className="mt-0.5 text-[11px] truncate" style={{ color: c.textDim }}>{session.tabTitle || 'Application Window'}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 font-mono">
                <div className="text-xs font-semibold" style={{ color: session.isMicroDistraction ? c.red : session.isDeepWork ? c.accent : c.textSec }}>{formatDuration(session.durationSeconds)}</div>
                <div className="text-[10px]" style={{ color: c.textGhost }}>{formatTimeAgo(session.startTime)}</div>
              </div>
            </div>
          );
        }) : <div className="py-10 text-center text-xs" style={{ color: c.textGhost }}>No matching sessions.</div>}
      </div>
    </div>
  );
};
