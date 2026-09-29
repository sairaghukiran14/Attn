import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Star, 
  Flame, 
  Target, 
  X, 
  Search, 
  Filter, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  Calendar,
  Clock,
  Zap,
  Award
} from 'lucide-react';
import { AchievementData, Achievement, Challenge, AchievementTier, AchievementCategory } from '../types.ts';
import { formatDuration } from '../utils/formatters.ts';
import { useTheme, t } from '../utils/theme.tsx';

interface AchievementsPanelProps {
  data: AchievementData;
  isOpen: boolean;
  onClose: () => void;
}

const TIER_COLORS: Record<AchievementTier, string> = {
  bronze: '#b45309', // Warm bronze
  silver: '#64748b', // Slate silver
  gold: '#d97706',   // Amber gold
  diamond: '#0284c7', // Sapphire diamond
  master: '#7c3aed',  // Royal master purple
};

const CATEGORIES: (AchievementCategory | 'All')[] = [
  'All',
  'Flow',
  'Deep Work',
  'Discipline',
  'Productivity',
  'Streaks',
  'Speed',
  'Special'
];

function TierBadge({ tier }: { tier: AchievementTier }) {
  const color = TIER_COLORS[tier] || '#64748b';
  return (
    <span 
      className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded font-mono"
      style={{ color: color, backgroundColor: color + '15', border: `1px solid ${color}30` }}
    >
      {tier}
    </span>
  );
}

