const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getRealtimeTarget: () => ipcRenderer.invoke('tracker:getRealtimeTarget'),
  getMetrics: (timeframe) => ipcRenderer.invoke('tracker:getMetrics', timeframe),
  getRecentSessions: (limit) => ipcRenderer.invoke('tracker:getRecentSessions', limit),
  getSettings: () => ipcRenderer.invoke('tracker:getSettings'),
  updateSettings: (settings) => ipcRenderer.invoke('tracker:updateSettings', settings),
  toggleTracking: (enabled) => ipcRenderer.invoke('tracker:toggleTracking', enabled),
  clearHistory: () => ipcRenderer.invoke('tracker:clearHistory'),
  toggleHud: (force) => ipcRenderer.invoke('tracker:toggleHud', force),
  exportData: () => ipcRenderer.invoke('tracker:exportData'),
  getAchievements: () => ipcRenderer.invoke('tracker:getAchievements'),
  saveAchievements: (data) => ipcRenderer.invoke('tracker:saveAchievements', data),
  notifyAchievement: (achievement) => ipcRenderer.invoke('tracker:notifyAchievement', achievement),
  
  onRealtimeTick: (callback) => {
    const handler = (_event, data) => callback(data);
    ipcRenderer.on('tracker:tick', handler);
    return () => ipcRenderer.removeListener('tracker:tick', handler);
  },

  onAttentionAlert: (callback) => {
    const handler = (_event, alert) => callback(alert);
    ipcRenderer.on('tracker:alert', handler);
    return () => ipcRenderer.removeListener('tracker:alert', handler);
  }
});
