export type AppCategory = 
  | 'Deep Work' 
  | 'Development' 
  | 'Communication' 
  | 'Research & Reading' 
  | 'Social Media' 
  | 'Entertainment' 
  | 'Utilities' 
  | 'Uncategorized';

export type AttentionState = 'FLOW' | 'FOCUSED' | 'FRAGMENTED' | 'HYPERACTIVE_SWITCHING' | 'IDLE';

export type TimeframeOption = 'today' | 'yesterday' | 'week' | 'all';

export type Theme = 'dark' | 'light';

export interface ActiveTarget {
  appName: string;
  windowTitle: string;
  tabTitle: string;
  tabUrl: string;
  domain: string;
  category: AppCategory;
  isBrowser: boolean;
  focusedSince: number;
  currentDurationSec: number;
  isUserIdle?: boolean;
  idleTimeSec?: number;
  lastInteractionTime?: number;
  mouseActive?: boolean;
}

export interface SessionBurst {
  id: string;
  appName: string;
  tabTitle?: string;
  tabUrl?: string;
  domain?: string;
  category: AppCategory;
  isBrowser: boolean;
  startTime: number;
  endTime: number;
  durationSeconds: number;
  isMicroDistraction: boolean;
  isDeepWork: boolean;
}

export interface TransitionFlow {
  from: string;
  to: string;
  fromType: 'app' | 'tab';
  toType: 'app' | 'tab';
  fromCategory: AppCategory;
  toCategory: AppCategory;
  count: number;
  avgPreSwitchDurationSec: number;
}

export interface HourlyMetric {
  hourLabel: string;
  hour: number;
  avgAttentionSpanSec: number;
  medianAttentionSpanSec: number;
  switchesCount: number;
  attentionScore: number;
  totalTimeSec: number;
}

export interface EntitySummary {
  name: string;
  type: 'app' | 'domain';
  category: AppCategory;
  totalDurationSec: number;
  sessionsCount: number;
  avgAttentionSpanSec: number;
  microHopsCount: number;
  percentageOfTime: number;
  color?: string;
}

export interface AttentionMetrics {
  currentStreakSec: number;
  attentionScore: number;
  attentionState: AttentionState;
  
  meanAttentionSpanSec: number;
  medianAttentionSpanSec: number;
  totalSwitchesToday: number;
  switchesPerHour: number;
  
  microHopsCount: number;
  microHopsRatio: number;
  deepWorkDurationSec: number;
  totalTrackedDurationSec: number;
  
  recentSwitchVelocity: number; 

  topApps: EntitySummary[];
  topDomains: EntitySummary[];
  categoryBreakdown: { category: AppCategory; totalSec: number; percentage: number; color: string }[];
  hourlyTrends: HourlyMetric[];
  recentTransitions: TransitionFlow[];
}

export interface AppSettings {
  trackingEnabled: boolean;
  pollingIntervalMs: number;
  microDistractionThresholdSec: number;
  deepWorkThresholdSec: number;
  fragmentationAlertThreshold: number;
  notificationsEnabled: boolean;
  incognitoMode: boolean;
  darkMode: boolean;
  showFloatingHud: boolean;
  theme: Theme;
  idleDetectionEnabled?: boolean;
  idleThresholdSec?: number; // Inactivity threshold in seconds (default: 300s = 5min)
  customCategoryRules: {
    pattern: string;
    type: 'app' | 'domain';
    category: AppCategory;
  }[];
}

export interface AttentionAlert {
  id: string;
  type: 'FRAGMENTATION' | 'TAB_HOPPING' | 'FLOW_MILESTONE' | 'RECOVERY' | 'ACHIEVEMENT' | 'IDLE' | 'RESUMED';
  title: string;
  message: string;
  timestamp: number;
}

// ─── Achievements & Challenges ──────────────────────────────────

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'diamond' | 'master';
export type AchievementCategory = 'Flow' | 'Deep Work' | 'Discipline' | 'Productivity' | 'Streaks' | 'Milestones' | 'Speed' | 'Special';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;         // emoji
  tier: AchievementTier;
  category?: AchievementCategory;
  condition: string;    // human-readable
  unlockedAt?: number;  // timestamp, undefined = locked
  progress: number;     // 0-100
  target: number;       // threshold value
  current: number;      // current value
  xpReward?: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'daily' | 'weekly' | 'mastery';
  category?: AchievementCategory;
  target: number;
  current: number;
  unit: string;
  expiresAt: number;
  completedAt?: number;
  reward: string;       // description of what you "earn"
}

export interface AchievementData {
  achievements: Achievement[];
  challenges: Challenge[];
  totalXP: number;
  level: number;
  streak: number;       // consecutive days with > 60 score
}

// ─── Electron API ───────────────────────────────────────────────

export interface ElectronAPI {
  getRealtimeTarget: () => Promise<ActiveTarget>;
  getMetrics: (timeframe?: string) => Promise<AttentionMetrics>;
  getRecentSessions: (limit?: number) => Promise<SessionBurst[]>;
  getSettings: () => Promise<AppSettings>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<AppSettings>;
  toggleTracking: (enabled?: boolean) => Promise<boolean>;
  clearHistory: () => Promise<boolean>;
  toggleHud: (force?: boolean) => Promise<boolean>;
  exportData: () => Promise<{ json: string; filename: string }>;
  getAchievements: () => Promise<AchievementData | null>;
  saveAchievements: (data: AchievementData) => Promise<boolean>;
  notifyAchievement: (achievement: Achievement) => Promise<boolean>;
  onRealtimeTick: (callback: (data: { target: ActiveTarget; currentMetrics: Partial<AttentionMetrics> }) => void) => () => void;
  onAttentionAlert: (callback: (alert: AttentionAlert) => void) => () => void;
  onAchievementUnlocked: (callback: (achievement: Achievement) => void) => () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
