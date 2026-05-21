# AirClip - Copilot Instructions

## Project Overview

**AirClip** is a local network clipboard sharing application designed for offline team collaboration. When your Wi-Fi network loses external internet connectivity, AirClip allows you to instantly share code snippets, configuration files, and text with teammates on the same local network.

## Key Features

- ✅ **Offline-First**: Works without internet on local Wi-Fi
- ✅ **Real-Time Sync**: Changes appear instantly on all connected devices
- ✅ **Syntax Highlighting**: Beautiful code rendering
- ✅ **File Uploads**: Share files directly through clips
- ✅ **Persistent Storage**: SQLite database saves all clips
- ✅ **Mobile Friendly**: Works on phones, tablets, laptops
- ✅ **No Auth Required**: Just visit the URL, start sharing

## Tech Stack

- **Backend**: Node.js + Express.js
- **Frontend**: React 18 with functional components
- **Database**: SQLite3 for persistent storage
- **File Handling**: Multer for file uploads
- **Styling**: Custom CSS with responsive design

## Project Structure

```
AirClip/
├── server/
│   ├── server.js          # Express server entry point
│   ├── db.js              # SQLite database utilities
│   ├── routes.js          # API endpoints (/api/clips, /api/files)
│   ├── package.json       # Backend dependencies
│   ├── .env               # Environment variables
│   ├── airclip.db         # SQLite database (generated on first run)
│   └── uploads/           # Temporary file storage
├── client/
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Global styles
│   │   ├── index.js       # React entry point
│   │   └── components/
│   │       ├── ClipEditor.js    # Text editor form
│   │       ├── ClipList.js      # Clip cards display
│   │       └── FileUpload.js    # File upload handler
│   ├── public/
│   │   └── index.html     # HTML template
│   └── package.json       # Frontend dependencies
├── .github/
│   └── copilot-instructions.md  # This file
├── package.json           # Root package with workspaces
├── README.md              # User-facing documentation
└── .gitignore             # Git ignore rules
```

## Installation & Setup

### Prerequisites
- Node.js 16 or higher
- npm 7 or higher
- A local Wi-Fi network

### Quick Start

1. **Navigate to project directory**
   ```bash
   cd AirClip
   ```

2. **Install all dependencies**
   ```bash
   npm install
   ```
   This installs both server and client dependencies via npm workspaces.

3. **Start development server**
   ```bash
   npm run dev
   ```
   This runs both the Express backend and React frontend concurrently.

4. **Find your local IP**
   ```bash
   # Windows
   ipconfig
   
   # macOS/Linux
   ifconfig
   ```
   Look for IPv4 address (e.g., 192.168.1.5)

5. **Share URL with team**
   ```
   http://192.168.1.5:3000
   ```

## API Endpoints

### Clips Management

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `GET` | `/api/clips` | - | Get all clips (max 100) |
| `GET` | `/api/clips/:id` | - | Get specific clip with files |
| `POST` | `/api/clips` | `{title, content, language}` | Create new clip |
| `PUT` | `/api/clips/:id` | `{title, content, language}` | Update clip |
| `DELETE` | `/api/clips/:id` | - | Delete clip |
| `POST` | `/api/clips/:id/upload` | FormData with file | Upload file to clip |
| `GET` | `/api/files/:fileId` | - | Download file |
| `DELETE` | `/api/files/:fileId` | - | Delete file |
| `GET` | `/api/health` | - | Server health check |

## Database Schema

