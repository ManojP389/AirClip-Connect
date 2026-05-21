# AirClip 🎯

**Local Network Clipboard Sharing** — Share code, configs, and text instantly across devices when the internet goes down.

## 🚀 The Problem It Solves

You're in a college hackathon, a cafe, or on campus—the Wi-Fi works locally but has no external internet. You need to share a code snippet, terminal command, or config with your teammates **right now**. 

**AirClip** lets you do exactly that: run a local server on your laptop, and your team members can access it on their devices via the same Wi-Fi network without needing the outside internet.

## 🎯 Features

✅ **Offline-First** — Works completely without internet  
✅ **Syntax Highlighting** — Code snippets render beautifully  
✅ **File Uploads** — Share files directly  
✅ **Persistent Storage** — SQLite database saves all clips  
✅ **Local Network** — Find server via local IP address  
✅ **Mobile Friendly** — Works on phones, tablets, laptops  

## 🏗️ Architecture

```
┌─────────────────┐
│  Your Laptop    │
│  (Host Server)  │  192.168.1.5:3000
│  - Node.js      │
│  - SQLite DB    │
└────────┬────────┘
         │
    ┌────▼────┐
    │ Local   │
    │  Wi-Fi  │
    │ Router  │
    └────┬────┘
         │
    ┌────┴────────────────┐
    │                     │
┌───▼──────┐      ┌──────▼───┐
│ Charmee's│      │ Sayyam's │
│ Laptop   │      │   Phone  │
│ Browser  │      │ Browser  │
└──────────┘      └──────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Local Wi-Fi network

### Installation

```bash
# Navigate to project
cd AirClip

# Install dependencies
npm install

# Start development server
npm run dev
```

### Usage

1. **Start the server on your laptop:**
   ```bash
   npm start
   ```
   
2. **Find your local IP:**
   ```bash
   # Windows
   ipconfig
   # macOS/Linux
   ifconfig
   ```
   Look for your IPv4 address (usually `192.168.x.x`)

3. **Share the URL with teammates:**
   ```
   http://192.168.1.5:3000
   ```

4. **Paste content and share!**
   - Copy/paste text, code, or upload files
   - Teammates access the same URL and see all shared clips
   - Click any clip to copy it

## 📁 Project Structure

```
AirClip/
├── server/                 # Node.js + Express backend
│   ├── server.js          # Main server entry
│   ├── db.js              # SQLite setup
│   ├── routes.js          # API endpoints
│   └── package.json
├── client/                # React frontend
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   └── styles/
│   ├── public/
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/clips` | List all clips |
| `POST` | `/api/clips` | Create new clip |
| `GET` | `/api/clips/:id` | Get specific clip |
| `DELETE` | `/api/clips/:id` | Delete clip |
| `POST` | `/api/clips/:id/upload` | Upload file to clip |

## 💾 Database Schema

```sql
CREATE TABLE clips (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  language TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE files (
  id TEXT PRIMARY KEY,
  clip_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  data BLOB NOT NULL,
  mime_type TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(clip_id) REFERENCES clips(id)
);
```

## 🛣️ Roadmap

- [ ] QR code generation for easy sharing
- [ ] Auto-discovery with mDNS (clipboard.local)
- [ ] Real-time sync with WebSockets
- [ ] Dark mode toggle
- [ ] Clipboard history limit settings
- [ ] Password protection
- [ ] CLI tool for terminal-based sharing

## 🤝 Team Usage Scenario

1. **You** start AirClip on laptop (192.168.1.5:3000)
2. **Charmee** opens browser on her laptop → http://192.168.1.5:3000
3. **Sayyam** opens browser on his phone → http://192.168.1.5:3000
4. **You** paste a code snippet → appears instantly for all
5. **They** click to copy → ready to debug
6. No internet needed. No account. No signup. Just teamwork.

## 📝 License

MIT

---

**Built for offline collaboration. Tested in the worst Wi-Fi situations.** 🎯
