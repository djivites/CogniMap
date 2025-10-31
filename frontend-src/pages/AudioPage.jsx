import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000";

export default function AudioPage() {
  const [file, setFile] = useState(null);
  const [minLength, setMinLength] = useState(50); // default min length
  const [maxLength, setMaxLength] = useState(150); // default max length
  const [summary, setSummary] = useState("");
  const [mindmapUrl, setMindmapUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!file) return alert("Please upload an audio file");
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("length", maxLength);
      formData.append("minlength", minLength);
      

      const res = await axios.post(`${API_BASE}/process/general/audio`, formData);

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
      <h2>Audio to Summary</h2>
      <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files[0])} />

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
