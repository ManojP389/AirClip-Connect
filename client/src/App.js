import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ClipEditor from './components/ClipEditor';
import ClipList from './components/ClipList';
import FileUpload from './components/FileUpload';
import './App.css';

function App() {
  const [clips, setClips] = useState([]);
  const [selectedClip, setSelectedClip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('text');

  // Use a relative API path so clients on other devices call the server host
  // (avoids requests to each device's localhost). Can be overridden with REACT_APP_API_URL.
  const API_URL = process.env.REACT_APP_API_URL || '/api';

  // Load clips

  const loadClipDetails = useCallback(async (id) => {
    try {
      const response = await axios.get(`${API_URL}/clips/${id}`);
      return response.data;
    } catch (err) {
      console.error('Failed to load clip details:', err);
      alert('Failed to load clip details');
      return null;
    }
  }, [API_URL]);

  const loadClips = useCallback(async () => {
    try {
      setError(null);
      const response = await axios.get(`${API_URL}/clips`);
      setClips(response.data);
      if (selectedClip?.id) {
        const details = await loadClipDetails(selectedClip.id);
        if (details) {
          setSelectedClip(details);
        }
      }
      setLoading(false);
    } catch (err) {
      console.error('Failed to load clips:', err);
      setError('Failed to connect to server');
      setLoading(false);
    }
  }, [API_URL, selectedClip, loadClipDetails]);

  useEffect(() => {
    loadClips();
    const interval = setInterval(loadClips, 3000); // Auto-refresh every 3 seconds
    return () => clearInterval(interval);
  }, [loadClips]);

  async function handleSelectClip(clip) {
    const details = await loadClipDetails(clip.id);
    if (details) {
      setSelectedClip(details);
    }
  }

  async function handleCreateClip(e) {
    e.preventDefault();
    if (!content.trim()) {
      alert('Content cannot be empty');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/clips`, {
        title: title || 'Untitled',
        content,
        language
      });
      setClips([response.data, ...clips]);
      // Select the newly created clip so user can immediately upload files
      const details = await loadClipDetails(response.data.id);
      if (details) {
        setSelectedClip(details);
      }
      setContent('');
      setTitle('');
      setLanguage('text');
      alert('✅ Clip created! You can now upload files to this clip.');
    } catch (err) {
      console.error('Failed to create clip:', err);
      alert('Failed to create clip');
    }
  }

  async function handleDeleteClip(id) {
    if (!window.confirm('Delete this clip?')) return;
    try {
      await axios.delete(`${API_URL}/clips/${id}`);
      setClips(clips.filter(c => c.id !== id));
      if (selectedClip?.id === id) {
        setSelectedClip(null);
      }
    } catch (err) {
      console.error('Failed to delete clip:', err);
      alert('Failed to delete clip');
    }
  }

  async function handleFileUpload(fileId, file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      await axios.post(`${API_URL}/clips/${selectedClip.id}/upload`, formData);
      // Reload the selected clip with file metadata
      const details = await loadClipDetails(selectedClip.id);
      if (details) {
        setSelectedClip(details);
        const updatedClips = clips.map(c => c.id === details.id ? details : c);
        setClips(updatedClips);
      }
    } catch (err) {
      console.error('Failed to upload file:', err);
      alert('Failed to upload file');
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      alert('✅ Copied to clipboard!');
    });
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>🎯 AirClip</h1>
        <p>Local Network Clipboard Sharing</p>
        <div className="status-bar">
          <span className="status-dot"></span>
          <span className="status-text">Connected to Local Network</span>
        </div>
      </header>

      <div className="app-container">
        <div className="main-section">
          {/* New Clip Creator */}
          <div className="section new-clip-section">
            <h2>📝 Create New Clip</h2>
            <ClipEditor
              title={title}
              setTitle={setTitle}
              content={content}
              setContent={setContent}
              language={language}
              setLanguage={setLanguage}
              onSubmit={handleCreateClip}
              submitLabel="Share Clip"
            />
          </div>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Loading */}
          {loading && <div className="loading">Loading clips...</div>}

          {/* Clips List */}
          {!loading && (
            <div className="section clips-list-section">
              <h2>📋 Shared Clips ({clips.length})</h2>
              {clips.length === 0 ? (
                <div className="empty-state">
                  <p>No clips shared yet. Create one above! 👆</p>
                </div>
              ) : (
                <ClipList
                  clips={clips}
                  selectedClip={selectedClip}
                  onSelectClip={handleSelectClip}
                  onDeleteClip={handleDeleteClip}
                  onCopyClip={copyToClipboard}
                />
              )}
            </div>
          )}
        </div>

        {/* Selected Clip Details */}
        {selectedClip && (
          <div className="section clip-detail-section">
            <h2>👁️ Clip Details</h2>
            <div className="clip-detail">
              <div className="clip-header">
                <h3>{selectedClip.title}</h3>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteClip(selectedClip.id)}
                >
                  🗑️ Delete
                </button>
              </div>

              <div className="clip-meta">
                <span className="language-badge">{selectedClip.language}</span>
                <span className="timestamp">
                  {new Date(selectedClip.created_at).toLocaleString()}
                </span>
              </div>

              <div className="clip-content-container">
                <pre>
                  <code>{selectedClip.content}</code>
                </pre>
                <button
                  className="btn btn-primary"
                  onClick={() => copyToClipboard(selectedClip.content)}
                >
                  📋 Copy Content
                </button>
              </div>

              {/* File Upload Section */}
              <div className="files-section">
                <h4>📁 Files</h4>
                <FileUpload
                  clipId={selectedClip.id}
                  onUpload={handleFileUpload}
                />

                {selectedClip.files && selectedClip.files.length > 0 && (
                  <div className="files-list">
                    <h5>Uploaded Files:</h5>
                    {selectedClip.files.map(file => (
                      <div key={file.id} className="file-item">
                        <span className="file-name">📄 {file.filename}</span>
                        <span className="file-size">
                          ({(file.file_size / 1024).toFixed(2)} KB)
                        </span>
                        <a
                          href={`${API_URL}/files/${file.id}`}
                          download={file.filename}
                          className="btn btn-small"
                        >
                          ⬇️ Download
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <footer className="app-footer">
        <p>🌐 Share this URL with your team: <code>{window.location.href}</code></p>
        <p>💡 Works offline on local Wi-Fi network</p>
      </footer>
    </div>
  );
}

export default App;
