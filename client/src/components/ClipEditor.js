import React from 'react';

function ClipEditor({ title, setTitle, content, setContent, language, setLanguage, onSubmit, submitLabel }) {
  return (
    <form className="clip-editor" onSubmit={onSubmit}>
      <div className="form-group">
        <label>Title:</label>
        <input
          type="text"
          placeholder="Give your clip a name (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
        />
      </div>

      <div className="form-group">
        <label>Language:</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="select-field"
        >
          <option value="text">Plain Text</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="c">C</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="sql">SQL</option>
          <option value="bash">Bash</option>
          <option value="json">JSON</option>
          <option value="yaml">YAML</option>
          <option value="xml">XML</option>
        </select>
      </div>

      <div className="form-group">
        <label>Content:</label>
        <textarea
          placeholder="Paste your code, config, or text here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="textarea-field"
          rows="10"
          required
        />
      </div>

      <button type="submit" className="btn btn-primary btn-large">
        {submitLabel}
      </button>
    </form>
  );
}

export default ClipEditor;