### Clips Table
```sql
CREATE TABLE clips (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  language TEXT DEFAULT 'text',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Files Table
```sql
CREATE TABLE files (
  id TEXT PRIMARY KEY,
  clip_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  mime_type TEXT,
  file_size INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(clip_id) REFERENCES clips(id) ON DELETE CASCADE
);
```

## Development Workflow

### Running in Development Mode
```bash
npm run dev
```
- Server runs with nodemon (auto-reloads on changes)
- Client runs on port 3000 with hot module reloading
- Both run concurrently

### Building for Production
```bash
npm run build
```
- Builds React app into `client/build/`
- Server serves static files from there

### Starting Production Server
```bash
npm start
```
- Starts Express server only
- Serves pre-built React app from `client/build/`

## Configuration

### Server Environment Variables (.env)
```
PORT=3000                    # Server port
NODE_ENV=development         # development or production
```

### Database Location
- Development: `server/airclip.db`
- Auto-created on first server start
- Contains all clips and file metadata

### File Upload Limits
- Max file size: 50MB
- Stored in: `server/uploads/`
- Each file gets a UUID filename

## Features & Usage

### Create a Clip
1. Fill in title (optional) and content
2. Select language for syntax highlighting
3. Click "Share Clip"
4. Instantly visible to all connected team members

### Copy Content
1. Click any clip card to view details
2. Click "📋 Copy Content" button
3. Content copied to your clipboard

### Upload Files
1. Select a clip to view details
2. Click "📤 Upload File"
3. Choose file and upload
4. Team members can download it

### Delete Clips
- Click "🗑️ Delete" on clip card or details panel
- Removes clip and all associated files

## Common Issues & Troubleshooting

### Port Already in Use
```bash
# Change PORT in .env or use:
PORT=3001 npm start
```

### Database Locked
- SQLite can have concurrency issues
- Restart server if experiencing errors

### Cannot Access from Other Devices
- Verify both devices on same Wi-Fi
- Check Windows Firewall isn't blocking port 3000
- Confirm IP address is correct (not localhost)

### Files Not Uploading
- Check file size is under 50MB
- Verify `server/uploads/` directory exists
- Check disk space availability

## Security Notes

**This is designed for trusted local networks only:**
- No authentication system
- No HTTPS/encryption for local LAN
- All data stored in clear text
- Not suitable for sensitive data over untrusted networks

For future improvements, consider:
- Password protection
- HTTPS/TLS for local connections
- Session tokens
- Rate limiting

## Deployment

### Local Network Only (Recommended)
```bash
npm start
# Share: http://192.168.x.x:3000
```

### Production Deployment (Optional)
If deploying to a server, ensure:
1. Use HTTPS with valid certificates
2. Implement authentication
3. Configure CORS properly
4. Set `NODE_ENV=production`
5. Use process manager (PM2, systemd)

## Future Enhancements

- [ ] QR code generation for quick sharing
- [ ] mDNS discovery (clipboard.local)
- [ ] WebSocket real-time updates
- [ ] Dark mode UI toggle
- [ ] Clip search and filtering
- [ ] Syntax highlighting themes
- [ ] Clipboard history limit config
- [ ] Password protection per clip
- [ ] Expiring clips (auto-delete)
- [ ] Team user profiles
- [ ] Analytics dashboard

## Scripts Reference

```bash
# Root level commands
npm install              # Install all dependencies
npm run dev             # Start dev mode (server + client)
npm start               # Start production server
npm run build           # Build client for production

# Individual workspace commands
npm run server:dev      # Start server only (dev mode)
npm run server:start    # Start server only (production)
npm run client:dev      # Start client only
npm run client:build    # Build client only
```

## Performance Tips

1. **Limit clips to 100** - Database query limits results
2. **Clean up old files** - Periodically delete uploaded files
3. **Monitor database size** - Compact SQLite if needed
4. **Use compression** - For large text pastes

## Testing

Currently no automated tests. Manual testing checklist:

- [ ] Create clip in browser
- [ ] Clip appears on other devices instantly
- [ ] Copy content works
- [ ] Upload file works
- [ ] Download file works
- [ ] Delete clip works
- [ ] Page refreshes show existing clips
- [ ] Works on mobile browser
- [ ] Works without internet (after initial load)

## License

MIT License - Feel free to use and modify!

---

**Built for offline team collaboration when internet fails.** 🚀
