import { Achievement, Challenge, AchievementData, AttentionMetrics, SessionBurst, AchievementTier, AchievementCategory } from '../types.ts';

// ─── 60 Badges Across 6 Categories & 5 Tiers ─────────────────────

export const BADGE_DEFINITIONS: Omit<Achievement, 'progress' | 'current' | 'unlockedAt'>[] = [
  // ─── 1. Flow & Focus (10 badges) ──────────────────────────────
  {
    id: 'first-flow',
    title: 'First Flow',
    description: 'Enter a recognized flow state for the first time',
    icon: '⚡',
    tier: 'bronze',
    category: 'Flow',
    condition: 'Reach FLOW state once',
    target: 1,
    xpReward: 25,
  },
  {
    id: 'flow-seeker',
    title: 'Flow Seeker',
    description: 'Accumulate 3 distinct flow sessions',
    icon: '🌊',
    tier: 'bronze',
    category: 'Flow',
    condition: 'Reach FLOW state 3 times',
    target: 3,
    xpReward: 50,
  },
  {
    id: 'flow-master',
    title: 'Flow Master',
    description: 'Sustain 10 distinct flow sessions across apps',
    icon: '🔥',
    tier: 'silver',
    category: 'Flow',
    condition: 'Reach FLOW state 10 times',
    target: 10,
    xpReward: 100,
  },
  {
    id: 'deep-immersion',
    title: 'Deep Immersion',
    description: 'Stay in unbroken flow for 25 continuous minutes',
    icon: '🧘',
    tier: 'silver',
    category: 'Flow',
    condition: '25 min unbroken flow session',
    target: 1500,
    xpReward: 150,
  },
  {
    id: 'zen-mode',
    title: 'Zen Mode',
    description: 'Maintain an attention score above 90 for 30 minutes',
    icon: '✨',
    tier: 'gold',
    category: 'Flow',
    condition: 'Attention score 90+ for 30 min',
    target: 1800,
    xpReward: 250,
  },
  {
    id: 'flow-catalyst',
    title: 'Flow Catalyst',
    description: 'Enter flow within 3 minutes of starting a deep session',
    icon: '🚀',
    tier: 'gold',
    category: 'Flow',
    condition: 'Fast flow activation',
    target: 1,
    xpReward: 200,
  },
  {
    id: 'diamond-focus',
    title: 'Diamond Focus',
    description: 'Maintain 95+ score for over an hour of continuous work',
    icon: '💎',
    tier: 'diamond',
    category: 'Flow',
    condition: 'Score 95+ for 60 min',
    target: 3600,
    xpReward: 500,
  },
  {
    id: 'state-of-flow',
    title: 'State of Flow',
    description: 'Complete 25 flow sessions with zero micro-hops',
    icon: '🌪️',
    tier: 'diamond',
    category: 'Flow',
    condition: '25 clean flow bursts',
    target: 25,
    xpReward: 600,
  },
  {
    id: 'mindful-artisan',
    title: 'Mindful Artisan',
    description: 'Achieve 3 hours of cumulative flow in one day',
    icon: '🎨',
    tier: 'diamond',
    category: 'Flow',
    condition: '3 hours in FLOW state',
    target: 10800,
    xpReward: 750,
  },
  {
    id: 'grandmaster-focus',
    title: 'Grandmaster of Flow',
    description: 'Unbroken 90+ attention score across 5 consecutive hours',
    icon: '👑',
    tier: 'master',
    category: 'Flow',
    condition: '5 unbroken hours of high attention',
    target: 18000,
    xpReward: 1500,
  },

  // ─── 2. Deep Work (10 badges) ─────────────────────────────────
  {
    id: 'deep-initiate',
    title: 'Deep Initiate',
    description: 'Complete your first 10-minute deep work block',
    icon: '🎯',
    tier: 'bronze',
    category: 'Deep Work',
    condition: '10 min single app session',
    target: 600,
    xpReward: 30,
  },
  {
    id: 'focus-sprint',
    title: 'Focus Sprint',
    description: 'Complete a single 25-minute Pomodoro burst',
    icon: '⏱️',
    tier: 'bronze',
    category: 'Deep Work',
    condition: '25 min deep work burst',
    target: 1500,
    xpReward: 60,
  },
  {
    id: 'code-monk',
    title: 'Code Monk',
    description: 'Spend 45 continuous minutes in an IDE or editor',
    icon: '💻',
    tier: 'silver',
    category: 'Deep Work',
    condition: '45 min continuous development',
    target: 2700,
    xpReward: 120,
  },
  {
    id: 'deep-architect',
    title: 'Deep Architect',
    description: 'Accumulate 1 hour of deep work in a day',
    icon: '🏗️',
    tier: 'silver',
    category: 'Deep Work',
    condition: '1 hour cumulative deep work',
    target: 3600,
    xpReward: 150,
  },
  {
    id: 'two-hour-titan',
    title: 'Two-Hour Titan',
    description: 'Log 2 hours of cumulative deep work in one day',
    icon: '⚔️',
    tier: 'silver',
    category: 'Deep Work',
    condition: '2 hours cumulative deep work',
    target: 7200,
    xpReward: 200,
  },
  {
    id: 'deep-marathon',
    title: 'Deep Marathon',
    description: 'Accumulate 4 hours of deep work in a single day',
    icon: '🏆',
    tier: 'gold',
    category: 'Deep Work',
    condition: '4 hours cumulative deep work',
    target: 14400,
    xpReward: 350,
  },
  {
    id: 'hyperfocus-hero',
    title: 'Hyperfocus Hero',
    description: 'Maintain continuous focus on a single document for 90 minutes',
    icon: '📜',
    tier: 'gold',
    category: 'Deep Work',
    condition: '90 min single document',
    target: 5400,
    xpReward: 400,
  },
  {
    id: 'six-hour-syndicate',
    title: 'Deep Work Syndicate',
    description: 'Rack up 6 hours of verified deep work in a day',
    icon: '🌌',
    tier: 'diamond',
    category: 'Deep Work',
    condition: '6 hours cumulative deep work',
    target: 21600,
    xpReward: 700,
  },
  {
    id: 'deep-legend',
    title: 'Deep Work Legend',
    description: 'Surpass 8 hours of deep work in a single day',
    icon: '💎',
    tier: 'diamond',
    category: 'Deep Work',
    condition: '8 hours cumulative deep work',
    target: 28800,
    xpReward: 1000,
  },
  {
    id: 'zenith-creator',
    title: 'Zenith Creator',
    description: 'Achieve 40 hours of deep work within a single week',
    icon: '🔱',
    tier: 'master',
    category: 'Deep Work',
    condition: '40 hours weekly deep work',
    target: 144000,
    xpReward: 2000,
  },

  // ─── 3. Discipline & Anti-Distraction (10 badges) ─────────────
  {
    id: 'no-hop-bronze',
    title: 'Temptation Resister',
    description: 'Work for 30 minutes with zero micro-hops (<15s distractions)',
    icon: '🛡️',
    tier: 'bronze',
    category: 'Discipline',
    condition: '30 min without micro-hops',
    target: 1800,
    xpReward: 40,
  },
  {
    id: 'no-hop-silver',
    title: 'Focus Sentinel',
    description: 'Work for 1 hour without a single micro-hop',
    icon: '🏰',
    tier: 'silver',
    category: 'Discipline',
    condition: '60 min without micro-hops',
    target: 3600,
    xpReward: 100,
  },
  {
    id: 'social-detox-short',
    title: 'Feed Filter',
    description: 'Zero social media visits for 2 continuous hours of work',
    icon: '📵',
    tier: 'bronze',
    category: 'Discipline',
    condition: '2 hours no social media',
    target: 7200,
    xpReward: 50,
  },
  {
    id: 'social-detox-gold',
    title: 'Social Media Detox',
    description: 'Go a full day with zero social media activity',
    icon: '🧹',
    tier: 'gold',
    category: 'Discipline',
    condition: 'Full day zero social media',
    target: 1,
    xpReward: 300,
  },
  {
    id: 'low-switch-hour',
    title: 'Calm Waters',
    description: 'Keep app switches below 6 in a single hour',
    icon: '🛶',
    tier: 'silver',
    category: 'Discipline',
    condition: '<6 switches/hour',
    target: 1,
    xpReward: 90,
  },
  {
    id: 'tab-disciplinarian',
    title: 'Tab Disciplinarian',
    description: 'Maintain less than 10% micro-hop ratio over 3 hours',
    icon: '📐',
    tier: 'silver',
    category: 'Discipline',
    condition: '<10% micro-hop ratio for 3 hrs',
    target: 10800,
    xpReward: 150,
  },
  {
    id: 'iron-will',
    title: 'Iron Will',
    description: 'Survive a 3-hour session with zero rapid back-and-forth hops',
    icon: '⛓️',
    tier: 'gold',
    category: 'Discipline',
    condition: '3 hours without rapid toggling',
    target: 10800,
    xpReward: 250,
  },
  {
    id: 'monk-mode',
    title: 'Monk Mode',
    description: 'Maintain strict single-tasking for 4 consecutive hours',
    icon: '🥋',
    tier: 'diamond',
    category: 'Discipline',
    condition: '4 hours strict single-tasking',
    target: 14400,
    xpReward: 600,
  },
  {
    id: 'distraction-shield',
    title: 'Distraction Forcefield',
    description: 'Keep micro-hop ratio under 5% over an entire 8-hour workday',
    icon: '🔮',
    tier: 'diamond',
    category: 'Discipline',
    condition: '<5% micro hops over 8 hours',
    target: 28800,
    xpReward: 800,
  },
  {
    id: 'unshakeable-mind',
    title: 'Unshakeable Mind',
    description: 'Zero alerts triggered and zero micro-hops for 6 straight hours',
    icon: '🗿',
    tier: 'master',
    category: 'Discipline',
    condition: '6 hours perfect discipline',
    target: 21600,
    xpReward: 1800,
  },

  // ─── 4. Speed & Agility (10 badges) ───────────────────────────
  {
    id: 'smooth-transition',
    title: 'Smooth Operator',
    description: 'Transition directly between two deep work apps without straying',
    icon: '🔄',
    tier: 'bronze',
    category: 'Speed',
    condition: 'Direct productive switch',
    target: 1,
    xpReward: 30,
  },
  {
    id: 'pipeline-runner',
    title: 'Pipeline Runner',
    description: 'Complete 10 intentional workflow transitions in a day',
    icon: '⚡',
    tier: 'silver',
    category: 'Speed',
    condition: '10 intentional switches',
    target: 10,
    xpReward: 80,
  },
  {
    id: 'clean-dock',
    title: 'Clean Dock',
    description: 'Use only 3 primary applications over a 2-hour span',
    icon: '🧼',
    tier: 'bronze',
    category: 'Speed',
    condition: '<=3 apps in 2 hours',
    target: 7200,
    xpReward: 60,
  },
  {
    id: 'dual-pilot',
    title: 'Dual Pilot',
    description: 'Master a clean 2-app cycle (e.g. IDE & Browser) for 1 hour',
    icon: '👥',
    tier: 'silver',
    category: 'Speed',
    condition: 'Balanced 2-app pairing',
    target: 3600,
    xpReward: 110,
  },
  {
    id: 'quick-recovery',
    title: 'Quick Recovery',
    description: 'Recover to Flow state within 2 minutes after an interruption',
    icon: '🩹',
    tier: 'silver',
    category: 'Speed',
    condition: 'Rapid focus recovery',
    target: 1,
    xpReward: 120,
  },
  {
    id: 'velocity-moderator',
    title: 'Pacing Maestro',
    description: 'Keep switch velocity under 3 switches/min during active research',
    icon: '🎼',
    tier: 'gold',
    category: 'Speed',
    condition: 'Controlled research pace',
    target: 1800,
    xpReward: 200,
  },
  {
    id: 'swift-coder',
    title: 'Swift Coder',
    description: 'Spend 90% of a 2-hour window in Development apps',
    icon: '⌨️',
    tier: 'gold',
    category: 'Speed',
    condition: '90%+ development time',
    target: 7200,
    xpReward: 250,
  },
  {
    id: 'laser-researcher',
    title: 'Laser Researcher',
    description: 'Conduct 45 minutes of reading with average attention span > 3m',
    icon: '🔬',
    tier: 'gold',
    category: 'Speed',
    condition: '>3 min mean span in Research',
    target: 2700,
    xpReward: 260,
  },
  {
    id: 'fluid-orchestrator',
    title: 'Fluid Orchestrator',
    description: 'Execute 50 productive cross-app transitions in a workday',
    icon: '🎻',
    tier: 'diamond',
    category: 'Speed',
    condition: '50 intentional switches',
    target: 50,
    xpReward: 500,
  },
  {
    id: 'synapse-master',
    title: 'Synapse Master',
    description: 'Achieve zero context-switch fatigue across a full 10-hour day',
    icon: '🧠',
    tier: 'master',
    category: 'Speed',
    condition: '10 hrs flawless switching velocity',
    target: 36000,
    xpReward: 1600,
  },

  // ─── 5. Streaks, Habits & Endurance (10 badges) ───────────────
  {
    id: 'day-one',
    title: 'Day One',
    description: 'Complete your first tracked day with Attn',
    icon: '🌱',
    tier: 'bronze',
    category: 'Streaks',
    condition: 'Track first full day',
    target: 1,
    xpReward: 20,
  },
  {
    id: 'three-peat',
    title: 'Three-Peat',
    description: 'Achieve 3 consecutive days of 60+ attention score',
    icon: '🔥',
    tier: 'bronze',
    category: 'Streaks',
    condition: '3-day streak',
    target: 3,
    xpReward: 75,
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day focus streak above 60 attention score',
    icon: '📅',
    tier: 'silver',
    category: 'Streaks',
    condition: '7-day streak',
    target: 7,
    xpReward: 200,
  },
  {
    id: 'fortnight-fortress',
    title: 'Fortnight Fortress',
    description: 'Sustain a 14-day streak of disciplined daily focus',
    icon: '🏰',
    tier: 'silver',
    category: 'Streaks',
    condition: '14-day streak',
    target: 14,
    xpReward: 350,
  },
  {
    id: 'month-of-mind',
    title: 'Month of Mind',
    description: 'Maintain a 30-day streak with daily deep work',
    icon: '🗓️',
    tier: 'gold',
    category: 'Streaks',
    condition: '30-day streak',
    target: 30,
    xpReward: 600,
  },
  {
    id: 'sixty-day-sage',
    title: 'Sixty-Day Sage',
    description: 'Log 60 consecutive days of mindful digital attention',
    icon: '🌲',
    tier: 'gold',
    category: 'Streaks',
    condition: '60-day streak',
    target: 60,
    xpReward: 900,
  },
  {
    id: 'century-streak',
    title: 'Century Streak',
    description: 'Reach an extraordinary 100-day active tracking streak',
    icon: '💯',
    tier: 'diamond',
    category: 'Streaks',
    condition: '100-day streak',
    target: 100,
    xpReward: 1500,
  },
  {
    id: 'endurance-runner',
    title: 'Endurance Runner',
    description: 'Track over 500 total hours of computer activity',
    icon: '🏃',
    tier: 'diamond',
    category: 'Streaks',
    condition: '500 tracked hours',
    target: 1800000,
    xpReward: 1200,
  },
  {
    id: 'deep-work-century',
    title: '100-Hour Deep Work',
    description: 'Accumulate 100 total hours of deep work in Attn',
    icon: '⏳',
    tier: 'diamond',
    category: 'Streaks',
    condition: '100 hours deep work',
    target: 360000,
    xpReward: 1400,
  },
  {
    id: 'immortal-focus',
    title: 'Immortal Focus',
    description: 'Achieve a 365-day streak of mindful digital performance',
    icon: '🌟',
    tier: 'master',
    category: 'Streaks',
    condition: '365-day streak',
    target: 365,
    xpReward: 3000,
  },

  // ─── 6. Special & Milestones (10 badges) ──────────────────────
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Begin a deep work session before 7:00 AM',
    icon: '🌅',
    tier: 'bronze',
    category: 'Special',
    condition: 'Active deep work before 7 AM',
    target: 1,
    xpReward: 40,
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Conduct a productive 45-minute deep session past midnight',
    icon: '🦉',
    tier: 'bronze',
    category: 'Special',
    condition: 'Deep work past 12:00 AM',
    target: 1,
    xpReward: 40,
  },
  {
    id: 'weekend-craftsman',
    title: 'Weekend Craftsman',
    description: 'Log 2 hours of creative deep work on a Saturday or Sunday',
    icon: '🛠️',
    tier: 'silver',
    category: 'Special',
    condition: 'Weekend deep session',
    target: 7200,
    xpReward: 100,
  },
  {
    id: 'perfect-century',
    title: 'Century Club',
    description: 'Achieve a perfect 100 Attention Score',
    icon: '🎯',
    tier: 'gold',
    category: 'Special',
    condition: 'Reach 100 attention score',
    target: 100,
    xpReward: 300,
  },
  {
    id: 'data-sovereign',
    title: 'Data Sovereign',
    description: 'Export your private offline attention metrics backup',
    icon: '💾',
    tier: 'bronze',
    category: 'Special',
    condition: 'Export your data once',
    target: 1,
    xpReward: 50,
  },
  {
    id: 'hud-master',
    title: 'HUD Commander',
    description: 'Work with the Floating Attention Meter active for 2 hours',
    icon: '🪟',
    tier: 'silver',
    category: 'Special',
    condition: '2 hours HUD usage',
    target: 7200,
    xpReward: 120,
  },
  {
    id: 'rule-tailor',
    title: 'Rule Tailor',
    description: 'Customize category rules in settings to match your workflow',
    icon: '⚙️',
    tier: 'bronze',
    category: 'Special',
    condition: 'Add custom categorization rule',
    target: 1,
    xpReward: 30,
  },
  {
    id: 'deep-work-zenith',
    title: 'Unbreakable Will',
    description: 'Maintain focus across 12 hours of total tracked productivity',
    icon: '🛡️',
    tier: 'diamond',
    category: 'Special',
    condition: '12 hours in a single day',
    target: 43200,
    xpReward: 800,
  },
  {
    id: 'apex-achiever',
    title: 'Apex Achiever',
    description: 'Unlock 30 different badges in Attn',
    icon: '🌠',
    tier: 'diamond',
    category: 'Special',
    condition: 'Unlock 30 badges',
    target: 30,
    xpReward: 1000,
  },
  {
    id: 'transcendence',
    title: 'Mind Transcendence',
    description: 'Achieve Player Level 50 through consistent digital mastery',
    icon: '🌌',
    tier: 'master',
    category: 'Special',
    condition: 'Reach Player Level 50',
    target: 50,
    xpReward: 2500,
  },
];

