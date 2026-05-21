const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const os = require('os');
const { initializeDB, closeDB } = require('./db');
const routes = require('./routes');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Multer for file uploads
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

// Static files
app.use(express.static(path.join(__dirname, '../client/build')));

// API Routes
app.use('/api', routes);

// File upload endpoint with multer
app.post('/api/clips/:id/upload', upload.single('file'), async (req, res) => {
  // Delegate to the actual route handler
  const routes = require('./routes');
  // This is handled in routes.js
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Initialize database and start server
async function start() {
  try {
    await initializeDB();

    app.listen(PORT, '0.0.0.0', () => {
      const localIP = getLocalIP();
      console.log('\n========================================');
      console.log('🎯 AirClip Server Started');
      console.log('========================================');
      console.log(`\n✅ Server running on http://0.0.0.0:${PORT}`);
      console.log(`\n📱 Access from other devices:`);
      console.log(`   🌐 http://${localIP}:${PORT}`);
      console.log(`\n💡 Share this URL with your team!`);
      console.log('========================================\n');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\nShutting down...');
      await closeDB();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

module.exports = app;
