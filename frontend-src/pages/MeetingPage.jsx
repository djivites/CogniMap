import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000";

export default function MeetingPage() {
  const [file, setFile] = useState(null);
  const [meetingNotes, setMeetingNotes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!file) return alert("Please upload a video file");
    try {
      setLoading(true);
      setError("");
      setMeetingNotes(null);

      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(`${API_BASE}/process/meeting`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMeetingNotes(res.data.meeting_notes);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Meeting Notes Generator</h2>

      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files[0])}
        style={{ marginBottom: "10px" }}
      />
      <br />
      <button onClick={handleSubmit} disabled={loading} style={{ marginBottom: "20px" }}>
        {loading ? "Processing..." : "Generate Meeting Notes"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {meetingNotes && (
        <div>
          <h3>Decisions</h3>
          {meetingNotes.decisions.length > 0 ? (
            <ul>
              {meetingNotes.decisions.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>No decisions recorded.</p>
          )}

          <h3>Action Items</h3>
          {meetingNotes.action_items.length > 0 ? (
            <ul>
              {meetingNotes.action_items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>No action items recorded.</p>
          )}

          <h3>Follow-ups</h3>
          {meetingNotes.follow_ups.length > 0 ? (
            <ul>
              {meetingNotes.follow_ups.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>No follow-ups recorded.</p>
          )}
        </div>
      )}
    </div>
  );
}
