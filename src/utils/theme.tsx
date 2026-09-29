import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme } from '../types.ts';

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  toggle: () => {},
  isDark: false,
});

export const useTheme = () => useContext(ThemeContext);

// Color tokens for each theme — components import this
export function t(isDark: boolean) {
  return {
    // Surfaces
    bg:        isDark ? '#0a0a0a' : '#f5f5f5',
    surface:   isDark ? '#111111' : '#ffffff',
    surfaceAlt:isDark ? '#141414' : '#fafafa',
    raised:    isDark ? '#1a1a1a' : '#f0f0f0',
    
    // Borders
    border:    isDark ? '#1a1a1a' : '#e5e5e5',
    borderSub: isDark ? '#1f1f1f' : '#ebebeb',
    borderHov: isDark ? '#262626' : '#d4d4d4',
    borderStr: isDark ? '#333333' : '#c4c4c4',
    
    // Text
    text:      isDark ? '#e5e5e5' : '#171717',
    textSec:   isDark ? '#a3a3a3' : '#525252',
    textMuted: isDark ? '#737373' : '#737373',
    textDim:   isDark ? '#525252' : '#a3a3a3',
    textGhost: isDark ? '#404040' : '#d4d4d4',
    
    // Accents (same in both modes)
    accent:    '#a78bfa',
    accentHov: '#8b5cf6',
    blue:      '#60a5fa',
    green:     '#34d399',
    red:       '#f87171',
    yellow:    '#fbbf24',
    purple:    '#c084fc',
    
    // Special
    selection: isDark ? 'rgba(167,139,250,0.2)' : 'rgba(167,139,250,0.15)',
    overlay:   isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)',
    
    // Subtle tinted backgrounds for insight cards
    warnBg:    isDark ? '#1a1710' : '#fffbeb',
    warnBdr:   isDark ? '#332e1a' : '#fde68a',
    achieveBg: isDark ? '#14121a' : '#f5f3ff',
    achieveBdr:isDark ? '#262040' : '#ddd6fe',
    tipBg:     isDark ? '#0f1a14' : '#ecfdf5',
    tipBdr:    isDark ? '#1a3326' : '#a7f3d0',
    alertBg:   isDark ? '#1a1212' : '#fff1f2',
    alertBdr:  isDark ? '#331a1a' : '#fecdd3',
  };
}

interface ThemeProviderProps {
  children: ReactNode;
  initial?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, initial = 'light' }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mindpulse-theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('mindpulse-theme', theme);
  }, [theme]);

  const toggle = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, toggle, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};
