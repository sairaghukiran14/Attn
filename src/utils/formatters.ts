import { AppCategory, AttentionState } from '../types.ts';

export function formatDuration(seconds: number): string {
  if (seconds < 0) return '0s';
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins < 60) {
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  }
  const hours = Math.floor(mins / 60);
  const remMins = mins % 60;
  return remMins > 0 ? `${hours}h ${remMins}m` : `${hours}h`;
}

export function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function getAttentionStateDetails(state: AttentionState): {
  label: string;
  color: string;
  description: string;
} {
  switch (state) {
    case 'FLOW':
      return {
        label: 'Flow State',
        color: '#a78bfa',
        description: 'Deep unbroken focus. Cognitive immersion is strong.'
      };
    case 'FOCUSED':
      return {
        label: 'Focused',
        color: '#34d399',
        description: 'Steady pacing. Normal productive session.'
      };
    case 'FRAGMENTED':
      return {
        label: 'Fragmented',
        color: '#fbbf24',
        description: 'Frequent context switches. Try single-tasking.'
      };
    case 'HYPERACTIVE_SWITCHING':
      return {
        label: 'Hyper-Switching',
        color: '#f87171',
        description: 'Rapid tab/app hopping. Focus is draining rapidly.'
      };
    case 'IDLE':
      return {
        label: 'Inactive / Away',
        color: '#94a3b8',
        description: 'No mouse or keyboard interaction for >5m. Recording is paused.'
      };
    default:
      return {
        label: 'Monitoring',
        color: '#737373',
        description: 'Observing window focus activity...'
      };
  }
}

export function getCategoryColor(category: AppCategory): string {
  switch (category) {
    case 'Deep Work': return '#a78bfa';
    case 'Development': return '#60a5fa';
    case 'Communication': return '#c084fc';
    case 'Research & Reading': return '#34d399';
    case 'Social Media': return '#f87171';
    case 'Entertainment': return '#fbbf24';
    case 'Utilities': return '#737373';
    default: return '#525252';
  }
}

// Keep backward compat for components that still use getCategoryBadge
export function getCategoryBadge(category: AppCategory): {
  color: string;
  bg: string;
  border: string;
  solidColor: string;
} {
  const c = getCategoryColor(category);
  return { solidColor: c, color: '', bg: '', border: '' };
}
