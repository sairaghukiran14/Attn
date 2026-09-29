import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header.tsx';
import { LiveGauge } from './components/LiveGauge.tsx';
import { MetricCards } from './components/MetricCards.tsx';
import { AnalyticsCharts } from './components/AnalyticsCharts.tsx';
import { TimelineView } from './components/TimelineView.tsx';
import { TransitionMatrix } from './components/TransitionMatrix.tsx';
import { FocusCoach } from './components/FocusCoach.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { FloatingHud } from './components/FloatingHud.tsx';
import { AchievementsPanel } from './components/AchievementsPanel.tsx';
import { AchievementToast } from './components/AchievementToast.tsx';

import { 
  ActiveTarget, 
  AttentionMetrics, 
  SessionBurst, 
  AppSettings, 
  AttentionAlert,
  TimeframeOption,
  AppCategory,
  AchievementData,
  Achievement
} from './types.ts';
import { 
  INITIAL_MOCK_TARGET, 
  INITIAL_MOCK_SETTINGS, 
  generateMockMetrics, 
  generateMockSessions 
} from './utils/mockData.ts';
import { ThemeProvider, useTheme, t } from './utils/theme.tsx';
import { createDefaultAchievementData, evaluateAchievements, syncAchievementData } from './utils/achievements.ts';

