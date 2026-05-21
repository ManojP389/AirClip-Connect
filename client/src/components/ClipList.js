import React from 'react';

function ClipList({ clips, selectedClip, onSelectClip, onDeleteClip, onCopyClip }) {
  return (
    <div className="clips-container">
      {clips.map((clip) => (
        <div
          key={clip.id}
          className={`clip-card ${selectedClip?.id === clip.id ? 'active' : ''}`}
          onClick={() => onSelectClip(clip)}
        >
          <div className="clip-card-header">
            <h3>{clip.title}</h3>
            <span className="language-badge">{clip.language}</span>
          </div>

          <p className="clip-preview">
            {clip.content.substring(0, 100)}
            {clip.content.length > 100 ? '...' : ''}
          </p>

          <div className="clip-card-footer">
            <span className="clip-time">
              {new Date(clip.created_at).toLocaleTimeString()}
            </span>
            <div className="clip-actions">
              <button
                className="btn btn-small btn-copy"
                onClick={(e) => {
                  e.stopPropagation();
                  onCopyClip(clip.content);
                }}
                title="Copy content"
              >
                📋 Copy
              </button>
              <button
                className="btn btn-small btn-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClip(clip.id);
                }}
                title="Delete clip"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ClipList;
