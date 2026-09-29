import React, { useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { TrendingUp, AppWindow, Globe, Layers } from 'lucide-react';
import { AttentionMetrics, AppCategory } from '../types.ts';
import { formatDuration, getCategoryColor } from '../utils/formatters.ts';
import { useTheme, t } from '../utils/theme.tsx';

interface AnalyticsChartsProps {
  metrics: AttentionMetrics;
  selectedCategory: AppCategory | 'ALL';
  onSelectCategory: (cat: AppCategory | 'ALL') => void;
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ metrics, selectedCategory, onSelectCategory }) => {
  const { isDark } = useTheme();
  const c = t(isDark);
  const [activeTab, setActiveTab] = useState<'apps' | 'domains' | 'categories'>('apps');

  const hourlyLabels = (metrics.hourlyTrends || []).map(h => h.hourLabel);
  const hourlySpanData = (metrics.hourlyTrends || []).map(h => Math.round(h.avgAttentionSpanSec / 60 * 10) / 10);
  const hourlySwitchesData = (metrics.hourlyTrends || []).map(h => h.switchesCount);

  const trendChartData: any = {
    labels: hourlyLabels.length > 0 ? hourlyLabels : ['09:00', '10:00', '11:00', '12:00', '13:00'],
    datasets: [
      { type: 'line' as const, label: 'Attention Span (min)', data: hourlySpanData.length > 0 ? hourlySpanData : [3.5, 4.2, 1.8, 2.5, 3.8], borderColor: c.accent, backgroundColor: c.accent + '0d', borderWidth: 1.5, pointBackgroundColor: c.accent, pointRadius: 2.5, fill: true, tension: 0.3, yAxisID: 'y' },
      { type: 'bar' as const, label: 'Switches', data: hourlySwitchesData.length > 0 ? hourlySwitchesData : [8, 6, 16, 11, 7], backgroundColor: c.red + '40', borderColor: c.red, borderWidth: 1, borderRadius: 3, yAxisID: 'y1' }
    ]
  };

  const trendChartOptions: any = {
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { position: 'top', labels: { color: c.textMuted, font: { family: 'Inter', size: 10, weight: '500' }, usePointStyle: true, boxWidth: 6, padding: 12 } },
      tooltip: { backgroundColor: c.surface, titleColor: c.text, bodyColor: c.textSec, borderColor: c.borderSub, borderWidth: 1, padding: 8 }
    },
    scales: {
      x: { grid: { color: c.border }, ticks: { color: c.textDim, font: { family: 'JetBrains Mono', size: 9 } } },
      y: { type: 'linear', display: true, position: 'left', title: { display: true, text: 'Span (Min)', color: c.textDim, font: { size: 9 } }, grid: { color: c.border }, ticks: { color: c.textDim, font: { family: 'JetBrains Mono', size: 9 } } },
      y1: { type: 'linear', display: true, position: 'right', title: { display: true, text: 'Switches', color: c.textDim, font: { size: 9 } }, grid: { drawOnChartArea: false }, ticks: { color: c.textDim, font: { family: 'JetBrains Mono', size: 9 } } }
    }
  };

  const listItems = activeTab === 'apps' ? (metrics.topApps || []) : activeTab === 'domains' ? (metrics.topDomains || []) : [];
  const tabs = [
    { key: 'apps' as const, label: 'Apps', icon: <AppWindow className="w-3 h-3" /> },
    { key: 'domains' as const, label: 'Domains', icon: <Globe className="w-3 h-3" /> },
    { key: 'categories' as const, label: 'Categories', icon: <Layers className="w-3 h-3" /> }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
      <div className="lg:col-span-7 rounded-xl p-5 border flex flex-col" style={{ backgroundColor: c.surface, borderColor: c.border }}>
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp className="w-3.5 h-3.5" style={{ color: c.textDim }} />
          <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: c.textDim }}>Hourly Trends</span>
        </div>
        <div className="h-60 w-full"><Chart type="bar" data={trendChartData} options={trendChartOptions} /></div>
      </div>

      <div className="lg:col-span-5 rounded-xl p-5 border flex flex-col" style={{ backgroundColor: c.surface, borderColor: c.border }}>
        <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: c.border }}>
          <span className="text-[10px] font-medium uppercase tracking-widest" style={{ color: c.textDim }}>Breakdown</span>
          <div className="flex rounded-md p-0.5 border text-[11px]" style={{ backgroundColor: c.surfaceAlt, borderColor: c.borderSub }}>
            {tabs.map(tab => (
              <button key={tab.key} id={`btn-tab-${tab.key}`} onClick={() => setActiveTab(tab.key)} className="flex items-center gap-1 px-2 py-1 rounded font-medium transition-colors" style={{ backgroundColor: activeTab === tab.key ? c.raised : 'transparent', color: activeTab === tab.key ? c.text : c.textDim }}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'categories' ? (
          <div className="mt-3 space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {(metrics.categoryBreakdown || []).map((cat, idx) => {
              const isSelected = selectedCategory === cat.category;
              const color = getCategoryColor(cat.category);
              return (
                <button key={idx} onClick={() => onSelectCategory(isSelected ? 'ALL' : cat.category)} className="w-full text-left p-2.5 rounded-lg border transition-colors flex items-center justify-between" style={{ backgroundColor: isSelected ? c.raised : c.surfaceAlt, borderColor: isSelected ? c.borderStr : c.border }}>
                  <div className="flex items-center space-x-2.5">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="font-medium text-xs" style={{ color: c.text }}>{cat.category}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span style={{ color: c.textDim }}>{formatDuration(cat.totalSec)}</span>
                    <span className="font-semibold" style={{ color: c.textSec }}>{cat.percentage}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-3 space-y-1.5 max-h-56 overflow-y-auto pr-1">
            {listItems.length > 0 ? listItems.map((item, idx) => {
              const color = getCategoryColor(item.category);
              return (
                <div key={idx} className="p-2.5 rounded-lg border" style={{ backgroundColor: c.surfaceAlt, borderColor: c.border }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-medium text-xs truncate max-w-[140px]" style={{ color: c.text }}>{item.name}</span>
                    <span className="font-mono text-[11px]" style={{ color: c.textSec }}>{formatDuration(item.totalDurationSec)}</span>
                  </div>
                  <div className="w-full h-1 rounded-full overflow-hidden mb-1.5" style={{ backgroundColor: c.raised }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${item.percentageOfTime}%`, backgroundColor: color }} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono" style={{ color: c.textDim }}>
                    <span>Avg: <span style={{ color: c.accent }}>{formatDuration(item.avgAttentionSpanSec)}</span></span>
                    <span>{item.sessionsCount} sessions</span>
                  </div>
                </div>
              );
            }) : <div className="py-8 text-center text-xs" style={{ color: c.textGhost }}>No data yet.</div>}
          </div>
        )}

        <div className="mt-3 pt-3 border-t flex items-center justify-between text-[10px]" style={{ borderColor: c.border, color: c.textDim }}>
          <span>Tracked: <strong className="font-mono" style={{ color: c.textSec }}>{formatDuration(metrics.totalTrackedDurationSec)}</strong></span>
          <span>Deep Work: <strong className="font-mono" style={{ color: c.accent }}>{Math.round((metrics.deepWorkDurationSec / Math.max(1, metrics.totalTrackedDurationSec)) * 100)}%</strong></span>
        </div>
      </div>
    </div>
  );
};
