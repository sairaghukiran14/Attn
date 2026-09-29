const fs = require('fs');
const path = require('path');
const os = require('os');
let electronApp = null;
try {
  const electron = require('electron');
  electronApp = electron.app;
} catch (e) {}

class AttentionStorage {
  constructor() {
    this.userDataPath = (electronApp && typeof electronApp.getPath === 'function')
      ? electronApp.getPath('userData')
      : path.join(os.homedir(), '.mindpulse');
    this.dbDir = path.join(this.userDataPath, 'mindpulse_data');
    this.sessionsFile = path.join(this.dbDir, 'sessions.json');
    this.settingsFile = path.join(this.dbDir, 'settings.json');
    this.achievementsFile = path.join(this.dbDir, 'achievements.json');
    
    this.init();
  }

  init() {
    if (!fs.existsSync(this.dbDir)) {
      fs.mkdirSync(this.dbDir, { recursive: true });
    }

    if (!fs.existsSync(this.settingsFile)) {
      const defaultSettings = {
        trackingEnabled: true,
        pollingIntervalMs: 1000,
        microDistractionThresholdSec: 15,
        deepWorkThresholdSec: 600,
        fragmentationAlertThreshold: 8,
        notificationsEnabled: true,
        incognitoMode: false,
        darkMode: false,
        theme: 'light',
        idleDetectionEnabled: true,
        idleThresholdSec: 300,
        customCategoryRules: [
          { pattern: 'github.com', type: 'domain', category: 'Development' },
          { pattern: 'gitlab.com', type: 'domain', category: 'Development' },
          { pattern: 'stackoverflow.com', type: 'domain', category: 'Development' },
          { pattern: 'claude.ai', type: 'domain', category: 'Deep Work' },
          { pattern: 'chatgpt.com', type: 'domain', category: 'Deep Work' },
          { pattern: 'notion.so', type: 'domain', category: 'Deep Work' },
          { pattern: 'docs.google.com', type: 'domain', category: 'Deep Work' },
          { pattern: 'figma.com', type: 'domain', category: 'Deep Work' },
          { pattern: 'youtube.com', type: 'domain', category: 'Entertainment' },
          { pattern: 'netflix.com', type: 'domain', category: 'Entertainment' },
          { pattern: 'reddit.com', type: 'domain', category: 'Social Media' },
          { pattern: 'twitter.com', type: 'domain', category: 'Social Media' },
          { pattern: 'x.com', type: 'domain', category: 'Social Media' },
          { pattern: 'instagram.com', type: 'domain', category: 'Social Media' },
          { pattern: 'linkedin.com', type: 'domain', category: 'Social Media' },
          { pattern: 'Code', type: 'app', category: 'Development' },
          { pattern: 'Cursor', type: 'app', category: 'Development' },
          { pattern: 'Terminal', type: 'app', category: 'Development' },
          { pattern: 'iTerm2', type: 'app', category: 'Development' },
          { pattern: 'Xcode', type: 'app', category: 'Development' },
          { pattern: 'Slack', type: 'app', category: 'Communication' },
          { pattern: 'Discord', type: 'app', category: 'Communication' },
          { pattern: 'Telegram', type: 'app', category: 'Communication' },
          { pattern: 'WhatsApp', type: 'app', category: 'Communication' },
          { pattern: 'Zoom', type: 'app', category: 'Communication' },
          { pattern: 'Mail', type: 'app', category: 'Communication' },
          { pattern: 'Spotify', type: 'app', category: 'Entertainment' }
        ]
      };
      fs.writeFileSync(this.settingsFile, JSON.stringify(defaultSettings, null, 2));
    }

    if (!fs.existsSync(this.sessionsFile)) {
      fs.writeFileSync(this.sessionsFile, JSON.stringify([], null, 2));
    }
  }

  getSettings() {
    try {
      const data = fs.readFileSync(this.settingsFile, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to read settings:', e);
      return {};
    }
  }

  saveSettings(settings) {
    try {
      fs.writeFileSync(this.settingsFile, JSON.stringify(settings, null, 2));
      return true;
    } catch (e) {
      console.error('Failed to save settings:', e);
      return false;
    }
  }

  getSessions() {
    try {
      if (!fs.existsSync(this.sessionsFile)) return [];
      const data = fs.readFileSync(this.sessionsFile, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to read sessions:', e);
      return [];
    }
  }

  appendSession(session) {
    try {
      const sessions = this.getSessions();
      // Keep last 10,000 sessions in storage
      if (sessions.length > 10000) {
        sessions.splice(0, sessions.length - 9000);
      }
      sessions.push(session);
      fs.writeFileSync(this.sessionsFile, JSON.stringify(sessions, null, 2));
      return true;
    } catch (e) {
      console.error('Failed to append session:', e);
      return false;
    }
  }

  clearHistory() {
    try {
      fs.writeFileSync(this.sessionsFile, JSON.stringify([], null, 2));
      return true;
    } catch (e) {
      console.error('Failed to clear sessions:', e);
      return false;
    }
  }

  getAchievements() {
    try {
      if (!fs.existsSync(this.achievementsFile)) return null;
      const data = fs.readFileSync(this.achievementsFile, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to read achievements:', e);
      return null;
    }
  }

  saveAchievements(data) {
    try {
      fs.writeFileSync(this.achievementsFile, JSON.stringify(data, null, 2));
      return true;
    } catch (e) {
      console.error('Failed to save achievements:', e);
      return false;
    }
  }
}

module.exports = AttentionStorage;
