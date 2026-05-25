# AirClip 

**Local Network Clipboard Sharing** — Share text, code, and files instantly across devices on the same Wi-Fi network.

## What is AirClip?

AirClip is a lightweight local network clipboard server. It lets you create shared clips and upload files on one device, and then access them from any other computer or phone on the same local network.

This is ideal for situations where:
- internet is down or blocked
- you need fast local sharing at a hackathon or classroom
- you want to keep shared data inside your LAN
- you don't want to use a public paste service

## Key Features

- **Offline-first local sharing**
- **Text/code clips** with language selection
- **File upload support** for clip attachments
- **Downloads from any device** on the same network
- **SQLite persistence** for saved clip history
- **React frontend** and **Express backend**

## Project Layout

```
AirClip/
├── client/              # React frontend
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── server/              # Express backend + SQLite
│   ├── db.js
│   ├── routes.js
│   ├── server.js
│   ├── package.json
│   └── uploads/         # uploaded files stored here
├── package.json         # Root workspace scripts
└── README.md
```

## Prerequisites

- Node.js 16 or higher
- npm 7 or higher
- Devices connected to the same Wi-Fi network

## Installation & Running

```bash
cd AirClip
npm install
npm run dev
```

This starts both the backend and the React frontend together.

### Access It

Open the browser on your machine or any other device on the same network:

```text
http://<your-local-ip>:3000
```

For example:

```text
http://192.168.1.7:3000
```

To find the local IP:

- Windows: `ipconfig`
- macOS/Linux: `ifconfig` or `ip addr`

## Running Only the Server or Client

### Run backend only

```bash
cd server
npm run dev
```

### Run frontend only

```bash
cd client
npm start
```

## Usage

1. Create a new clip with title, language, and content.
2. Share the clip URL with teammates on the same network.
3. Open a clip and upload files to attach them.
4. Other devices can download uploaded files from the clip detail page.

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/clips` | List all clips |
| `POST` | `/api/clips` | Create a new clip |
| `GET` | `/api/clips/:id` | Get clip details with files |
| `DELETE` | `/api/clips/:id` | Delete a clip |
| `POST` | `/api/clips/:id/upload` | Upload a file to a clip |
| `GET` | `/api/files/:fileId` | Download a file |

## Upload & Download Flow

- Create a clip first.
- Open that clip.
- Upload a file using the visible upload area.
- The file is stored on the server in `server/uploads/`.
- Other devices can download it through the clip details screen.

## Notes

- Max upload size is currently **50MB**.
- Uploaded files are stored locally on the server disk.
- The app is built for trusted local networks only.

## Development Notes

The server uses Express with a SQLite database. The client is built with React.

If you make changes in the frontend, the app auto-refreshes in development mode.

## Future Improvements

- Real-time sync across clients
- Local service discovery (mDNS)
- QR code sharing
- Dark mode
- Access control / password protection
- Docker deployment

## License

MIT

## Author
- Manoj Kumar P 