// ─── 40 Challenges (20 Daily, 10 Weekly, 10 Mastery) ────────────

export function generateAllChallenges(): Challenge[] {
  const now = new Date();
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();
  const endOfWeek = new Date(now.getTime() + (7 - now.getDay()) * 86400000).getTime();
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).getTime();

  return [
    // ─── 20 Daily Challenges ────────────────────────────────────
    {
      id: 'd-1h-deep',
      title: '1-Hour Deep Work',
      description: 'Accumulate 60 minutes of deep work today',
      icon: '🎯',
      type: 'daily',
      category: 'Deep Work',
      target: 3600,
      current: 0,
      unit: 'seconds',
      expiresAt: endOfDay,
      reward: '+50 XP',
    },
    {
      id: 'd-micro-under-15',
      title: 'Discipline Sprint',
      description: 'Keep your micro-hop ratio under 15% today',
      icon: '🛡️',
      type: 'daily',
      category: 'Discipline',
      target: 15,
      current: 0,
      unit: '%',
      expiresAt: endOfDay,
      reward: '+35 XP',
    },
    {
      id: 'd-score-80',
      title: 'Score 80+ Standard',
      description: 'Reach and hold an attention score of 80 or higher',
      icon: '📈',
      type: 'daily',
      category: 'Flow',
      target: 80,
      current: 0,
      unit: 'score',
      expiresAt: endOfDay,
      reward: '+45 XP',
    },
    {
      id: 'd-single-burst-30',
      title: '30-Minute Marathon Block',
      description: 'Complete an uninterrupted 30-minute burst on a single task',
      icon: '🔬',
      type: 'daily',
      category: 'Deep Work',
      target: 1800,
      current: 0,
      unit: 'seconds',
      expiresAt: endOfDay,
      reward: '+60 XP',
    },
    {
      id: 'd-flow-state-2x',
      title: 'Double Flow',
      description: 'Enter FLOW state at least twice today',
      icon: '⚡',
      type: 'daily',
      category: 'Flow',
      target: 2,
      current: 0,
      unit: 'times',
      expiresAt: endOfDay,
      reward: '+40 XP',
    },
    {
      id: 'd-zero-social-morning',
      title: 'Morning Media Fast',
      description: 'Zero social media visits before 1:00 PM',
      icon: '📵',
      type: 'daily',
      category: 'Discipline',
      target: 1,
      current: 0,
      unit: 'day',
      expiresAt: endOfDay,
      reward: '+40 XP',
    },
    {
      id: 'd-mean-span-3m',
      title: '3-Minute Attention Span',
      description: 'Raise your average attention span above 180 seconds today',
      icon: '⏱️',
      type: 'daily',
      category: 'Productivity',
      target: 180,
      current: 0,
      unit: 'seconds',
      expiresAt: endOfDay,
      reward: '+50 XP',
    },
    {
      id: 'd-dev-2h',
      title: 'Developer Deep Dive',
      description: 'Log at least 2 hours in development tools or code editors',
      icon: '💻',
      type: 'daily',
      category: 'Productivity',
      target: 7200,
      current: 0,
      unit: 'seconds',
      expiresAt: endOfDay,
      reward: '+65 XP',
    },
    {
      id: 'd-low-switch-pace',
      title: 'Calm Pace',
      description: 'Keep total switches under 12 per hour today',
      icon: '🕊️',
      type: 'daily',
      category: 'Speed',
      target: 12,
      current: 0,
      unit: 'switches/hr',
      expiresAt: endOfDay,
      reward: '+40 XP',
    },
    {
      id: 'd-clean-start',
      title: 'Clean Launch',
      description: 'Start your first focus session within 10 minutes of opening your Mac',
      icon: '🚀',
      type: 'daily',
      category: 'Discipline',
      target: 1,
      current: 0,
      unit: 'completion',
      expiresAt: endOfDay,
      reward: '+30 XP',
    },
    {
      id: 'd-power-hour',
      title: 'Power Hour',
      description: 'Complete 50 continuous minutes of active deep work in a single hour',
      icon: '🔋',
      type: 'daily',
      category: 'Deep Work',
      target: 3000,
      current: 0,
      unit: 'seconds',
      expiresAt: endOfDay,
      reward: '+55 XP',
    },
    {
      id: 'd-score-90-peak',
      title: 'Peak Performer',
      description: 'Peak above 90 Attention Score for at least 15 minutes',
      icon: '🏔️',
      type: 'daily',
      category: 'Flow',
      target: 900,
      current: 0,
      unit: 'seconds',
      expiresAt: endOfDay,
      reward: '+50 XP',
    },
    {
      id: 'd-zero-fragmentation',
      title: 'Zero Fragmentation Alert',
      description: 'Complete the entire day without triggering a Fragmentation alert',
      icon: '🛡️',
      type: 'daily',
      category: 'Discipline',
      target: 1,
      current: 0,
      unit: 'clean day',
      expiresAt: endOfDay,
      reward: '+60 XP',
    },
    {
      id: 'd-afternoon-surge',
      title: 'Afternoon Surge',
      description: 'Log 45 minutes of deep work between 2:00 PM and 5:00 PM',
      icon: '☀️',
      type: 'daily',
      category: 'Deep Work',
      target: 2700,
      current: 0,
      unit: 'seconds',
      expiresAt: endOfDay,
      reward: '+45 XP',
    },
    {
      id: 'd-research-reading',
      title: 'Deep Reading Block',
      description: 'Spend 30 minutes in research, documentation, or study',
      icon: '📚',
      type: 'daily',
      category: 'Productivity',
      target: 1800,
      current: 0,
      unit: 'seconds',
      expiresAt: endOfDay,
      reward: '+40 XP',
    },
    {
      id: 'd-single-app-focus',
      title: 'Single App Mastery',
      description: 'Keep 70% of today’s active time on your top application',
      icon: '🎯',
      type: 'daily',
      category: 'Discipline',
      target: 70,
      current: 0,
      unit: '%',
      expiresAt: endOfDay,
      reward: '+50 XP',
    },
    {
      id: 'd-mindful-switching',
      title: 'Mindful Switches',
      description: 'Log 20 intentional, non-distractive application switches',
      icon: '🔀',
      type: 'daily',
      category: 'Speed',
      target: 20,
      current: 0,
      unit: 'switches',
      expiresAt: endOfDay,
      reward: '+35 XP',
    },
    {
      id: 'd-streak-builder',
      title: 'Streak Keeper',
      description: 'Achieve at least 60 attention score to maintain your active streak',
      icon: '🔥',
      type: 'daily',
      category: 'Streaks',
      target: 60,
      current: 0,
      unit: 'score',
      expiresAt: endOfDay,
      reward: '+30 XP',
    },
    {
      id: 'd-evening-wrapup',
      title: 'Clean Wrap-Up',
      description: 'End the workday with a 20-minute uninterrupted planning block',
      icon: '🌇',
      type: 'daily',
      category: 'Deep Work',
      target: 1200,
      current: 0,
      unit: 'seconds',
      expiresAt: endOfDay,
      reward: '+40 XP',
    },
    {
      id: 'd-four-hour-club',
      title: '4-Hour Daily Titan',
      description: 'Record 4 full hours of combined deep work and productive flow',
      icon: '👑',
      type: 'daily',
      category: 'Deep Work',
      target: 14400,
      current: 0,
      unit: 'seconds',
      expiresAt: endOfDay,
      reward: '+80 XP',
    },

    // ─── 10 Weekly Challenges ───────────────────────────────────
    {
      id: 'w-15h-deep',
      title: '15-Hour Deep Work Sprint',
      description: 'Accumulate 15 total hours of deep work this week',
      icon: '🏆',
      type: 'weekly',
      category: 'Deep Work',
      target: 54000,
      current: 0,
      unit: 'seconds',
      expiresAt: endOfWeek,
      reward: '+200 XP',
    },
    {
      id: 'w-perfect-5day-streak',
      title: 'Workweek Flawless Streak',
      description: 'Maintain 5 consecutive weekdays with 70+ attention score',
      icon: '📅',
      type: 'weekly',
      category: 'Streaks',
      target: 5,
      current: 0,
      unit: 'days',
      expiresAt: endOfWeek,
      reward: '+250 XP',
    },
    {
      id: 'w-sub-10-micro',
      title: 'Sub-10% Distraction Week',
      description: 'Keep your cumulative micro-hop ratio under 10% for the week',
      icon: '🛡️',
      type: 'weekly',
      category: 'Discipline',
      target: 10,
      current: 0,
      unit: '%',
      expiresAt: endOfWeek,
      reward: '+180 XP',
    },
    {
      id: 'w-flow-25x',
      title: '25 Flow Milestones',
      description: 'Reach Flow state 25 times over the course of the week',
      icon: '🌊',
      type: 'weekly',
      category: 'Flow',
      target: 25,
      current: 0,
      unit: 'sessions',
      expiresAt: endOfWeek,
      reward: '+220 XP',
    },
    {
      id: 'w-10-pomodoro-blocks',
      title: 'Decathlon Focus',
      description: 'Complete 10 unbroken 45-minute focus blocks this week',
      icon: '🏅',
      type: 'weekly',
      category: 'Deep Work',
      target: 10,
      current: 0,
      unit: 'blocks',
      expiresAt: endOfWeek,
      reward: '+240 XP',
    },
    {
      id: 'w-social-diet',
      title: 'Social Media Diet',
      description: 'Limit total social media usage to under 1 hour for the entire week',
      icon: '⚖️',
      type: 'weekly',
      category: 'Discipline',
      target: 3600,
      current: 0,
      unit: 'seconds',
      expiresAt: endOfWeek,
      reward: '+200 XP',
    },
    {
      id: 'w-code-forge',
      title: 'The Code Forge',
      description: 'Spend 12 hours actively writing code and building projects',
      icon: '⚒️',
      type: 'weekly',
      category: 'Productivity',
      target: 43200,
      current: 0,
      unit: 'seconds',
      expiresAt: endOfWeek,
      reward: '+260 XP',
    },
    {
      id: 'w-velocity-master',
      title: 'Velocity Optimizer',
      description: 'Keep context switch velocity under 5 switches/min every day',
      icon: '🚄',
      type: 'weekly',
      category: 'Speed',
      target: 5,
      current: 0,
      unit: 'days',
      expiresAt: endOfWeek,
      reward: '+175 XP',
    },
    {
      id: 'w-consistent-hours',
      title: 'Consistent Rhythm',
      description: 'Log at least 3 hours of tracked computer work each day for 6 days',
      icon: '🕰️',
      type: 'weekly',
      category: 'Streaks',
      target: 6,
      current: 0,
      unit: 'days',
      expiresAt: endOfWeek,
      reward: '+210 XP',
    },
    {
      id: 'w-master-grandmaster',
      title: 'Weekly Grand Champion',
      description: 'Surpass 25 hours of productive output in a single 7-day period',
      icon: '💎',
      type: 'weekly',
      category: 'Deep Work',
      target: 90000,
      current: 0,
      unit: 'seconds',
      expiresAt: endOfWeek,
      reward: '+350 XP',
    },

    // ─── 10 Mastery Milestones ──────────────────────────────────
    {
      id: 'm-50h-deep-work',
      title: '50-Hour Deep Work Milestone',
      description: 'Surpass 50 cumulative hours of verified deep work',
      icon: '🏔️',
      type: 'mastery',
      category: 'Deep Work',
      target: 180000,
      current: 0,
      unit: 'seconds',
      expiresAt: endOfMonth,
      reward: '+500 XP & Silver Halo',
    },
    {
      id: 'm-30-day-streak',
      title: 'Iron Month Streak',
      description: 'Maintain a 30-day continuous attention tracking streak',
      icon: '🛡️',
      type: 'mastery',
      category: 'Streaks',
      target: 30,
      current: 0,
      unit: 'days',
      expiresAt: endOfMonth,
      reward: '+750 XP & Badge',
    },
    {
      id: 'm-100-flow-sessions',
      title: 'Centurion of Flow',
      description: 'Achieve 100 logged FLOW state activations',
      icon: '⚡',
      type: 'mastery',
      category: 'Flow',
      target: 100,
      current: 0,
      unit: 'sessions',
      expiresAt: endOfMonth,
      reward: '+600 XP & Title',
    },
    {
      id: 'm-score-90-marathon',
      title: 'Zen Master Endurance',
      description: 'Accumulate 20 total hours with attention score above 90',
      icon: '🧘',
      type: 'mastery',
      category: 'Flow',
      target: 72000,
      current: 0,
      unit: 'seconds',
      expiresAt: endOfMonth,
      reward: '+800 XP',
    },
    {
      id: 'm-zero-distraction-titan',
      title: 'Zero-Distraction Titan',
      description: 'Log 10 full workdays with micro-hop ratio under 8%',
      icon: '💎',
      type: 'mastery',
      category: 'Discipline',
      target: 10,
      current: 0,
      unit: 'days',
      expiresAt: endOfMonth,
      reward: '+650 XP',
    },
    {
      id: 'm-deep-developer-100h',
      title: 'Architect of Code',
      description: 'Record 100 cumulative hours in IDEs and terminals',
      icon: '🏛️',
      type: 'mastery',
      category: 'Productivity',
      target: 360000,
      current: 0,
      unit: 'seconds',
      expiresAt: endOfMonth,
      reward: '+900 XP',
    },
    {
      id: 'm-1000-transitions',
      title: 'Fluid Operator',
      description: 'Complete 1,000 smooth context transitions without fatigue',
      icon: '🌐',
      type: 'mastery',
      category: 'Speed',
      target: 1000,
      current: 0,
      unit: 'transitions',
      expiresAt: endOfMonth,
      reward: '+550 XP',
    },
    {
      id: 'm-all-categories-mastered',
      title: 'Polymath Focus',
      description: 'Spend at least 10 hours in Development, Deep Work, and Research',
      icon: '🎨',
      type: 'mastery',
      category: 'Productivity',
      target: 3,
      current: 0,
      unit: 'disciplines',
      expiresAt: endOfMonth,
      reward: '+700 XP',
    },
    {
      id: 'm-level-25',
      title: 'Master Rank Level 25',
      description: 'Reach player Level 25 through focused productivity',
      icon: '👑',
      type: 'mastery',
      category: 'Streaks',
      target: 25,
      current: 0,
      unit: 'level',
      expiresAt: endOfMonth,
      reward: '+1000 XP & Title',
    },
    {
      id: 'm-legendary-perfection',
      title: 'Legendary Digital Ascendant',
      description: 'Complete 25 challenges and unlock 30 badges in Attn',
      icon: '🌌',
      type: 'mastery',
      category: 'Special',
      target: 55,
      current: 0,
      unit: 'unlocks',
      expiresAt: endOfMonth,
      reward: '+2000 XP & Grand Crown',
    },
  ];
}

