import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Achievement } from '../types.ts';
import { useTheme, t } from '../utils/theme.tsx';

interface AchievementToastProps {
  achievement: Achievement | null;
  onDismiss: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onDismiss }) => {
  const { isDark } = useTheme();
  const c = t(isDark);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setVisible(true);
      const timer = setTimeout(() => {
        handleClose();
      }, 2500); // 2.5 seconds auto-dismiss
      return () => clearTimeout(timer);
    }
  }, [achievement]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onDismiss, 250);
  };

  if (!achievement) return null;

  const TIER_COLORS = {
    bronze: '#b45309',
    silver: '#64748b',
    gold: '#d97706',
    diamond: '#0284c7',
    master: '#7c3aed',
  };

  const tierColor = TIER_COLORS[achievement.tier] || '#64748b';

  return (
    <div
      className="fixed top-16 right-4 z-[999] max-w-xs transition-all duration-300 pointer-events-auto"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0) scale(1)' : 'translateX(28px) scale(0.95)',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        className="rounded-xl p-3.5 border shadow-xl relative overflow-hidden"
        style={{
          backgroundColor: c.surface,
          borderColor: tierColor + '50',
          boxShadow: `0 8px 24px ${tierColor}15`,
        }}
      >
        <div className="flex items-start gap-3 pr-6">
          <div 
            className="w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
            style={{ backgroundColor: tierColor + '15' }}
          >
            {achievement.icon}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: tierColor }}>
                Badge Unlocked!
              </span>
            </div>
            <h4 className="font-semibold text-xs leading-snug" style={{ color: c.text }}>
              {achievement.title}
            </h4>
            <p className="text-[11px] mt-0.5 leading-tight line-clamp-2" style={{ color: c.textMuted }}>
              {achievement.description}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2.5 right-2.5 p-1 rounded-md transition-colors hover:bg-neutral-500/10"
          style={{ color: c.textDim }}
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        {/* 2.5s Progress bar animation */}
        <div className="mt-2.5 h-0.5 rounded-full overflow-hidden" style={{ backgroundColor: c.raised }}>
          <div
            className="h-full rounded-full"
            style={{
              backgroundColor: tierColor,
              animation: 'shrink 2.5s linear forwards',
              width: '100%',
            }}
          />
        </div>
      </div>
      <style>{`
        @keyframes shrink { from { width: 100%; } to { width: 0%; } }
      `}</style>
    </div>
  );
};