const AppDashboard: React.FC = () => {
  const isHudView = typeof window !== 'undefined' && window.location.search.includes('view=hud');
  const isElectron = typeof window !== 'undefined' && !!window.electronAPI;
  const { isDark } = useTheme();
  const c = t(isDark);

  const [activeTarget, setActiveTarget] = useState<ActiveTarget | null>(
    isElectron ? null : INITIAL_MOCK_TARGET
  );
  const [metrics, setMetrics] = useState<AttentionMetrics>(generateMockMetrics());
  const [sessions, setSessions] = useState<SessionBurst[]>(generateMockSessions());
  const [settings, setSettings] = useState<AppSettings>(INITIAL_MOCK_SETTINGS);
  const [timeframe, setTimeframe] = useState<TimeframeOption>('today');
  const [selectedCategory, setSelectedCategory] = useState<AppCategory | 'ALL'>('ALL');
  const [activeAlerts, setActiveAlerts] = useState<AttentionAlert[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);

  // Achievements & Gamification state (guarantees all 100 badges & challenges)
  const [achievementData, setAchievementData] = useState<AchievementData>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('mindpulse_achievements');
        if (stored) {
          const parsed = JSON.parse(stored);
          const synced = syncAchievementData(parsed);
          localStorage.setItem('mindpulse_achievements', JSON.stringify(synced));
          return synced;
        }
      } catch (e) {}
    }
    const defaults = createDefaultAchievementData();
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mindpulse_achievements', JSON.stringify(defaults));
      } catch (e) {}
    }
    return defaults;
  });
  const [unlockedToast, setUnlockedToast] = useState<Achievement | null>(null);
  const achievementDataRef = useRef(achievementData);
  achievementDataRef.current = achievementData;

  // Load initial data from Electron or LocalStorage
  const loadInitialData = useCallback(async () => {
    if (!window.electronAPI) return;
    try {
      const [targetData, metricsData, sessionsData, settingsData, achievementsData] = await Promise.all([
        window.electronAPI.getRealtimeTarget(),
        window.electronAPI.getMetrics(timeframe),
        window.electronAPI.getRecentSessions(100),
        window.electronAPI.getSettings(),
        window.electronAPI.getAchievements()
      ]);

      if (targetData) setActiveTarget(targetData);
      if (metricsData) setMetrics(metricsData);
      if (sessionsData && sessionsData.length > 0) setSessions(sessionsData);
      if (settingsData) setSettings(settingsData);
      if (achievementsData) {
        const synced = syncAchievementData(achievementsData);
        setAchievementData(synced);
        window.electronAPI.saveAchievements(synced).catch(() => {});
      } else {
        const initial100 = createDefaultAchievementData();
        window.electronAPI.saveAchievements(initial100).catch(() => {});
      }
    } catch (e) {
      console.error('Failed to load initial data from Electron API:', e);
    }
  }, [timeframe]);

  // Handle achievement check whenever metrics or sessions change
  const checkAchievements = useCallback((currentMetrics: AttentionMetrics, currentSessions: SessionBurst[]) => {
    const { updated, newlyUnlocked } = evaluateAchievements(
      achievementDataRef.current,
      currentMetrics,
      currentSessions
    );

    setAchievementData(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mindpulse_achievements', JSON.stringify(updated));
      } catch (e) {}
    }

    if (window.electronAPI) {
      window.electronAPI.saveAchievements(updated).catch(() => {});
    }

    // Trigger toast & notification for each newly unlocked achievement
    if (newlyUnlocked.length > 0) {
      const latest = newlyUnlocked[0];
      setUnlockedToast(latest);

      // Trigger desktop native notification
      if (window.electronAPI) {
        window.electronAPI.notifyAchievement(latest).catch(() => {});
      } else if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification(`🏆 Unlocked: ${latest.title}`, {
          body: `${latest.icon} ${latest.description}`,
          icon: '/favicon.ico'
        });
      }

      // Add to focus coach alerts feed
      const newAlert: AttentionAlert = {
        id: `ach-${Date.now()}-${latest.id}`,
        type: 'ACHIEVEMENT',
        title: `Achievement: ${latest.title}`,
        message: `${latest.icon} ${latest.description} — Badge unlocked!`,
        timestamp: Date.now()
      };
      setActiveAlerts((prev) => [newAlert, ...prev.slice(0, 3)]);
    }
  }, []);

  useEffect(() => {
    loadInitialData();

    if (window.electronAPI) {
      const unsubscribeTick = window.electronAPI.onRealtimeTick((data) => {
        if (data.target) {
          setActiveTarget(data.target);
        }
        if (data.currentMetrics) {
          setMetrics((prev) => {
            const next = { ...prev, ...data.currentMetrics };
            return next;
          });
        }
      });

      const unsubscribeAlert = window.electronAPI.onAttentionAlert((alert) => {
        setActiveAlerts((prev) => [alert, ...prev.slice(0, 3)]);
      });

      const interval = setInterval(async () => {
        try {
          const freshSessions = await window.electronAPI!.getRecentSessions(100);
          if (freshSessions) {
            setSessions(freshSessions);
          }
        } catch (e) {}
      }, 4000);

      return () => {
        unsubscribeTick();
        unsubscribeAlert();
        clearInterval(interval);
      };
    } else {
      // Browser Mock Ticker
      const mockInterval = setInterval(() => {
        setActiveTarget((prev) => {
          if (!prev) return INITIAL_MOCK_TARGET;
          return {
            ...prev,
            currentDurationSec: prev.currentDurationSec + 1
          };
        });

        setMetrics((prev) => ({
          ...prev,
          currentStreakSec: prev.currentStreakSec + 1
        }));
      }, 1000);

      return () => clearInterval(mockInterval);
    }
  }, [loadInitialData]);

  // Periodically evaluate achievements based on latest metrics and sessions
  useEffect(() => {
    const achTimer = setTimeout(() => {
      checkAchievements(metrics, sessions);
    }, 1500);
    return () => clearTimeout(achTimer);
  }, [metrics.attentionScore, metrics.deepWorkDurationSec, metrics.totalTrackedDurationSec, sessions.length, checkAchievements]);

  // Actions
  const handleToggleTracking = async () => {
    if (window.electronAPI) {
      const next = await window.electronAPI.toggleTracking();
      setSettings((prev) => ({ ...prev, trackingEnabled: next }));
    } else {
      setSettings((prev) => ({ ...prev, trackingEnabled: !prev.trackingEnabled }));
    }
  };

  const handleToggleIncognito = async () => {
    const nextIncognito = !settings.incognitoMode;
    const updated = { ...settings, incognitoMode: nextIncognito };
    setSettings(updated);
    if (window.electronAPI) {
      await window.electronAPI.updateSettings(updated);
    }
  };

  const handleToggleHud = async () => {
    if (window.electronAPI) {
      await window.electronAPI.toggleHud();
    } else {
      alert('Floating Attention Meter is available in the Electron Desktop App.');
    }
  };

  const handleSaveSettings = async (updated: Partial<AppSettings>) => {
    const merged = { ...settings, ...updated };
    setSettings(merged);
    if (window.electronAPI) {
      await window.electronAPI.updateSettings(merged);
    }
  };

  const handleClearHistory = async () => {
    if (window.electronAPI) {
      await window.electronAPI.clearHistory();
      setSessions([]);
      const freshMetrics = await window.electronAPI.getMetrics(timeframe);
      setMetrics(freshMetrics);
    } else {
      setSessions([]);
    }
  };

  const handleExport = async () => {
    if (window.electronAPI) {
      const exportRes = await window.electronAPI.exportData();
      const blob = new Blob([exportRes.json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = exportRes.filename;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const payload = JSON.stringify({ metrics, sessions, settings, achievementData }, null, 2);
      const blob = new Blob([payload], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attn_export_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleDismissAlert = (id: string) => {
    setActiveAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  // Floating HUD view
  if (isHudView) {
    return (
      <div className="w-screen h-screen p-1 bg-transparent">
        <FloatingHud
          target={activeTarget}
          metrics={metrics}
          trackingEnabled={settings.trackingEnabled}
          onToggleTracking={handleToggleTracking}
          onCloseHud={() => window.electronAPI?.toggleHud(false)}
        />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col theme-smooth"
      style={{ 
        backgroundColor: c.bg, 
        color: c.text 
      }}
    >
      {/* Header */}
      <Header
        attentionState={metrics.attentionState}
        attentionScore={metrics.attentionScore}
        trackingEnabled={settings.trackingEnabled}
        settings={settings}
        timeframe={timeframe}
        achievementData={achievementData}
        onChangeTimeframe={setTimeframe}
        onToggleTracking={handleToggleTracking}
        onToggleIncognito={handleToggleIncognito}
        onToggleHud={handleToggleHud}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onExport={handleExport}
      />

      {/* Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-4">
        <LiveGauge target={activeTarget} metrics={metrics} />
        <MetricCards metrics={metrics} />
        <AnalyticsCharts 
          metrics={metrics} 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <FocusCoach
          metrics={metrics}
          activeAlerts={activeAlerts}
          onDismissAlert={handleDismissAlert}
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7">
            <TimelineView 
              sessions={sessions} 
              selectedCategory={selectedCategory}
              onClearCategoryFilter={() => setSelectedCategory('ALL')}
            />
          </div>
          <div className="lg:col-span-5">
            <TransitionMatrix transitions={metrics.recentTransitions || []} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer 
        className="py-3 px-6 border-t text-[10px] flex items-center justify-between max-w-7xl mx-auto w-full transition-colors duration-200"
        style={{ 
          borderColor: c.border, 
          color: c.textDim 
        }}
      >
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.accent }}></span>
          <span className="font-semibold text-xs tracking-tight" style={{ color: c.text }}>Attn</span>
          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded" style={{ backgroundColor: c.raised, color: c.textMuted }}>v1.1</span>
        </div>
        <div className="flex items-center space-x-3 font-mono text-[10px]">
          <span>Poll: {settings.pollingIntervalMs}ms</span>
          <span>·</span>
          <span>Local SQLite/JSON Only</span>
          <span>·</span>
          <span style={{ color: c.accent }}>Level {achievementData.level} ({achievementData.totalXP} XP)</span>
        </div>
      </footer>

      {/* Achievements Panel Modal */}
      <AchievementsPanel
        isOpen={isAchievementsOpen}
        onClose={() => setIsAchievementsOpen(false)}
        data={achievementData}
      />

      {/* Slide-in Achievement Toast */}
      <AchievementToast
        achievement={unlockedToast}
        onDismiss={() => setUnlockedToast(null)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider initial="light">
      <AppDashboard />
    </ThemeProvider>
  );
};

export default App;
