import React, { useRef } from 'react';

function FileUpload({ clipId, onUpload }) {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      onUpload(file.name, file);
      // Reset input
      fileInputRef.current.value = '';
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
      <label
        htmlFor={`file-input-${clipId}`}
        className="btn btn-secondary"
      >
        📤 Upload File
      </label>
    </div>
  );
}

export default FileUpload;