// ─── Default State Factory & Migration ─────────────────────────────

export function createDefaultAchievementData(): AchievementData {
  return {
    achievements: BADGE_DEFINITIONS.map(def => ({
      ...def,
      progress: 0,
      current: 0,
      unlockedAt: undefined,
    })),
    challenges: generateAllChallenges(),
    totalXP: 0,
    level: 1,
    streak: 1,
  };
}

export function syncAchievementData(existing?: AchievementData | null): AchievementData {
  const defaultData = createDefaultAchievementData();
  if (!existing || typeof existing !== 'object') {
    return defaultData;
  }

  const existingAchMap = new Map<string, Achievement>();
  if (Array.isArray(existing.achievements)) {
    for (const a of existing.achievements) {
      if (a && a.id) existingAchMap.set(a.id, a);
    }
  }

  const existingChMap = new Map<string, Challenge>();
  if (Array.isArray(existing.challenges)) {
    for (const c of existing.challenges) {
      if (c && c.id) existingChMap.set(c.id, c);
    }
  }

  // Merge achievements: ensure all 60 badge definitions exist
  const mergedAchievements: Achievement[] = BADGE_DEFINITIONS.map(def => {
    const prev = existingAchMap.get(def.id);
    return {
      ...def,
      progress: prev ? prev.progress : 0,
      current: prev ? prev.current : 0,
      unlockedAt: prev ? prev.unlockedAt : undefined,
    };
  });

  // Merge challenges: ensure all 40 challenge templates exist
  const allChallengeTemplates = generateAllChallenges();
  const mergedChallenges: Challenge[] = allChallengeTemplates.map(tmpl => {
    const prev = existingChMap.get(tmpl.id);
    return {
      ...tmpl,
      current: prev ? prev.current : 0,
      completedAt: prev ? prev.completedAt : undefined,
    };
  });

  return {
    achievements: mergedAchievements,
    challenges: mergedChallenges,
    totalXP: typeof existing.totalXP === 'number' ? existing.totalXP : 0,
    level: typeof existing.level === 'number' ? existing.level : 1,
    streak: typeof existing.streak === 'number' ? existing.streak : 1,
  };
}

