const { execFile } = require('child_process');
const crypto = require('crypto');

const JXA_SCRIPT = `
function run() {
    var sys = Application("System Events");
    var frontAppProcess = sys.applicationProcesses.whose({frontmost: true})[0];
    var appName = frontAppProcess ? frontAppProcess.name() : "Unknown";
    var windowTitle = "";
    try {
        if (frontAppProcess && frontAppProcess.windows.length > 0) {
            windowTitle = frontAppProcess.windows[0].name() || "";
        }
    } catch(e) {}

    var tabTitle = "";
    var tabUrl = "";

    try {
        if (appName === "Google Chrome" || appName === "Google Chrome Canary" || appName === "Chromium" || appName === "Brave Browser" || appName === "Microsoft Edge" || appName === "Arc") {
            var browser = Application(appName);
            if (browser.running() && browser.windows.length > 0) {
                var activeTab = browser.windows[0].activeTab();
                tabTitle = activeTab.title();
                tabUrl = activeTab.url();
            }
        } else if (appName === "Safari") {
            var safari = Application("Safari");
            if (safari.running() && safari.windows.length > 0) {
                var currentTab = safari.windows[0].currentTab();
                tabTitle = currentTab.name();
                tabUrl = currentTab.url();
            }
        }
    } catch (e) {
        // Tab access error or browser busy
    }

    return JSON.stringify({
        appName: appName,
        windowTitle: windowTitle,
        tabTitle: tabTitle,
        tabUrl: tabUrl
    });
}
`;

const CATEGORY_COLORS = {
  'Deep Work': '#00f2fe',
  'Development': '#38bdf8',
  'Communication': '#a855f7',
  'Research & Reading': '#34d399',
  'Social Media': '#f43f5e',
  'Entertainment': '#fb923c',
  'Utilities': '#94a3b8',
  'Uncategorized': '#64748b'
};

class AttentionTracker {
  constructor(storage, onAlertCallback, onTickCallback, systemApi = {}) {
    this.storage = storage;
    this.onAlert = onAlertCallback;
    this.onTick = onTickCallback;
    this.powerMonitor = systemApi.powerMonitor || null;
    this.screen = systemApi.screen || null;
    
    this.settings = this.storage.getSettings();
    this.timer = null;
    this.isQuerying = false;

    // Current state
    this.currentTarget = null;
    this.focusedSince = Date.now();
    this.lastTargetKey = '';
    
    // Mouse Movement & Inactivity / AFK Tracking
    this.lastMousePoint = null;
    this.lastInteractionTime = Date.now();
    this.isUserIdle = false;
    this.idleSince = null;
    
    // In-memory buffer of recent switch timestamps (within last 3 minutes)
    this.recentSwitchTimestamps = [];
    this.activeSessionId = null;

    this.todaySessions = [];
    this.loadTodaySessions();
  }

  loadTodaySessions() {
    const allSessions = this.storage.getSessions();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayMs = startOfToday.getTime();
    
    this.todaySessions = allSessions.filter(s => s.startTime >= todayMs);
  }

  start() {
    if (this.timer) clearInterval(this.timer);
    const interval = Math.max(500, this.settings.pollingIntervalMs || 1000);
    this.timer = setInterval(() => this.tick(), interval);
    this.tick();
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.storage.saveSettings(this.settings);
    if (this.timer) {
      this.start();
    }
  }

