import React from 'react';
import { 
  Zap, 
  Shield, 
  ShieldAlert, 
  Play, 
  Pause, 
  Settings, 
  Download, 
  PictureInPicture2,
  Sun,
  Moon,
  Trophy
} from 'lucide-react';
import { AttentionState, AppSettings, TimeframeOption, AchievementData } from '../types.ts';
import { getAttentionStateDetails } from '../utils/formatters.ts';
import { useTheme, t } from '../utils/theme.tsx';

interface HeaderProps {
  attentionState: AttentionState;
  attentionScore: number;
  trackingEnabled: boolean;
  settings: AppSettings;
  timeframe: TimeframeOption;
  achievementData?: AchievementData;
  onChangeTimeframe: (tf: TimeframeOption) => void;
  onToggleTracking: () => void;
  onToggleIncognito: () => void;
  onToggleHud: () => void;
  onOpenSettings: () => void;
  onOpenAchievements: () => void;
  onExport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  attentionState,
  attentionScore,
  trackingEnabled,
  settings,
  timeframe,
  achievementData,
  onChangeTimeframe,
  onToggleTracking,
  onToggleIncognito,
  onToggleHud,
  onOpenSettings,
  onOpenAchievements,
  onExport
}) => {
  const { isDark, toggle } = useTheme();
  const c = t(isDark);
  const stateDetails = getAttentionStateDetails(attentionState);

  const unlockedCount = achievementData?.achievements.filter(a => a.unlockedAt).length ?? 0;

  return (
    <header className="sticky top-0 z-40 w-full border-b select-none" style={{ backgroundColor: c.bg, borderColor: c.border }}>
      <div 
        className="h-12 px-4 flex items-center justify-between"
        style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
      >
        {/* Left */}
        <div className="flex items-center space-x-3 pl-18">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: c.raised, border: `1px solid ${c.borderSub}` }}>
              <Zap className="w-3.5 h-3.5" style={{ color: c.accent }} />
            </div>
            <span className="font-bold text-sm tracking-tight" style={{ color: c.text }}>
              Attn
            </span>
          </div>
        </div>

        {/* Center */}
        <div className="flex items-center gap-2.5 text-xs">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stateDetails.color }} />
          <span className="font-medium" style={{ color: c.textMuted }}>{stateDetails.label}</span>
          <span style={{ color: c.textGhost }}>·</span>
          <span className="font-mono font-semibold" style={{ color: c.text }}>
            {attentionScore}<span className="font-normal ml-0.5" style={{ color: c.textDim }}>/100</span>
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center space-x-1" style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}>
          {/* Timeframe */}
          <div className="flex rounded-md p-0.5 border text-xs mr-1" style={{ backgroundColor: c.surfaceAlt, borderColor: c.borderSub }}>
            {(['today', 'yesterday', 'week'] as TimeframeOption[]).map((tf) => (
              <button
                key={tf}
                onClick={() => onChangeTimeframe(tf)}
                className="px-2.5 py-1 rounded font-medium transition-colors"
                style={{
                  backgroundColor: timeframe === tf ? c.raised : 'transparent',
                  color: timeframe === tf ? c.text : c.textMuted,
                }}
              >
                {tf === 'today' ? 'Today' : tf === 'yesterday' ? 'Yesterday' : '7 Days'}
              </button>
            ))}
          </div>

          {/* Achievements */}
          <button
            onClick={onOpenAchievements}
            title="Achievements"
            className="relative p-1.5 rounded-md interactive-button transition-colors hover:opacity-80"
            style={{ color: '#ffd700' }}
          >
            <Trophy className="w-3.5 h-3.5" />
            {unlockedCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full text-[7px] font-bold flex items-center justify-center shadow-sm" style={{ backgroundColor: c.accent, color: c.bg }}>
                {unlockedCount}
              </span>
            )}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggle}
            title={isDark ? 'Switch to Light mode' : 'Switch to Dark mode'}
            className="p-1.5 rounded-md interactive-button transition-transform hover:scale-105"
            style={{ color: c.textDim }}
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <button id="btn-toggle-hud" onClick={onToggleHud} title="Floating Meter" className="p-1.5 rounded-md interactive-button transition-colors hover:opacity-80" style={{ color: c.textDim }}>
            <PictureInPicture2 className="w-3.5 h-3.5" />
          </button>

          <button
            id="btn-toggle-tracking"
            onClick={onToggleTracking}
            title={trackingEnabled ? 'Pause' : 'Resume'}
            className="p-1.5 rounded-md interactive-button transition-colors hover:opacity-80"
            style={{ color: trackingEnabled ? c.green : c.red }}
          >
            {trackingEnabled ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button id="btn-toggle-incognito" onClick={onToggleIncognito} title="Incognito" className="p-1.5 rounded-md interactive-button transition-colors hover:opacity-80" style={{ color: settings.incognitoMode ? c.purple : c.textDim }}>
            {settings.incognitoMode ? <ShieldAlert className="w-3.5 h-3.5" /> : <Shield className="w-3.5 h-3.5" />}
          </button>
          <button id="btn-export-data" onClick={onExport} title="Export" className="p-1.5 rounded-md interactive-button transition-colors hover:opacity-80" style={{ color: c.textDim }}>
            <Download className="w-3.5 h-3.5" />
          </button>
          <button id="btn-open-settings" onClick={onOpenSettings} title="Settings" className="p-1.5 rounded-md interactive-button transition-colors hover:opacity-80" style={{ color: c.textDim }}>
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