// ─── Evaluation Engine ───────────────────────────────────────────

export function evaluateAchievements(
  data: AchievementData,
  metrics: AttentionMetrics,
  sessions: SessionBurst[]
): { updated: AchievementData; newlyUnlocked: Achievement[] } {
  const newlyUnlocked: Achievement[] = [];
  const now = Date.now();

  const isFlow = metrics.attentionState === 'FLOW';
  const score = metrics.attentionScore || 0;
  const deepWorkSec = metrics.deepWorkDurationSec || 0;
  const totalTrackedSec = metrics.totalTrackedDurationSec || 0;
  const microHopRatio = metrics.microHopsRatio || 0;
  const streakSec = metrics.currentStreakSec || 0;
  const switchesToday = metrics.totalSwitchesToday || 0;

  // Compute longest session and category sums
  let longestSessionSec = 0;
  let devSec = 0;
  let socialSec = 0;
  let flowSessionCount = 0;

  for (const s of sessions) {
    if (s.durationSec > longestSessionSec) longestSessionSec = s.durationSec;
    if (s.category === 'Development') devSec += s.durationSec;
    if (s.category === 'Social Media') socialSec += s.durationSec;
    if (s.attentionState === 'FLOW' || s.durationSec >= 600) flowSessionCount++;
  }

  // Update Badges (Achievements)
  const updatedAchievements = data.achievements.map((ach) => {
    if (ach.unlockedAt) return ach; // Already unlocked

    let currentVal = ach.current || 0;

    switch (ach.id) {
      // Flow
      case 'first-flow':
        if (isFlow) currentVal = 1;
        break;
      case 'flow-seeker':
        currentVal = Math.max(currentVal, flowSessionCount);
        break;
      case 'flow-master':
        currentVal = Math.max(currentVal, flowSessionCount);
        break;
      case 'deep-immersion':
        if (isFlow) currentVal = Math.max(currentVal, streakSec);
        break;
      case 'zen-mode':
        if (score >= 90) currentVal = Math.max(currentVal, streakSec);
        break;
      case 'flow-catalyst':
        if (isFlow && streakSec <= 180) currentVal = 1;
        break;
      case 'diamond-focus':
        if (score >= 95) currentVal = Math.max(currentVal, streakSec);
        break;
      case 'state-of-flow':
        currentVal = Math.max(currentVal, flowSessionCount);
        break;
      case 'mindful-artisan':
        currentVal = Math.max(currentVal, deepWorkSec);
        break;
      case 'grandmaster-focus':
        if (score >= 90) currentVal = Math.max(currentVal, totalTrackedSec);
        break;

      // Deep Work
      case 'deep-initiate':
        currentVal = Math.max(currentVal, longestSessionSec);
        break;
      case 'focus-sprint':
        currentVal = Math.max(currentVal, longestSessionSec);
        break;
      case 'code-monk':
        currentVal = Math.max(currentVal, devSec);
        break;
      case 'deep-architect':
      case 'two-hour-titan':
      case 'deep-marathon':
      case 'six-hour-syndicate':
      case 'deep-legend':
      case 'zenith-creator':
        currentVal = Math.max(currentVal, deepWorkSec);
        break;
      case 'hyperfocus-hero':
        currentVal = Math.max(currentVal, longestSessionSec);
        break;

      // Discipline
      case 'no-hop-bronze':
      case 'no-hop-silver':
        if (metrics.microHopsCount === 0) currentVal = Math.max(currentVal, totalTrackedSec);
        break;
      case 'social-detox-short':
        if (socialSec === 0) currentVal = Math.max(currentVal, totalTrackedSec);
        break;
      case 'social-detox-gold':
        if (socialSec === 0 && totalTrackedSec >= 14400) currentVal = 1;
        break;
      case 'low-switch-hour':
        if (metrics.switchesPerHour > 0 && metrics.switchesPerHour < 6) currentVal = 1;
        break;
      case 'tab-disciplinarian':
      case 'distraction-shield':
        if (microHopRatio <= 10) currentVal = Math.max(currentVal, totalTrackedSec);
        break;
      case 'iron-will':
      case 'monk-mode':
      case 'unshakeable-mind':
        if (microHopRatio <= 5) currentVal = Math.max(currentVal, totalTrackedSec);
        break;

      // Speed
      case 'smooth-transition':
        currentVal = Math.min(1, switchesToday);
        break;
      case 'pipeline-runner':
        currentVal = Math.max(currentVal, switchesToday);
        break;
      case 'clean-dock':
        currentVal = Math.max(currentVal, totalTrackedSec);
        break;
      case 'dual-pilot':
        currentVal = Math.max(currentVal, devSec);
        break;
      case 'quick-recovery':
        if (isFlow) currentVal = 1;
        break;
      case 'velocity-moderator':
        if (metrics.recentSwitchVelocity <= 3) currentVal = Math.max(currentVal, streakSec);
        break;
      case 'swift-coder':
        currentVal = Math.max(currentVal, devSec);
        break;
      case 'laser-researcher':
        if (metrics.meanAttentionSpanSec >= 180) currentVal = Math.max(currentVal, totalTrackedSec);
        break;
      case 'fluid-orchestrator':
        currentVal = Math.max(currentVal, switchesToday);
        break;
      case 'synapse-master':
        currentVal = Math.max(currentVal, totalTrackedSec);
        break;

      // Streaks
      case 'day-one':
        currentVal = 1;
        break;
      case 'three-peat':
      case 'week-warrior':
      case 'fortnight-fortress':
      case 'month-of-mind':
      case 'sixty-day-sage':
      case 'century-streak':
      case 'immortal-focus':
        currentVal = Math.max(currentVal, data.streak || 1);
        break;
      case 'endurance-runner':
        currentVal = Math.max(currentVal, totalTrackedSec);
        break;
      case 'deep-work-century':
        currentVal = Math.max(currentVal, deepWorkSec);
        break;

      // Special
      case 'perfect-century':
        if (score >= 100) currentVal = 100;
        break;
      case 'data-sovereign':
      case 'rule-tailor':
      case 'hud-master':
        // Updated via user interaction
        break;
      case 'deep-work-zenith':
        currentVal = Math.max(currentVal, totalTrackedSec);
        break;
      case 'apex-achiever': {
        const unlockedCount = data.achievements.filter(a => a.unlockedAt).length;
        currentVal = unlockedCount;
        break;
      }
      case 'transcendence':
        currentVal = data.level;
        break;
      default:
        break;
    }

    const progress = Math.min(100, Math.round((currentVal / ach.target) * 100));
    const isUnlocked = progress >= 100;

    if (isUnlocked && !ach.unlockedAt) {
      const unlockedAch: Achievement = {
        ...ach,
        current: currentVal,
        progress: 100,
        unlockedAt: now,
      };
      newlyUnlocked.push(unlockedAch);
      return unlockedAch;
    }

    return {
      ...ach,
      current: currentVal,
      progress,
    };
  });

  // Update Challenges
  const updatedChallenges = (data.challenges || generateAllChallenges()).map((ch) => {
    if (ch.completedAt) return ch;

    let current = ch.current || 0;

    switch (ch.id) {
      case 'd-1h-deep':
      case 'd-power-hour':
      case 'd-afternoon-surge':
      case 'd-evening-wrapup':
      case 'd-four-hour-club':
      case 'w-15h-deep':
      case 'm-50h-deep-work':
        current = deepWorkSec;
        break;
      case 'd-micro-under-15':
      case 'w-sub-10-micro':
        current = microHopRatio <= ch.target ? ch.target : microHopRatio;
        break;
      case 'd-score-80':
      case 'd-streak-builder':
        current = score;
        break;
      case 'd-score-90-peak':
        if (score >= 90) current = streakSec;
        break;
      case 'd-single-burst-30':
        current = longestSessionSec;
        break;
      case 'd-flow-state-2x':
      case 'w-flow-25x':
      case 'm-100-flow-sessions':
        current = flowSessionCount;
        break;
      case 'd-mean-span-3m':
        current = metrics.meanAttentionSpanSec || 0;
        break;
      case 'd-dev-2h':
      case 'w-code-forge':
      case 'm-deep-developer-100h':
        current = devSec;
        break;
      case 'd-low-switch-pace':
        current = metrics.switchesPerHour || 0;
        break;
      case 'd-mindful-switching':
      case 'm-1000-transitions':
        current = switchesToday;
        break;
      case 'w-perfect-5day-streak':
      case 'w-consistent-hours':
      case 'm-30-day-streak':
        current = data.streak || 1;
        break;
      case 'm-level-25':
        current = data.level;
        break;
      default:
        break;
    }

    const isCompleted = ch.type === 'daily' && ch.id === 'd-micro-under-15'
      ? (microHopRatio <= 15 && totalTrackedSec >= 1800)
      : (current >= ch.target);

    return {
      ...ch,
      current,
      completedAt: isCompleted ? (ch.completedAt || now) : undefined,
    };
  });

  // Calculate XP gained from newly unlocked achievements
  let totalXP = data.totalXP || 0;
  for (const ach of newlyUnlocked) {
    totalXP += ach.xpReward || 50;
  }

  // Calculate Level (100 XP per level)
  const level = Math.max(1, Math.floor(totalXP / 100) + 1);

  return {
    updated: {
      ...data,
      achievements: updatedAchievements,
      challenges: updatedChallenges,
      totalXP,
      level,
    },
    newlyUnlocked,
  };
}
