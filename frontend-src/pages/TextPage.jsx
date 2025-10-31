import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000";

export default function TextPage() {
  const [textInput, setTextInput] = useState("");
  const [minLength, setMinLength] = useState(50); // default min length
  const [maxLength, setMaxLength] = useState(150); // default max length
  const [summary, setSummary] = useState("");
  const [mindmapUrl, setMindmapUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("text", textInput);
      formData.append("length", maxLength);
      formData.append("minlength", minLength);
      

      const res = await axios.post(`${API_BASE}/process/general/text`, formData);

      setSummary(res.data.summary);
      setMindmapUrl(`${API_BASE}${res.data.mindmap_image}`);
      setError(""); // reset error
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>Text to Summary</h2>
      <textarea
        placeholder="Paste text here..."
        value={textInput}
        onChange={(e) => setTextInput(e.target.value)}
      />

      <div className="number-inputs">
        <input
          type="number"
          value={minLength}
          onChange={(e) => setMinLength(e.target.value)}
          placeholder="Min Length"
        />
        <input
          type="number"
          value={maxLength}
          onChange={(e) => setMaxLength(e.target.value)}
          placeholder="Max Length"
        />
      </div>

      <button onClick={handleSubmit}>Generate Summary & Mindmap</button>

      {loading && <p>Processing...</p>}
      {error && <p className="error">{error}</p>}

      {summary && (
        <>
          <h3>Summary</h3>
          <p>{summary}</p>
        </>
      )}

      {mindmapUrl && <img src={mindmapUrl} alt="Mindmap" className="mindmap-img" />}
    </div>
  );
}

