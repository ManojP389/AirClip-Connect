const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { runAsync, getAsync, allAsync } = require('./db');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// GET all clips
router.get('/clips', async (req, res) => {
  try {
    const clips = await allAsync(
      `SELECT id, title, content, language, created_at, updated_at FROM clips 
       ORDER BY updated_at DESC LIMIT 100`
    );
    res.json(clips || []);
  } catch (error) {
    console.error('Error fetching clips:', error);
    res.status(500).json({ error: 'Failed to fetch clips' });
  }
});

// GET single clip with files
router.get('/clips/:id', async (req, res) => {
  try {
    const clip = await getAsync(
      `SELECT id, title, content, language, created_at, updated_at FROM clips WHERE id = ?`,
      [req.params.id]
    );

    if (!clip) {
      return res.status(404).json({ error: 'Clip not found' });
    }

    const files = await allAsync(
      `SELECT id, filename, mime_type, file_size, created_at FROM files WHERE clip_id = ? ORDER BY created_at DESC`,
      [req.params.id]
    );

    res.json({
      ...clip,
      files: files || []
    });
  } catch (error) {
    console.error('Error fetching clip:', error);
    res.status(500).json({ error: 'Failed to fetch clip' });
  }
});

// POST new clip
router.post('/clips', async (req, res) => {
  try {
    const { title, content, language } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const id = uuidv4();
    const now = new Date().toISOString();

    await runAsync(
      `INSERT INTO clips (id, title, content, language, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, title || 'Untitled', content, language || 'text', now, now]
    );

    res.status(201).json({
      id,
      title: title || 'Untitled',
      content,
      language: language || 'text',
      created_at: now,
      updated_at: now,
      files: []
    });
  } catch (error) {
    console.error('Error creating clip:', error);
    res.status(500).json({ error: 'Failed to create clip' });
  }
});

// PUT update clip
router.put('/clips/:id', async (req, res) => {
  try {
    const { title, content, language } = req.body;
    const now = new Date().toISOString();

    const clip = await getAsync('SELECT id FROM clips WHERE id = ?', [req.params.id]);
    if (!clip) {
      return res.status(404).json({ error: 'Clip not found' });
    }

    await runAsync(
      `UPDATE clips SET title = ?, content = ?, language = ?, updated_at = ? WHERE id = ?`,
      [title || 'Untitled', content, language || 'text', now, req.params.id]
    );

    res.json({
      id: req.params.id,
      title: title || 'Untitled',
      content,
      language: language || 'text',
      updated_at: now
    });
  } catch (error) {
    console.error('Error updating clip:', error);
    res.status(500).json({ error: 'Failed to update clip' });
  }
});

// DELETE clip
router.delete('/clips/:id', async (req, res) => {
  try {
    const clip = await getAsync('SELECT id FROM clips WHERE id = ?', [req.params.id]);
    if (!clip) {
      return res.status(404).json({ error: 'Clip not found' });
    }

    // Delete associated files
    const files = await allAsync('SELECT id FROM files WHERE clip_id = ?', [req.params.id]);
    for (const file of files) {
      const filePath = path.join(uploadsDir, file.id);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete clip
    await runAsync('DELETE FROM clips WHERE id = ?', [req.params.id]);

    res.json({ message: 'Clip deleted' });
  } catch (error) {
    console.error('Error deleting clip:', error);
    res.status(500).json({ error: 'Failed to delete clip' });
  }
});

// POST upload file
router.post('/clips/:id/upload', async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const clip = await getAsync('SELECT id FROM clips WHERE id = ?', [req.params.id]);
    if (!clip) {
      return res.status(404).json({ error: 'Clip not found' });
    }

    const fileId = uuidv4();
    const filePath = path.join(uploadsDir, fileId);

    fs.writeFileSync(filePath, req.file.buffer);

    await runAsync(
      `INSERT INTO files (id, clip_id, filename, mime_type, file_size, created_at) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        fileId,
        req.params.id,
        req.file.originalname,
        req.file.mimetype,
        req.file.size,
        new Date().toISOString()
      ]
    );

    res.status(201).json({
      id: fileId,
      filename: req.file.originalname,
      mime_type: req.file.mimetype,
      file_size: req.file.size
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// GET download file
router.get('/files/:fileId', async (req, res) => {
  try {
    const file = await getAsync(
      'SELECT id, filename, mime_type FROM files WHERE id = ?',
      [req.params.fileId]
    );

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = path.join(uploadsDir, file.id);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found on disk' });
    }

    res.setHeader('Content-Type', file.mime_type);
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.sendFile(filePath);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ error: 'Failed to download file' });
  }
});

// DELETE file
router.delete('/files/:fileId', async (req, res) => {
  try {
    const file = await getAsync('SELECT id FROM files WHERE id = ?', [req.params.fileId]);
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    const filePath = path.join(uploadsDir, file.id);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await runAsync('DELETE FROM files WHERE id = ?', [req.params.fileId]);
    res.json({ message: 'File deleted' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
