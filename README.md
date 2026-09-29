# ⚡ Attn — Attention Span & Context Switch Intelligence

<div align="center">

![Attn Banner](https://img.shields.io/badge/Status-Active_Development-2563eb?style=for-the-badge)
![Platform](https://img.shields.io/badge/Platform-macOS_%7C_Windows-059669?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-d97706?style=for-the-badge)
![Electron](https://img.shields.io/badge/Electron-44.4-475569?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.3-0284c7?style=for-the-badge)

**Attn** is an intelligent, privacy-first desktop application that continuously quantifies your real-time attention span, context-switching overhead, and deep work velocity across native desktop apps and browser tabs — with **zero browser extensions required**.

[Download Releases](#-download--releases) • [Features](#-key-features) • [Installation](#-quick-start--development) • [Building](#-packaging--releasing) • [Privacy](#-100-local--privacy-first)

</div>

---

## 📥 Download & Releases

Direct download links for the latest pre-compiled releases:

| Platform | Format | Architecture | Download |
| :--- | :--- | :--- | :--- |
| **macOS** | `.dmg` Installer | Apple Silicon (`arm64`) & Intel (`x64`) | [Latest macOS DMG](https://github.com/sairaghukiran14/Attn/releases) |
| **macOS** | `.zip` Portable | Apple Silicon (`arm64`) & Intel (`x64`) | [Latest macOS ZIP](https://github.com/sairaghukiran14/Attn/releases) |
| **Windows** | `.exe` Setup | Windows 10 / 11 (`x64`) | [Latest Windows Installer](https://github.com/sairaghukiran14/Attn/releases) |
| **Windows** | `.zip` Portable | Windows 10 / 11 (`x64`) | [Latest Windows ZIP](https://github.com/sairaghukiran14/Attn/releases) |

---

## 🎨 Design Philosophy: Crisp Minimalist Swiss UI

- **Default Light Theme**: Crisp, high-contrast, zero-gradient interface designed for maximum productivity and legibility.
- **Dark Mode Support**: Seamless one-click switch between clean Light and dark themes with buttery-smooth cubic-bezier transitions.
- **No Clutter**: Zero artificial skeuomorphism, zero distracting visual noise.
- **Dynamic Micro-Interactions**: Hover lifts, badge unlock celebrations with confetti, and responsive metric cards.

---

## 🚀 Key Features

### 1. ⚡ Live Attention Meter & Mean Attention Span (MAS)
- **Continuous Burst Quantifier**: Measures unbroken duration spent on a single task before context-switching.
- **Dynamic Focus Velocity Score (0–100)**: Real-time calculation based on session length, app category weights, and switch frequencies.
- **Floating Live HUD Mini-Widget**: An always-on-top, draggable companion widget (`340x112px`) showing your current burst timer, score, and active app/tab without disrupting work.
- **Native Menu Bar / Tray**: Dynamic menu tray display (`⚡ 85 • 04:12`) with instant pause/resume toggle.

### 2. 🏆 100 Badges & Challenges Gamification Engine
- **60 Milestone & Mastery Badges**:
  - *Novice Focus*, *Focus Disciple*, *Grandmaster Attention* (up to 300 minutes uninterrupted focus).
  - *Flow State Zen*, *Cognitive Titan*, *Laser Singularity* (95+ score streaks).
  - *Distraction Antidote*, *Zero Interruption Hero* (minimal switches over long hours).
  - *Dawn Patrol*, *Midnight Oil*, *Night Owl Sentinel* (time-of-day mastery).
  - *Code Immortal*, *Terminal Alchemist*, *Deep Scholar* (category-specific mastery).
- **40 Daily & Weekly Focus Challenges**:
  - Unbroken 25m Pomodoro sprints, 90m deep work sessions, under 5 context switches per hour, social detox streaks.
- **Celebration Feedback**: Real-time unlock toasts with manual `X` close buttons and a 2.5s auto-dismiss timer accompanied by particle confetti bursts.

### 3. 🖱️ 5-Minute Inactivity & Mouse Presence Tracker
- Continuously inspects active mouse cursor delta coordinates every 5 minutes.
- Differentiates active deep work from idle away-from-keyboard states so your attention metrics remain 100% accurate.

### 4. 🌐 Native Zero-Extension Window & Browser Tab Tracking
- **macOS**: Native JavaScript for Automation (JXA) captures window titles and active browser tabs for **Google Chrome, Arc, Brave, Safari, Microsoft Edge, and Chromium**.
- **Windows**: Fast Win32 / PowerShell automation captures active foreground process and tab titles.
- **Zero Browser Plugins Required**: No background Chrome extensions or heavy permissions.

### 5. 📊 Deep Analytics & Transition Dynamics
- **Hourly Attention Dynamics**: Dual-axis visualization of average attention burst length against context switch density.
- **Category Matrix**: Interactive drill-down into `Deep Work`, `Development`, `Communication`, `Social Media`, and `Entertainment`.
- **Context Flow Graph**: Shows where your attention hops from and to (e.g., `VS Code` ➔ `Slack` ➔ `YouTube`).

### 6. 🔔 Smart Notification System
- Notifies when context-switching surpasses 8 hops in 3 minutes.
- In-app notification toasts feature interactive dismiss controls and auto-fade within 2–3 seconds.

---

## 💻 Quick Start & Development

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Setup
```bash
# 1. Clone the repository
git clone https://github.com/sairaghukiran14/Attn.git
cd Attn

# 2. Install dependencies
npm install

# 3. Start development mode (Vite UI + Electron Desktop App concurrently)
npm run dev
```

---

## 📦 Packaging & Releasing

### Build macOS Installer (`.dmg` & `.zip`)
```bash
# Build for your current macOS architecture
npm run dist:mac

# Or build specifically for Apple Silicon (M1/M2/M3/M4)
npm run dist:arm64

# Or build for Intel x86_64
npm run dist:x64
```
*Output binaries are generated in `./release/Attn-1.0.0-arm64.dmg`.*

### Build Windows Installer (`.exe` & `.zip`)
```bash
# Build Windows NSIS setup package
npm run dist:win
```
*Output binaries are generated in `./release/Attn Setup 1.0.0.exe`.*

### Build All Platforms
```bash
npm run dist:all
```

---

## 🤖 Automated CI/CD via GitHub Actions

Every release tag pushed to this repository (`git tag v1.0.0 && git push origin v1.0.0`) triggers `.github/workflows/release.yml`, which:
1. Builds macOS DMG & ZIP on `macos-latest`.
2. Builds Windows NSIS EXE & ZIP on `windows-latest`.
3. Publishes all binaries directly to the GitHub Release page for instant direct download.

---

## 🔒 100% Local & Privacy-First

- **Zero Cloud Tracking**: All metrics, session bursts, app titles, and badge progression are stored purely locally on your device in `~/.attn/attn_data/sessions.json` and local browser storage.
- **No Analytics Telemetry**: Your work habits stay strictly on your machine.

---

## 🛠️ Tech Stack

- **Desktop Framework**: Electron 44
- **UI Architecture**: React 19, TypeScript
- **Styling**: TailwindCSS v4 + Vanilla CSS Design Tokens
- **Charts & Visualizations**: Chart.js, React-Chartjs-2
- **Icons & Animations**: Lucide React, Canvas Confetti
- **Bundler & Build Tool**: Vite 8, Electron Builder

---

## 📜 License

MIT License © 2026 Sai Raghu Kiran. All rights reserved.
