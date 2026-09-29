import { ActiveTarget, AttentionMetrics, SessionBurst, AppSettings } from '../types.ts';

export const INITIAL_MOCK_TARGET: ActiveTarget = {
  appName: 'Brave Browser',
  windowTitle: 'Attention Span Intelligence Dashboard - Attn',
  tabTitle: 'Attention Span Expectations for Adults - Research Notes',
  tabUrl: 'https://claude.ai/chat/focus-research',
  domain: 'claude.ai',
  category: 'Deep Work',
  isBrowser: true,
  focusedSince: Date.now() - 145000, // 2m 25s
  currentDurationSec: 145
};

export const INITIAL_MOCK_SETTINGS: AppSettings = {
  trackingEnabled: true,
  pollingIntervalMs: 1000,
  microDistractionThresholdSec: 15,
  deepWorkThresholdSec: 600,
  fragmentationAlertThreshold: 8,
  notificationsEnabled: true,
  incognitoMode: false,
  darkMode: false,
  theme: 'light',
  showFloatingHud: false,
  customCategoryRules: [
    { pattern: 'github.com', type: 'domain', category: 'Development' },
    { pattern: 'claude.ai', type: 'domain', category: 'Deep Work' },
    { pattern: 'chatgpt.com', type: 'domain', category: 'Deep Work' },
    { pattern: 'Cursor', type: 'app', category: 'Development' },
    { pattern: 'Code', type: 'app', category: 'Development' },
    { pattern: 'Slack', type: 'app', category: 'Communication' },
    { pattern: 'youtube.com', type: 'domain', category: 'Entertainment' },
    { pattern: 'reddit.com', type: 'domain', category: 'Social Media' },
    { pattern: 'twitter.com', type: 'domain', category: 'Social Media' }
  ]
};

export function generateMockMetrics(): AttentionMetrics {
  return {
    currentStreakSec: 240,
    attentionScore: 84,
    attentionState: 'FLOW',
    meanAttentionSpanSec: 165, // ~2m 45s
    medianAttentionSpanSec: 140,
    totalSwitchesToday: 54,
    switchesPerHour: 12,
    microHopsCount: 9,
    microHopsRatio: 16,
    deepWorkDurationSec: 4200,
    totalTrackedDurationSec: 14400, // 4 hours
    recentSwitchVelocity: 2,
    topApps: [
      {
        name: 'Visual Studio Code',
        type: 'app',
        category: 'Development',
        totalDurationSec: 5400,
        sessionsCount: 18,
        avgAttentionSpanSec: 300,
        microHopsCount: 2,
        percentageOfTime: 38,
        color: '#38bdf8'
      },
      {
        name: 'Brave Browser',
        type: 'app',
        category: 'Deep Work',
        totalDurationSec: 4600,
        sessionsCount: 22,
        avgAttentionSpanSec: 209,
        microHopsCount: 4,
        percentageOfTime: 32,
        color: '#00f2fe'
      },
      {
        name: 'Slack',
        type: 'app',
        category: 'Communication',
        totalDurationSec: 1900,
        sessionsCount: 14,
        avgAttentionSpanSec: 135,
        microHopsCount: 3,
        percentageOfTime: 13,
        color: '#a855f7'
      },
      {
        name: 'Terminal',
        type: 'app',
        category: 'Development',
        totalDurationSec: 1400,
        sessionsCount: 8,
        avgAttentionSpanSec: 175,
        microHopsCount: 1,
        percentageOfTime: 10,
        color: '#34d399'
      },
      {
        name: 'Spotify',
        type: 'app',
        category: 'Entertainment',
        totalDurationSec: 1100,
        sessionsCount: 4,
        avgAttentionSpanSec: 275,
        microHopsCount: 0,
        percentageOfTime: 7,
        color: '#fb923c'
      }
    ],
    topDomains: [
      {
        name: 'claude.ai',
        type: 'domain',
        category: 'Deep Work',
        totalDurationSec: 2800,
        sessionsCount: 8,
        avgAttentionSpanSec: 350,
        microHopsCount: 1,
        percentageOfTime: 20,
        color: '#00f2fe'
      },
      {
        name: 'github.com',
        type: 'domain',
        category: 'Development',
        totalDurationSec: 2100,
        sessionsCount: 9,
        avgAttentionSpanSec: 233,
        microHopsCount: 2,
        percentageOfTime: 15,
        color: '#38bdf8'
      },
      {
        name: 'stackoverflow.com',
        type: 'domain',
        category: 'Research & Reading',
        totalDurationSec: 920,
        sessionsCount: 6,
        avgAttentionSpanSec: 153,
        microHopsCount: 1,
        percentageOfTime: 6,
        color: '#34d399'
      },
      {
        name: 'reddit.com',
        type: 'domain',
        category: 'Social Media',
        totalDurationSec: 340,
        sessionsCount: 4,
        avgAttentionSpanSec: 85,
        microHopsCount: 2,
        percentageOfTime: 2,
        color: '#f43f5e'
      }
    ],
    categoryBreakdown: [
      { category: 'Development', totalSec: 6800, percentage: 47, color: '#38bdf8' },
      { category: 'Deep Work', totalSec: 4600, percentage: 32, color: '#00f2fe' },
      { category: 'Communication', totalSec: 1900, percentage: 13, color: '#a855f7' },
      { category: 'Entertainment', totalSec: 1100, percentage: 8, color: '#fb923c' }
    ],
    hourlyTrends: [
      { hourLabel: '09:00', hour: 9, avgAttentionSpanSec: 180, medianAttentionSpanSec: 160, switchesCount: 8, attentionScore: 82, totalTimeSec: 3200 },
      { hourLabel: '10:00', hour: 10, avgAttentionSpanSec: 240, medianAttentionSpanSec: 210, switchesCount: 6, attentionScore: 91, totalTimeSec: 3500 },
      { hourLabel: '11:00', hour: 11, avgAttentionSpanSec: 110, medianAttentionSpanSec: 90, switchesCount: 16, attentionScore: 62, totalTimeSec: 3400 },
      { hourLabel: '12:00', hour: 12, avgAttentionSpanSec: 140, medianAttentionSpanSec: 125, switchesCount: 11, attentionScore: 74, totalTimeSec: 3100 },
      { hourLabel: '13:00', hour: 13, avgAttentionSpanSec: 95, medianAttentionSpanSec: 80, switchesCount: 19, attentionScore: 55, totalTimeSec: 2900 },
      { hourLabel: '14:00', hour: 14, avgAttentionSpanSec: 210, medianAttentionSpanSec: 190, switchesCount: 7, attentionScore: 86, totalTimeSec: 3600 }
    ],
    recentTransitions: [
      { from: 'Cursor', to: 'claude.ai', fromType: 'app', toType: 'tab', fromCategory: 'Development', toCategory: 'Deep Work', count: 4, avgPreSwitchDurationSec: 310 },
      { from: 'claude.ai', to: 'Cursor', fromType: 'tab', toType: 'app', fromCategory: 'Deep Work', toCategory: 'Development', count: 4, avgPreSwitchDurationSec: 280 },
      { from: 'Cursor', to: 'Slack', fromType: 'app', toType: 'app', fromCategory: 'Development', toCategory: 'Communication', count: 3, avgPreSwitchDurationSec: 145 },
      { from: 'Slack', to: 'reddit.com', fromType: 'app', toType: 'tab', fromCategory: 'Communication', toCategory: 'Social Media', count: 2, avgPreSwitchDurationSec: 45 },
      { from: 'reddit.com', to: 'Cursor', fromType: 'tab', toType: 'app', fromCategory: 'Social Media', toCategory: 'Development', count: 2, avgPreSwitchDurationSec: 25 }
    ]
  };
}

