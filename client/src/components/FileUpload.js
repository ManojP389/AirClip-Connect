import React, { useRef, useState, useCallback } from 'react';

function FileUpload({ clipId, onUpload }) {
  const fileInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [lastFileName, setLastFileName] = useState(null);

  const submitFile = useCallback((file) => {
    if (!file) return;
    setLastFileName(file.name);
    onUpload(file.name, file);
    // Reset input so the same file can be selected again
    try {
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (e) {
      // ignore
    }
  }, [onUpload]);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      submitFile(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      submitFile(files[0]);
    }
  };

  return (
    <div className="file-upload">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
        id={`file-input-${clipId}`}
      />

      <div
        className={`file-dropzone ${dragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: '2px dashed rgba(0,0,0,0.1)',
          borderRadius: 8,
          padding: 16,
          textAlign: 'center',
          cursor: 'pointer',
          background: dragging ? 'rgba(0,0,0,0.03)' : 'transparent'
        }}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        <div style={{ marginBottom: 8, fontSize: 18 }}>📤 Upload File</div>
        <div style={{ color: '#666', marginBottom: 10 }}>Click or drag & drop a file here</div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={(e) => { e.stopPropagation(); fileInputRef.current && fileInputRef.current.click(); }}
          style={{ marginTop: 6 }}
        >
          Choose File
        </button>
        {lastFileName && (
          <div style={{ marginTop: 10, color: '#333' }}>Selected: {lastFileName}</div>
        )}
      </div>
    </div>
  );
}

export default FileUpload;
