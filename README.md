Live- https://hushdiary.vercel.app/
# 🎙 HushDiary — A Gallery of Memories

Some memories are too fragile for ink.

HushDiary is a quiet sanctuary where thoughts are spoken, not written —
a private gallery where voices linger, photographs breathe,
and fleeting moments are preserved not as they were edited,
but exactly as they were felt, on the days you didn’t want to explain — only remember

---

## 📁 Project Structure

```
hushdiary/
├── public/
│   └── index.html              ← HTML entry point + Google Fonts
├── src/
│   ├── index.js                ← React DOM entry point
│   ├── App.js                  ← Root component (routing between login/app)
│   │
│   ├── styles/
│   │   └── global.css          ← All animations, grain overlay, utility classes
│   │
│   ├── utils/
│   │   ├── constants.js        ← MOODS, QUOTES, image URLs, static data
│   │   ├── db.js               ← localStorage helper (users, sessions, entries)
│   │   └── ambientEngine.js    ← Generative ambient music (Web Audio API)
│   │
│   ├── components/
│   │   ├── Toast.js            ← Toast notification context + provider
│   │   ├── SharedUI.js         ← FilmEdge, Ornament, Particles, MusicOrb, WaveCanvas, FilmStrip, Spinner
│   │   └── MemoryModal.js      ← Full-screen memory detail modal
│   │
│   └── pages/
│       ├── LoginPage.js        ← Login with split-panel layout + film strip
│       ├── SignupPage.js       ← Signup with features showcase
│       ├── MainApp.js          ← App shell: sidebar + topbar + routing
│       ├── GalleryView.js      ← Masonry polaroid gallery
│       ├── TimelineView.js     ← Chronological timeline with audio player
│       ├── RecordView.js       ← Voice recorder + mood + note + photo
│       └── StatsView.js        ← Stats, mood chart, account info
│
├── package.json
└── README.md
```

---

## 🚀 Setup & Run

### Prerequisites

- Node.js 16+ installed
- npm or yarn

### Steps

```bash
# 1. Clone or create the project folder
mkdir hushdiary && cd hushdiary

# 2. Copy all files into the structure shown above

# 3. Install dependencies
npm install

# 4. Start the development server
npm start
```

The app will open at **http://localhost:3000**

---

## ✨ Features

| Feature                | Description                                                        |
| ---------------------- | ------------------------------------------------------------------ |
| 🔐 Auth                | Sign up / Login with hashed passwords stored in localStorage       |
| 🎙 Voice Recording     | Real microphone recording via MediaRecorder API with live waveform |
| 📷 Photo Attachment    | Upload and attach photos to any memory entry                       |
| 🌿 Mood Tracking       | 8 mood options with color-coded visualization                      |
| 🖼 Gallery View        | Masonry polaroid layout with tilt animations                       |
| 📅 Timeline            | Chronological view with inline audio playback                      |
| 📊 Stats               | Mood bar chart, streak counter, account info                       |
| 🎵 Ambient Music       | Generative piano + reverb via Web Audio API                        |
| 🔔 Toast Notifications | Non-intrusive status messages                                      |
| 🔒 Privacy             | 100% local — no backend, no servers                                |

---

## 🎨 Design System

| Element      | Value                          |
| ------------ | ------------------------------ |
| Background   | `#1a120a` (dark espresso)      |
| Accent       | `#c49a6c` (aged gold)          |
| Text         | `#f5edd8` (warm ivory)         |
| Paper        | `#fdf4e3` (cream)              |
| Display Font | IM Fell English (Google Fonts) |
| Heading Font | Cormorant Garamond             |
| Body Font    | Crimson Pro                    |
| Label Font   | Special Elite                  |

---

## 🎵 Ambient Music

Click the **♪ orb** (bottom-right) or the **AMBIENT button** in the topbar to toggle generative piano music. The engine creates:

- 4-chord progressions (C major, D minor, E minor, F major)
- Pentatonic melody runs
- Convolution reverb for depth

> **Note:** Browser requires a user gesture before starting AudioContext. Click the button to start.

---

## 💾 Data Storage

All data is stored in `localStorage` under these keys:

- `hd_users` — registered accounts (passwords hashed)
- `hd_session` — current logged-in user (no password)
- `hd_entries` — diary entries per user UID (includes base64 audio/photos)

> ⚠️ Audio recordings are stored as base64 in localStorage. Long recordings may exceed storage limits (~5MB). If this happens, a toast will notify you to delete older entries.

---

## 🖥 Browser Compatibility

| Browser     | Support |
| ----------- | ------- |
| Chrome 90+  | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 14+  | ✅ Full |
| Edge 90+    | ✅ Full |

Microphone access requires HTTPS in production (localhost works for development).

---

## 📝 Notes

- **Session persists** across browser refreshes via `localStorage`
- **Escape key** closes the memory modal
- **Click outside** the modal also closes it
- Recordings auto-stop after **5 minutes**
- Photos are stored as base64 data URLs

✨ Feel free to fork this repository and submit a pull request — contributions are always welcome!