  extractDomain(url) {
    if (!url) return '';
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace(/^www\./, '');
    } catch (e) {
      return '';
    }
  }

  categorize(appName, domain, tabTitle) {
    const rules = this.settings.customCategoryRules || [];
    
    // 1. Check custom rules
    if (domain) {
      for (const rule of rules) {
        if (rule.type === 'domain' && domain.toLowerCase().includes(rule.pattern.toLowerCase())) {
          return rule.category;
        }
      }
    }

    for (const rule of rules) {
      if (rule.type === 'app' && appName.toLowerCase().includes(rule.pattern.toLowerCase())) {
        return rule.category;
      }
    }

    // 2. Built-in heuristic fallbacks
    const lowerApp = (appName || '').toLowerCase();
    const lowerDomain = (domain || '').toLowerCase();
    const lowerTitle = (tabTitle || '').toLowerCase();

    if (lowerDomain.includes('claude.ai') || lowerDomain.includes('chatgpt.com') || lowerDomain.includes('cursor') || lowerDomain.includes('notion')) {
      return 'Deep Work';
    }
    if (lowerApp.includes('code') || lowerApp.includes('xcode') || lowerApp.includes('terminal') || lowerApp.includes('iterm') || lowerDomain.includes('github') || lowerDomain.includes('stackoverflow')) {
      return 'Development';
    }
    if (lowerApp.includes('slack') || lowerApp.includes('discord') || lowerApp.includes('teams') || lowerApp.includes('mail') || lowerApp.includes('messages') || lowerApp.includes('telegram') || lowerApp.includes('zoom')) {
      return 'Communication';
    }
    if (lowerDomain.includes('youtube') || lowerDomain.includes('netflix') || lowerDomain.includes('spotify') || lowerApp.includes('spotify') || lowerApp.includes('music')) {
      return 'Entertainment';
    }
    if (lowerDomain.includes('reddit') || lowerDomain.includes('twitter') || lowerDomain.includes('x.com') || lowerDomain.includes('instagram') || lowerDomain.includes('facebook') || lowerDomain.includes('tiktok')) {
      return 'Social Media';
    }
    if (lowerDomain.includes('wikipedia') || lowerDomain.includes('medium') || lowerDomain.includes('substack') || lowerDomain.includes('arxiv') || lowerTitle.includes('documentation') || lowerTitle.includes('docs')) {
      return 'Research & Reading';
    }

    return 'Uncategorized';
  }

  isBrowserApp(appName) {
    const browsers = ['Google Chrome', 'Google Chrome Canary', 'Chromium', 'Brave Browser', 'Microsoft Edge', 'Arc', 'Safari', 'Firefox'];
    return browsers.includes(appName);
  }

  getTargetKey(raw) {
    if (this.isBrowserApp(raw.appName) && (raw.tabUrl || raw.tabTitle)) {
      const domain = this.extractDomain(raw.tabUrl);
      return `${raw.appName}::${domain || raw.tabTitle}`;
    }
    return `${raw.appName}`;
  }

  checkUserActivity() {
    const now = Date.now();
    let hasMouseMoved = false;

    // 1. Check physical mouse coordinate movement
    if (this.screen) {
      try {
        const currentPoint = this.screen.getCursorScreenPoint();
        if (this.lastMousePoint) {
          if (this.lastMousePoint.x !== currentPoint.x || this.lastMousePoint.y !== currentPoint.y) {
            hasMouseMoved = true;
          }
        }
        this.lastMousePoint = currentPoint;
      } catch (e) {}
    }

    // 2. Check macOS system idle time (mouse + keyboard across OS)
    let systemIdleSec = 0;
    if (this.powerMonitor) {
      try {
        systemIdleSec = this.powerMonitor.getSystemIdleTime();
      } catch (e) {}
    }

    if (hasMouseMoved || systemIdleSec === 0) {
      this.lastInteractionTime = now;
    }

    // Inactivity threshold (default: 300s = 5 minutes)
    const thresholdSec = this.settings.idleThresholdSec || 300;
    const isDetectionEnabled = this.settings.idleDetectionEnabled !== false;

    // Effective idle duration
    const currentIdleSec = Math.max(systemIdleSec, Math.round((now - this.lastInteractionTime) / 1000));
    const isNowIdle = isDetectionEnabled && (currentIdleSec >= thresholdSec);

    // Transition: ACTIVE -> IDLE (No mouse movement/interaction for threshold)
    if (isNowIdle && !this.isUserIdle) {
      this.isUserIdle = true;
      this.idleSince = now - (thresholdSec * 1000); // the moment they stopped interacting

      // Conclude active session burst cleanly without crediting the away time
      if (this.currentTarget && this.focusedSince) {
        const activeDurationSec = Math.max(1, Math.round((this.idleSince - this.focusedSince) / 1000));
        
        if (activeDurationSec > 5) {
          const isMicro = activeDurationSec < (this.settings.microDistractionThresholdSec || 15);
          const isDeep = activeDurationSec >= (this.settings.deepWorkThresholdSec || 600);
          
          const sessionRecord = {
            id: this.activeSessionId || crypto.randomUUID(),
            appName: this.currentTarget.appName,
            tabTitle: this.currentTarget.tabTitle || undefined,
            tabUrl: this.settings.incognitoMode ? undefined : (this.currentTarget.tabUrl || undefined),
            domain: this.currentTarget.domain || undefined,
            category: this.currentTarget.category,
            isBrowser: this.currentTarget.isBrowser,
            startTime: this.focusedSince,
            endTime: this.idleSince,
            durationSeconds: activeDurationSec,
            isMicroDistraction: isMicro,
            isDeepWork: isDeep
          };

          this.storage.appendSession(sessionRecord);
          this.todaySessions.push(sessionRecord);
        }
      }

      // Notify alert
      if (this.onAlert && this.settings.notificationsEnabled) {
        this.onAlert({
          id: crypto.randomUUID(),
          type: 'IDLE',
          title: 'Activity Inactive (Tracking Paused)',
          message: `No mouse movement or interaction detected for 5 minutes. Attention recording paused to maintain accurate data.`,
          timestamp: Date.now()
        });
      }
    } 
    // Transition: IDLE -> ACTIVE (User returned and moved mouse or typed!)
    else if (!isNowIdle && this.isUserIdle) {
      this.isUserIdle = false;
      this.idleSince = null;
      this.focusedSince = now; // reset fresh focus timer on return
      this.activeSessionId = crypto.randomUUID();

      if (this.onAlert && this.settings.notificationsEnabled) {
        this.onAlert({
          id: crypto.randomUUID(),
          type: 'RESUMED',
          title: 'Focus Tracking Resumed',
          message: `Mouse movement detected. Attention span tracking resumed.`,
          timestamp: Date.now()
        });
      }
    }

    return {
      isUserIdle: this.isUserIdle,
      idleTimeSec: currentIdleSec,
      mouseActive: !this.isUserIdle && (currentIdleSec < 30)
    };
  }

  async tick() {
    if (!this.settings.trackingEnabled || this.isQuerying) return;
    this.isQuerying = true;

    if (process.platform === 'darwin') {
      execFile('osascript', ['-l', 'JavaScript', '-e', JXA_SCRIPT], { timeout: 1500 }, (error, stdout) => {
        this.isQuerying = false;
        if (error) return;
        try {
          const raw = JSON.parse(stdout.trim());
          this.processActiveTarget(raw);
        } catch (e) {}
      });
    } else if (process.platform === 'win32') {
      const psScript = `
        Add-Type @"
          using System;
          using System.Runtime.InteropServices;
          using System.Text;
          public class Win32 {
            [DllImport("user32.dll")]
            public static extern IntPtr GetForegroundWindow();
            [DllImport("user32.dll")]
            public static extern int GetWindowText(IntPtr hWnd, StringBuilder text, int count);
            [DllImport("user32.dll")]
            public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint processId);
          }
"@
        $hwnd = [Win32]::GetForegroundWindow()
        $sb = New-Object System.Text.StringBuilder 256
        [void][Win32]::GetWindowText($hwnd, $sb, 256)
        $pid = 0
        [void][Win32]::GetWindowThreadProcessId($hwnd, [ref]$pid)
        $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
        @{
          appName = if ($proc) { $proc.ProcessName } else { "Unknown" }
          windowTitle = $sb.ToString()
          tabTitle = ""
          tabUrl = ""
        } | ConvertTo-Json -Compress
      `;
      execFile('powershell', ['-NoProfile', '-NonInteractive', '-Command', psScript], { timeout: 2000 }, (error, stdout) => {
        this.isQuerying = false;
        if (error) return;
        try {
          const raw = JSON.parse(stdout.trim());
          this.processActiveTarget(raw);
        } catch (e) {}
      });
    } else {
      this.isQuerying = false;
    }
  }

  processActiveTarget(raw) {
    if (!raw.appName || raw.appName === 'loginwindow' || raw.appName === 'ScreenSaverEngine') {
      return;
    }

    const now = Date.now();
    const activity = this.checkUserActivity();
    const isBrowser = this.isBrowserApp(raw.appName);
    const domain = this.extractDomain(raw.tabUrl);
    const category = this.categorize(raw.appName, domain, raw.tabTitle);
    const targetKey = this.getTargetKey(raw);

    // Check if target changed (context switch!)
    if (this.lastTargetKey && this.lastTargetKey !== targetKey) {
      if (!this.isUserIdle) {
        const durationSec = Math.max(1, Math.round((now - this.focusedSince) / 1000));
        
        // Save previous burst session
        if (this.currentTarget) {
          const isMicro = durationSec < (this.settings.microDistractionThresholdSec || 15);
          const isDeep = durationSec >= (this.settings.deepWorkThresholdSec || 600);
          
          const sessionRecord = {
            id: this.activeSessionId || crypto.randomUUID(),
            appName: this.currentTarget.appName,
            tabTitle: this.currentTarget.tabTitle || undefined,
            tabUrl: this.settings.incognitoMode ? undefined : (this.currentTarget.tabUrl || undefined),
            domain: this.currentTarget.domain || undefined,
            category: this.currentTarget.category,
            isBrowser: this.currentTarget.isBrowser,
            startTime: this.focusedSince,
            endTime: now,
            durationSeconds: durationSec,
            isMicroDistraction: isMicro,
            isDeepWork: isDeep
          };

          this.storage.appendSession(sessionRecord);
          this.todaySessions.push(sessionRecord);
          
          // Record switch timestamp for velocity calculation
          this.recentSwitchTimestamps.push(now);
          this.pruneRecentSwitches(now);

          // Check for Rapid Fragmentation Alert
          this.evaluateAlerts(sessionRecord, isMicro);
        }
      }

      // Reset for new target
      this.focusedSince = now;
      this.activeSessionId = crypto.randomUUID();
    }

    this.lastTargetKey = targetKey;
    const currentDurationSec = this.isUserIdle ? 0 : Math.max(0, Math.round((now - this.focusedSince) / 1000));

    this.currentTarget = {
      appName: raw.appName,
      windowTitle: raw.windowTitle || '',
      tabTitle: raw.tabTitle || '',
      tabUrl: this.settings.incognitoMode ? '' : (raw.tabUrl || ''),
      domain: domain,
      category: category,
      isBrowser: isBrowser,
      focusedSince: this.focusedSince,
      currentDurationSec: currentDurationSec,
      isUserIdle: activity.isUserIdle,
      idleTimeSec: activity.idleTimeSec,
      mouseActive: activity.mouseActive,
      lastInteractionTime: this.lastInteractionTime
    };

    // Calculate real-time dynamic attention metrics
    const metrics = this.computeMetrics(currentDurationSec);
    if (this.isUserIdle) {
      metrics.attentionState = 'IDLE';
    }

    // Notify IPC listeners
    if (this.onTick) {
      this.onTick({
        target: this.currentTarget,
        currentMetrics: metrics
      });
    }
  }

  pruneRecentSwitches(now) {
    const threeMinsAgo = now - (3 * 60 * 1000);
    this.recentSwitchTimestamps = this.recentSwitchTimestamps.filter(t => t >= threeMinsAgo);
  }

  evaluateAlerts(lastSession, isMicro) {
    const recentSwitchesCount = this.recentSwitchTimestamps.length;
    const threshold = this.settings.fragmentationAlertThreshold || 8;

    if (this.settings.notificationsEnabled && recentSwitchesCount >= threshold) {
      if (this.onAlert) {
        this.onAlert({
          id: crypto.randomUUID(),
          type: 'FRAGMENTATION',
          title: 'Attention Fragmentation Alert',
          message: `You've switched context ${recentSwitchesCount} times in the last 3 minutes. Take a breath and pick one single task.`,
          timestamp: Date.now()
        });
      }
      // Clear half to avoid spamming every tick
      this.recentSwitchTimestamps = this.recentSwitchTimestamps.slice(Math.floor(threshold / 2));
    }
  }

  computeMetrics(currentLiveDurationSec = 0) {
    const now = Date.now();
    this.pruneRecentSwitches(now);
    const recentVelocity = this.recentSwitchTimestamps.length;

    const sessions = [...this.todaySessions];
    const totalSwitches = sessions.length;

    // Durations
    const durations = sessions.map(s => s.durationSeconds);
    const sumDuration = durations.reduce((a, b) => a + b, 0) + currentLiveDurationSec;
    const meanAttentionSpanSec = durations.length > 0 
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) 
      : currentLiveDurationSec;

    // Median calculation
    let medianAttentionSpanSec = meanAttentionSpanSec;
    if (durations.length > 0) {
      const sorted = [...durations].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      medianAttentionSpanSec = sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
    }

    // Micro hops (< 15s)
    const microHops = sessions.filter(s => s.isMicroDistraction).length;
    const microHopsRatio = totalSwitches > 0 ? Math.round((microHops / totalSwitches) * 100) : 0;

    // Deep work duration
    const deepWorkSec = sessions.filter(s => s.isDeepWork).reduce((acc, s) => acc + s.durationSeconds, 0);

    // Switches per hour
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const hoursElapsedToday = Math.max(0.5, (now - startOfToday.getTime()) / (1000 * 60 * 60));
    const switchesPerHour = Math.round(totalSwitches / hoursElapsedToday);

    // Attention Score Calculation (0-100)
    // Factors:
    // 1. Mean attention span (up to 40 pts: 5+ mins gives full 40)
    // 2. Micro-hopping penalty (up to 30 pts: low micro-hop ratio gives 30)
    // 3. Recent switch velocity penalty (up to 20 pts: 0-1 switches in 3 mins gives 20)
    // 4. Current continuous streak bonus (up to 10 pts: > 10m gives 10)
    const spanScore = Math.min(40, (meanAttentionSpanSec / 300) * 40);
    const microHopScore = Math.max(0, 30 - (microHopsRatio * 0.3));
    const velocityScore = Math.max(0, 20 - (recentVelocity * 3));
    const streakScore = Math.min(10, (currentLiveDurationSec / 600) * 10);
    
    let attentionScore = Math.min(100, Math.max(10, Math.round(spanScore + microHopScore + velocityScore + streakScore)));
    
    let attentionState = 'FOCUSED';
    if (recentVelocity >= 7 || microHopsRatio > 55) {
      attentionState = 'HYPERACTIVE_SWITCHING';
    } else if (recentVelocity >= 4 || attentionScore < 50) {
      attentionState = 'FRAGMENTED';
    } else if (currentLiveDurationSec >= 300 && attentionScore >= 75) {
      attentionState = 'FLOW';
    } else {
      attentionState = 'FOCUSED';
    }

    // Top Apps and Top Domains breakdown
    const appMap = new Map();
    const domainMap = new Map();
    const categoryMap = new Map();

    for (const s of sessions) {
      // App map
      const app = appMap.get(s.appName) || { totalSec: 0, count: 0, microHops: 0, category: s.category };
      app.totalSec += s.durationSeconds;
      app.count += 1;
      if (s.isMicroDistraction) app.microHops += 1;
      appMap.set(s.appName, app);

      // Domain map
      if (s.domain) {
        const dom = domainMap.get(s.domain) || { totalSec: 0, count: 0, microHops: 0, category: s.category };
        dom.totalSec += s.durationSeconds;
        dom.count += 1;
        if (s.isMicroDistraction) dom.microHops += 1;
        domainMap.set(s.domain, dom);
      }

      // Category map
      const catSec = categoryMap.get(s.category) || 0;
      categoryMap.set(s.category, catSec + s.durationSeconds);
    }

    const topApps = Array.from(appMap.entries())
      .map(([name, data]) => ({
        name,
        type: 'app',
        category: data.category,
        totalDurationSec: data.totalSec,
        sessionsCount: data.count,
        avgAttentionSpanSec: Math.round(data.totalSec / Math.max(1, data.count)),
        microHopsCount: data.microHops,
        percentageOfTime: sumDuration > 0 ? Math.round((data.totalSec / sumDuration) * 100) : 0,
        color: CATEGORY_COLORS[data.category] || '#64748b'
      }))
      .sort((a, b) => b.totalDurationSec - a.totalDurationSec)
      .slice(0, 8);

    const topDomains = Array.from(domainMap.entries())
      .map(([name, data]) => ({
        name,
        type: 'domain',
        category: data.category,
        totalDurationSec: data.totalSec,
        sessionsCount: data.count,
        avgAttentionSpanSec: Math.round(data.totalSec / Math.max(1, data.count)),
        microHopsCount: data.microHops,
        percentageOfTime: sumDuration > 0 ? Math.round((data.totalSec / sumDuration) * 100) : 0,
        color: CATEGORY_COLORS[data.category] || '#64748b'
      }))
      .sort((a, b) => b.totalDurationSec - a.totalDurationSec)
      .slice(0, 8);

    const categoryBreakdown = Object.keys(CATEGORY_COLORS).map(cat => {
      const totalSec = categoryMap.get(cat) || 0;
      return {
        category: cat,
        totalSec,
        percentage: sumDuration > 0 ? Math.round((totalSec / sumDuration) * 100) : 0,
        color: CATEGORY_COLORS[cat]
      };
    }).filter(c => c.totalSec > 0).sort((a, b) => b.totalSec - a.totalSec);

    // Hourly trends
    const hourlyTrends = this.computeHourlyTrends(sessions);

    // Recent transitions
    const recentTransitions = this.computeRecentTransitions(sessions.slice(-25));

    return {
      currentStreakSec: currentLiveDurationSec,
      attentionScore,
      attentionState,
      meanAttentionSpanSec,
      medianAttentionSpanSec,
      totalSwitchesToday: totalSwitches,
      switchesPerHour,
      microHopsCount: microHops,
      microHopsRatio,
      deepWorkDurationSec: deepWorkSec,
      totalTrackedDurationSec: sumDuration,
      recentSwitchVelocity: recentVelocity,
      topApps,
      topDomains,
      categoryBreakdown,
      hourlyTrends,
      recentTransitions
    };
  }

  computeHourlyTrends(sessions) {
    const hours = [];
    const currentHour = new Date().getHours();
    
    // Last 12 hours or full day
    const startHour = Math.max(0, currentHour - 11);
    for (let h = startHour; h <= currentHour; h++) {
      const hourLabel = `${h.toString().padStart(2, '0')}:00`;
      
      const hourSessions = sessions.filter(s => {
        const sHour = new Date(s.startTime).getHours();
        return sHour === h;
      });

      const totalSec = hourSessions.reduce((acc, s) => acc + s.durationSeconds, 0);
      const count = hourSessions.length;
      const avgSpan = count > 0 ? Math.round(totalSec / count) : 0;
      
      const spans = hourSessions.map(s => s.durationSeconds).sort((a, b) => a - b);
      const medianSpan = spans.length > 0 ? spans[Math.floor(spans.length / 2)] : 0;

      // Score for that hour
      const score = count > 0 ? Math.min(100, Math.max(20, Math.round((avgSpan / 180) * 80 + 20))) : 70;

      hours.push({
        hourLabel,
        hour: h,
        avgAttentionSpanSec: avgSpan,
        medianAttentionSpanSec: medianSpan,
        switchesCount: count,
        attentionScore: score,
        totalTimeSec: totalSec
      });
    }

    return hours;
  }

  computeRecentTransitions(recentSessions) {
    const flows = [];
    for (let i = 0; i < recentSessions.length - 1; i++) {
      const curr = recentSessions[i];
      const next = recentSessions[i + 1];

      const fromName = curr.domain || curr.appName;
      const toName = next.domain || next.appName;

      if (fromName !== toName) {
        flows.push({
          from: fromName,
          to: toName,
          fromType: curr.domain ? 'tab' : 'app',
          toType: next.domain ? 'tab' : 'app',
          fromCategory: curr.category,
          toCategory: next.category,
          count: 1,
          avgPreSwitchDurationSec: curr.durationSeconds
        });
      }
    }
    return flows.reverse().slice(0, 10);
  }
}

module.exports = AttentionTracker;