export const AchievementsPanel: React.FC<AchievementsPanelProps> = ({ data, isOpen, onClose }) => {
  const { isDark } = useTheme();
  const c = t(isDark);

  const [activeTab, setActiveTab] = useState<'badges' | 'daily' | 'weekly_mastery'>('badges');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'All'>('All');
  const [tierFilter, setTierFilter] = useState<AchievementTier | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'locked'>('all');

  // Filtered badges
  const filteredBadges = useMemo(() => {
    return (data.achievements || []).filter((ach) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchTitle = ach.title.toLowerCase().includes(query);
        const matchDesc = ach.description.toLowerCase().includes(query);
        const matchCond = ach.condition.toLowerCase().includes(query);
        if (!matchTitle && !matchDesc && !matchCond) return false;
      }
      if (selectedCategory !== 'All' && ach.category !== selectedCategory) return false;
      if (tierFilter !== 'All' && ach.tier !== tierFilter) return false;
      if (statusFilter === 'unlocked' && !ach.unlockedAt) return false;
      if (statusFilter === 'locked' && ach.unlockedAt) return false;
      return true;
    });
  }, [data.achievements, searchQuery, selectedCategory, tierFilter, statusFilter]);

  // Daily challenges
  const dailyChallenges = useMemo(() => {
    return (data.challenges || []).filter((ch) => ch.type === 'daily');
  }, [data.challenges]);

  // Weekly & Mastery challenges
  const weeklyAndMastery = useMemo(() => {
    return (data.challenges || []).filter((ch) => ch.type === 'weekly' || ch.type === 'mastery');
  }, [data.challenges]);

  if (!isOpen) return null;

  const unlockedCount = (data.achievements || []).filter(a => a.unlockedAt).length;
  const totalBadges = (data.achievements || []).length;
  const completedChallenges = (data.challenges || []).filter(ch => ch.completedAt).length;
  const totalChallenges = (data.challenges || []).length;

  const xpCurrent = (data.totalXP || 0) % 100;
  const level = data.level || 1;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 modal-backdrop-anim"
      style={{ backgroundColor: c.overlay }}
    >
      <div 
        className="w-full max-w-4xl rounded-xl border flex flex-col max-h-[90vh] shadow-2xl overflow-hidden modal-content-anim"
        style={{ backgroundColor: c.surface, borderColor: c.border }}
      >
        {/* Header Banner */}
        <div className="p-4 px-6 border-b flex items-center justify-between" style={{ borderColor: c.border, backgroundColor: c.surfaceAlt }}>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: c.raised, border: `1px solid ${c.border}` }}>
              <Trophy className="w-5 h-5" style={{ color: '#d97706' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold tracking-tight" style={{ color: c.text }}>100 Challenges & Badges</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold" style={{ backgroundColor: c.raised, color: c.textSec, border: `1px solid ${c.border}` }}>
                  {unlockedCount + completedChallenges} / 100 Unlocked
                </span>
              </div>
              <p className="text-xs" style={{ color: c.textMuted }}>
                Gamified attention metrics, focus streaks, and daily mastery challenges
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-md transition-colors"
            style={{ color: c.textMuted }}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Level & XP Overview Bar */}
        <div className="px-6 py-3 border-b grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs" style={{ borderColor: c.border, backgroundColor: c.bg }}>
          <div>
            <div className="text-[10px] font-medium" style={{ color: c.textDim }}>PLAYER LEVEL</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Star className="w-3.5 h-3.5 fill-current" style={{ color: c.accent }} />
              <span className="font-bold font-mono text-sm" style={{ color: c.text }}>Level {level}</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-medium" style={{ color: c.textDim }}>TOTAL EXPERIENCE</div>
            <div className="font-bold font-mono text-sm mt-0.5" style={{ color: c.accent }}>
              {data.totalXP || 0} XP
            </div>
            <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1 mt-1 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${xpCurrent}%`, backgroundColor: c.accent }} />
            </div>
          </div>

          <div>
            <div className="text-[10px] font-medium" style={{ color: c.textDim }}>BADGES UNLOCKED</div>
            <div className="font-bold font-mono text-sm mt-0.5" style={{ color: c.text }}>
              {unlockedCount} <span className="text-xs font-normal" style={{ color: c.textMuted }}>/ {totalBadges}</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-medium" style={{ color: c.textDim }}>CHALLENGES COMPLETED</div>
            <div className="font-bold font-mono text-sm mt-0.5" style={{ color: c.text }}>
              {completedChallenges} <span className="text-xs font-normal" style={{ color: c.textMuted }}>/ {totalChallenges}</span>
            </div>
          </div>
        </div>

        {/* Tabs & Search Controls */}
        <div className="px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3" style={{ borderColor: c.border }}>
          {/* Main Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: c.raised }}>
            <button
              onClick={() => setActiveTab('badges')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'badges' ? 'shadow-sm' : ''}`}
              style={{
                backgroundColor: activeTab === 'badges' ? c.surface : 'transparent',
                color: activeTab === 'badges' ? c.text : c.textMuted,
              }}
            >
              Badges ({totalBadges})
            </button>
            <button
              onClick={() => setActiveTab('daily')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'daily' ? 'shadow-sm' : ''}`}
              style={{
                backgroundColor: activeTab === 'daily' ? c.surface : 'transparent',
                color: activeTab === 'daily' ? c.text : c.textMuted,
              }}
            >
              Daily Challenges ({dailyChallenges.length})
            </button>
            <button
              onClick={() => setActiveTab('weekly_mastery')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${activeTab === 'weekly_mastery' ? 'shadow-sm' : ''}`}
              style={{
                backgroundColor: activeTab === 'weekly_mastery' ? c.surface : 'transparent',
                color: activeTab === 'weekly_mastery' ? c.text : c.textMuted,
              }}
            >
              Weekly & Mastery ({weeklyAndMastery.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5" style={{ color: c.textMuted }} />
            <input
              type="text"
              placeholder="Search by title, goal, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-md border outline-none font-sans"
              style={{
                backgroundColor: c.surface,
                borderColor: c.border,
                color: c.text
              }}
            />
          </div>
        </div>

        {/* Sub-Filters for Badges tab */}
        {activeTab === 'badges' && (
          <div className="px-6 py-2.5 border-b flex flex-wrap items-center gap-2 text-xs" style={{ borderColor: c.border, backgroundColor: c.surfaceAlt }}>
            <span className="text-[10px] uppercase font-bold tracking-wider mr-1" style={{ color: c.textDim }}>Category:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-2 py-0.5 rounded text-[11px] font-medium transition-colors"
                style={{
                  backgroundColor: selectedCategory === cat ? c.accent : c.raised,
                  color: selectedCategory === cat ? '#ffffff' : c.textSec,
                }}
              >
                {cat}
              </button>
            ))}

            <div className="ml-auto flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="text-[11px] px-2 py-0.5 rounded border outline-none"
                style={{ backgroundColor: c.surface, borderColor: c.border, color: c.textSec }}
              >
                <option value="all">All Status</option>
                <option value="unlocked">Unlocked Only</option>
                <option value="locked">Locked Only</option>
              </select>

              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value as any)}
                className="text-[11px] px-2 py-0.5 rounded border outline-none"
                style={{ backgroundColor: c.surface, borderColor: c.border, color: c.textSec }}
              >
                <option value="All">All Tiers</option>
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="diamond">Diamond</option>
                <option value="master">Master</option>
              </select>
            </div>
          </div>
        )}

        {/* Tab Content List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[55vh]" style={{ backgroundColor: c.bg }}>
          {/* 1. BADGES TAB (60 Badges) */}
          {activeTab === 'badges' && (
            <div key="tab-badges" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 tab-content-anim">
              {filteredBadges.map((ach) => {
                const isUnlocked = !!ach.unlockedAt;
                const tierColor = TIER_COLORS[ach.tier] || '#64748b';

                return (
                  <div
                    key={ach.id}
                    className="p-3.5 rounded-lg border flex flex-col justify-between smooth-card"
                    style={{
                      backgroundColor: c.surface,
                      borderColor: isUnlocked ? tierColor + '60' : c.border,
                      boxShadow: isUnlocked ? `0 1px 3px ${tierColor}15` : 'none',
                    }}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div 
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                            style={{ 
                              backgroundColor: isUnlocked ? tierColor + '20' : c.raised,
                              opacity: isUnlocked ? 1 : 0.6
                            }}
                          >
                            {ach.icon}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold leading-tight" style={{ color: c.text }}>
                              {ach.title}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <TierBadge tier={ach.tier} />
                              {ach.category && (
                                <span className="text-[9px]" style={{ color: c.textDim }}>
                                  • {ach.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {isUnlocked ? (
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: tierColor }} />
                        ) : (
                          <Lock className="w-3.5 h-3.5 flex-shrink-0" style={{ color: c.textDim }} />
                        )}
                      </div>

                      <p className="text-[11px] leading-relaxed line-clamp-2 mt-1" style={{ color: c.textSec }}>
                        {ach.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t" style={{ borderColor: c.borderSub }}>
                      <div className="flex items-center justify-between text-[10px] mb-1 font-mono">
                        <span style={{ color: c.textDim }}>{ach.condition}</span>
                        <span style={{ color: isUnlocked ? tierColor : c.textMuted }}>
                          {isUnlocked ? 'UNLOCKED' : `${ach.progress}%`}
                        </span>
                      </div>

                      <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${ach.progress}%`,
                            backgroundColor: isUnlocked ? tierColor : c.accent,
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[9px] mt-1.5" style={{ color: c.textDim }}>
                        <span>Reward: +{ach.xpReward || 50} XP</span>
                        {ach.unlockedAt && (
                          <span>{new Date(ach.unlockedAt).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredBadges.length === 0 && (
                <div className="col-span-full py-12 text-center" style={{ color: c.textMuted }}>
                  <Award className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs font-semibold">No badges match your filter criteria.</p>
                </div>
              )}
            </div>
          )}

          {/* 2. DAILY CHALLENGES TAB (20 Challenges) */}
          {activeTab === 'daily' && (
            <div key="tab-daily" className="grid grid-cols-1 sm:grid-cols-2 gap-3 tab-content-anim">
              {dailyChallenges.map((ch) => {
                const isCompleted = !!ch.completedAt;
                const progressPct = Math.min(100, Math.round((ch.current / ch.target) * 100));

                return (
                  <div
                    key={ch.id}
                    className="p-3.5 rounded-lg border flex flex-col justify-between smooth-card"
                    style={{
                      backgroundColor: c.surface,
                      borderColor: isCompleted ? '#34d39960' : c.border,
                      boxShadow: isCompleted ? '0 1px 4px rgba(52,211,153,0.1)' : 'none',
                    }}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{ch.icon}</span>
                          <div>
                            <h4 className="text-xs font-bold" style={{ color: c.text }}>{ch.title}</h4>
                            <span className="text-[9px] font-semibold text-amber-500 uppercase tracking-wider">
                              DAILY CHALLENGE
                            </span>
                          </div>
                        </div>

                        {isCompleted ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Done
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono" style={{ color: c.accent }}>
                            {ch.reward}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] leading-relaxed mt-1" style={{ color: c.textSec }}>
                        {ch.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t" style={{ borderColor: c.borderSub }}>
                      <div className="flex items-center justify-between text-[10px] mb-1 font-mono">
                        <span style={{ color: c.textDim }}>Target: {ch.target} {ch.unit}</span>
                        <span style={{ color: isCompleted ? '#34d399' : c.textSec }}>
                          {progressPct}%
                        </span>
                      </div>

                      <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${progressPct}%`,
                            backgroundColor: isCompleted ? '#34d399' : c.accent,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 3. WEEKLY & MASTERY TAB (20 Challenges) */}
          {activeTab === 'weekly_mastery' && (
            <div key="tab-weekly" className="grid grid-cols-1 sm:grid-cols-2 gap-3 tab-content-anim">
              {weeklyAndMastery.map((ch) => {
                const isCompleted = !!ch.completedAt;
                const progressPct = Math.min(100, Math.round((ch.current / ch.target) * 100));
                const isMastery = ch.type === 'mastery';

                return (
                  <div
                    key={ch.id}
                    className="p-3.5 rounded-lg border flex flex-col justify-between smooth-card"
                    style={{
                      backgroundColor: c.surface,
                      borderColor: isCompleted ? (isMastery ? '#a855f760' : '#38bdf860') : c.border,
                      boxShadow: isCompleted ? `0 1px 4px ${isMastery ? 'rgba(168,85,247,0.1)' : 'rgba(56,189,248,0.1)'}` : 'none',
                    }}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{ch.icon}</span>
                          <div>
                            <h4 className="text-xs font-bold" style={{ color: c.text }}>{ch.title}</h4>
                            <span 
                              className="text-[9px] font-semibold uppercase tracking-wider"
                              style={{ color: isMastery ? '#a855f7' : '#0284c7' }}
                            >
                              {isMastery ? '★ MASTERY MILESTONE' : 'WEEKLY SPRINT'}
                            </span>
                          </div>
                        </div>

                        {isCompleted ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-500 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Done
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono font-bold" style={{ color: isMastery ? '#a855f7' : c.accent }}>
                            {ch.reward}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] leading-relaxed mt-1" style={{ color: c.textSec }}>
                        {ch.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t" style={{ borderColor: c.borderSub }}>
                      <div className="flex items-center justify-between text-[10px] mb-1 font-mono">
                        <span style={{ color: c.textDim }}>Target: {ch.target} {ch.unit}</span>
                        <span style={{ color: isCompleted ? '#34d399' : c.textSec }}>
                          {progressPct}%
                        </span>
                      </div>

                      <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${progressPct}%`,
                            backgroundColor: isCompleted ? '#34d399' : (isMastery ? '#a855f7' : c.accent),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 px-6 border-t flex items-center justify-between text-[11px]" style={{ borderColor: c.border, backgroundColor: c.surfaceAlt, color: c.textMuted }}>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Achievements update automatically as you work and enter flow</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded font-medium transition-colors"
            style={{ backgroundColor: c.raised, color: c.text, border: `1px solid ${c.border}` }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
