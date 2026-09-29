const { app, BrowserWindow, ipcMain, Notification, Tray, Menu, nativeImage, powerMonitor, screen } = require('electron');
const path = require('path');
const AttentionStorage = require('./storage.cjs');
const AttentionTracker = require('./tracker.cjs');

let mainWindow = null;
let hudWindow = null;
let tray = null;
let storage = null;
let tracker = null;

const isDev = process.env.NODE_ENV !== 'production' && !app.isPackaged;

function createTray() {
  // Simple 16x16 tray icon
  const icon = nativeImage.createFromDataURL(
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="%232563eb"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 14.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-4.5a1.5 1.5 0 0 1-3 0V7a1.5 1.5 0 0 1 3 0z"/></svg>'
  );

  try {
    tray = new Tray(icon.resize({ width: 16, height: 16 }));
    tray.setToolTip('Attn — Attention Span Intelligence');

    const updateTrayMenu = () => {
      const isTracking = storage ? storage.getSettings().trackingEnabled : true;
      const contextMenu = Menu.buildFromTemplate([
        {
          label: 'Attn Dashboard',
          click: () => {
            if (mainWindow) {
              mainWindow.show();
              mainWindow.focus();
            } else {
              createMainWindow();
            }
          }
        },
        {
          label: hudWindow && hudWindow.isVisible() ? 'Hide Floating Attention Meter' : 'Show Floating Attention Meter',
          click: () => toggleHudWindow()
        },
        { type: 'separator' },
        {
          label: isTracking ? 'Pause Focus Tracking' : 'Resume Focus Tracking',
          click: () => {
            if (tracker) {
              const next = !isTracking;
              tracker.updateSettings({ trackingEnabled: next });
              if (next) tracker.start();
              else tracker.stop();
              updateTrayMenu();
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Quit Attn',
          click: () => app.quit()
        }
      ]);
      tray.setContextMenu(contextMenu);
    };

    updateTrayMenu();
  } catch (e) {
    console.log('Tray creation note:', e.message);
  }
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1300,
    height: 880,
    minWidth: 1040,
    minHeight: 720,
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 18, y: 18 },
    backgroundColor: '#f8fafc',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    if (process.argv.includes('--debug')) {
      mainWindow.webContents.openDevTools();
    }
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createHudWindow() {
  hudWindow = new BrowserWindow({
    width: 340,
    height: 112,
    resizable: false,
    alwaysOnTop: true,
    frame: false,
    transparent: true,
    hasShadow: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  });

  // Position at top right of primary display
  const { screen } = require('electron');
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width } = primaryDisplay.workAreaSize;
  hudWindow.setPosition(width - 360, 40);

  const url = isDev ? 'http://localhost:5173?view=hud' : `file://${path.join(__dirname, '../dist/index.html')}?view=hud`;
  hudWindow.loadURL(url);

  hudWindow.on('closed', () => {
    hudWindow = null;
  });
}

function toggleHudWindow(forceState) {
  if (!hudWindow) {
    createHudWindow();
    hudWindow.once('ready-to-show', () => {
      hudWindow.show();
    });
    return true;
  }

  const shouldShow = forceState !== undefined ? forceState : !hudWindow.isVisible();
  if (shouldShow) {
    hudWindow.show();
  } else {
    hudWindow.hide();
  }
  return shouldShow;
}

function handleAlert(alert) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('tracker:alert', alert);
  }
  if (hudWindow && !hudWindow.isDestroyed()) {
    hudWindow.webContents.send('tracker:alert', alert);
  }

  if (Notification.isSupported()) {
    const notif = new Notification({
      title: `⚡ ${alert.title}`,
      body: alert.message,
      silent: false
    });
    notif.show();
  }
}

function handleTick(data) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('tracker:tick', data);
  }
  if (hudWindow && !hudWindow.isDestroyed()) {
    hudWindow.webContents.send('tracker:tick', data);
  }

  // Update tray title if available on macOS
  if (tray && data.target && data.currentMetrics) {
    const mins = Math.floor(data.target.currentDurationSec / 60);
    const secs = Math.floor(data.target.currentDurationSec % 60);
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    try {
      tray.setTitle(`⚡ ${data.currentMetrics.attentionScore} • ${timeStr}`);
    } catch (e) {}
  }
}

app.whenReady().then(() => {
  storage = new AttentionStorage();
  tracker = new AttentionTracker(storage, handleAlert, handleTick, { powerMonitor, screen });

  // Setup IPC Handlers
  ipcMain.handle('tracker:getRealtimeTarget', async () => {
    return tracker.currentTarget;
  });

  ipcMain.handle('tracker:getMetrics', async (_event, timeframe) => {
    return tracker.computeMetrics(tracker.currentTarget ? tracker.currentTarget.currentDurationSec : 0);
  });

  ipcMain.handle('tracker:getRecentSessions', async (_event, limit = 100) => {
    const sessions = storage.getSessions();
    return sessions.slice(-limit).reverse();
  });

  ipcMain.handle('tracker:getSettings', async () => {
    return storage.getSettings();
  });

  ipcMain.handle('tracker:updateSettings', async (_event, newSettings) => {
    tracker.updateSettings(newSettings);
    return storage.getSettings();
  });

  ipcMain.handle('tracker:toggleTracking', async (_event, enabled) => {
    const current = storage.getSettings();
    const nextState = enabled !== undefined ? enabled : !current.trackingEnabled;
    tracker.updateSettings({ trackingEnabled: nextState });
    if (nextState) {
      tracker.start();
    } else {
      tracker.stop();
    }
    return nextState;
  });

  ipcMain.handle('tracker:clearHistory', async () => {
    const result = storage.clearHistory();
    tracker.loadTodaySessions();
    return result;
  });

  ipcMain.handle('tracker:toggleHud', async (_event, force) => {
    return toggleHudWindow(force);
  });

  ipcMain.handle('tracker:exportData', async () => {
    const sessions = storage.getSessions();
    const settings = storage.getSettings();
    const payload = JSON.stringify({
      exportedAt: new Date().toISOString(),
      sessionsCount: sessions.length,
      settings,
      sessions
    }, null, 2);

    return {
      json: payload,
      filename: `attn_attention_data_${new Date().toISOString().slice(0, 10)}.json`
    };
  });

  ipcMain.handle('tracker:getAchievements', async () => {
    return storage.getAchievements();
  });

  ipcMain.handle('tracker:saveAchievements', async (_event, data) => {
    return storage.saveAchievements(data);
  });

  ipcMain.handle('tracker:notifyAchievement', async (_event, achievement) => {
    if (Notification.isSupported()) {
      const notif = new Notification({
        title: `🏆 Achievement Unlocked: ${achievement.title}`,
        body: `${achievement.icon} ${achievement.description} [${achievement.tier.toUpperCase()}]`,
        silent: false
      });
      notif.show();
    }
    return true;
  });

  createMainWindow();
  createTray();
  tracker.start();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (tracker) {
    tracker.stop();
  }
});
