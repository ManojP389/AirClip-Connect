const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'airclip.db');

let db = null;

function initializeDB() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err);
        reject(err);
      } else {
        console.log('Connected to SQLite database at:', DB_PATH);
        createTables()
          .then(() => {
            console.log('Database tables ready');
            resolve();
          })
          .catch(reject);
      }
    });
  });
}

function createTables() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Clips table
      db.run(
        `CREATE TABLE IF NOT EXISTS clips (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          language TEXT DEFAULT 'text',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        (err) => {
          if (err) {
            console.error('Error creating clips table:', err);
            reject(err);
          }
        }
      );

      // Files table
      db.run(
        `CREATE TABLE IF NOT EXISTS files (
          id TEXT PRIMARY KEY,
          clip_id TEXT NOT NULL,
          filename TEXT NOT NULL,
          mime_type TEXT,
          file_size INTEGER,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(clip_id) REFERENCES clips(id) ON DELETE CASCADE
        )`,
        (err) => {
          if (err) {
            console.error('Error creating files table:', err);
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  });
}

function getDB() {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
}

function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    getDB().run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    getDB().get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    getDB().all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function closeDB() {
  return new Promise((resolve, reject) => {
    if (db) {
      db.close((err) => {
        if (err) reject(err);
        else {
          console.log('Database closed');
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}

module.exports = {
  initializeDB,
  getDB,
  runAsync,
  getAsync,
  allAsync,
  closeDB
};