export function generateMockSessions(): SessionBurst[] {
  const now = Date.now();
  return [
    {
      id: '1',
      appName: 'Brave Browser',
      tabTitle: 'Attention Span Expectations for Adults',
      tabUrl: 'https://claude.ai/chat/focus-research',
      domain: 'claude.ai',
      category: 'Deep Work',
      isBrowser: true,
      startTime: now - 360000,
      endTime: now - 120000,
      durationSeconds: 240,
      isMicroDistraction: false,
      isDeepWork: false
    },
    {
      id: '2',
      appName: 'Slack',
      tabTitle: undefined,
      tabUrl: undefined,
      domain: undefined,
      category: 'Communication',
      isBrowser: false,
      startTime: now - 400000,
      endTime: now - 360000,
      durationSeconds: 40,
      isMicroDistraction: false,
      isDeepWork: false
    },
    {
      id: '3',
      appName: 'Brave Browser',
      tabTitle: 'r/programming: Context Switching Costs',
      tabUrl: 'https://reddit.com/r/programming',
      domain: 'reddit.com',
      category: 'Social Media',
      isBrowser: true,
      startTime: now - 412000,
      endTime: now - 400000,
      durationSeconds: 12,
      isMicroDistraction: true,
      isDeepWork: false
    },
    {
      id: '4',
      appName: 'Visual Studio Code',
      tabTitle: 'tracker.ts — APC',
      tabUrl: undefined,
      domain: undefined,
      category: 'Development',
      isBrowser: false,
      startTime: now - 1100000,
      endTime: now - 412000,
      durationSeconds: 688,
      isMicroDistraction: false,
      isDeepWork: true
    },
    {
      id: '5',
      appName: 'Brave Browser',
      tabTitle: 'GitHub - Pull Requests',
      tabUrl: 'https://github.com/pulls',
      domain: 'github.com',
      category: 'Development',
      isBrowser: true,
      startTime: now - 1240000,
      endTime: now - 1100000,
      durationSeconds: 140,
      isMicroDistraction: false,
      isDeepWork: false
    }
  ];
}
