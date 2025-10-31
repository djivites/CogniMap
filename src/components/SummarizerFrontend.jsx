import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000"; // adjust if your backend is different

export default function SummarizerFrontend({ mode }) {
  const [file, setFile] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [length, setLength] = useState(150);
  const [summary, setSummary] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");
  const [mindmapUrl, setMindmapUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const postFile = async (endpoint, fileObj) => {
    const form = new FormData();
    form.append("file", fileObj);
    form.append("length", String(length));
    const res = await axios.post(`${API_BASE}${endpoint}`, form);
    return res.data;
  };

  const postForm = async (endpoint, dataObj) => {
    const body = new FormData();
    Object.entries(dataObj).forEach(([k, v]) => body.append(k, v));
    const res = await axios.post(`${API_BASE}${endpoint}`, body);
    return res.data;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      let data;
      switch (mode) {
        case "text":
          data = await postForm("/process/general/text", { text: textInput, length });
          setSummary(data.summary);
          setMindmapUrl(`${API_BASE}${data.mindmap_image}`);
          break;
        case "audio":
          data = await postFile("/process/general/audio", file);
          setSummary(data.summary);
          setMindmapUrl(`${API_BASE}${data.mindmap_image}`);
          break;
        case "video":
          data = await postFile("/process/general/video", file);
          setSummary(data.summary);
          setMindmapUrl(`${API_BASE}${data.mindmap_image}`);
          break;
        case "document":
          data = await postFile("/process/general/document", file);
          setSummary(data.summary);
          setMindmapUrl(`${API_BASE}${data.mindmap_image}`);
          break;
        case "meeting":
          data = await postFile("/process/meeting", file);
          setMeetingNotes(data.meeting_notes);
          break;
        default:
          break;
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        {mode === "meeting" ? "Meeting Notes Generator" : "AI Content Summarizer"}
      </h1>

      {mode === "text" && (
        <div className="space-y-2">
          <textarea
            className="w-full border p-2 rounded"
            rows="6"
            placeholder="Paste text here"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
        </div>
      )}

      {mode !== "text" && (
        <div className="space-y-2">
          <input
            type="file"
            className="border p-2 rounded w-full"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>
      )}

      <button
        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded hover:scale-105 transition-transform"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Processing..." : "Submit"}
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {summary && (
        <div className="bg-gray-100 p-4 rounded mt-4">
          <h2 className="font-semibold mb-2 text-lg">Summary</h2>
          <p>{summary}</p>
        </div>
      )}

      {mindmapUrl && (
        <div className="mt-4">
          <h2 className="font-semibold mb-2 text-lg">Mindmap</h2>
          <img src={mindmapUrl} alt="Mindmap" className="border rounded w-full" />
        </div>
      )}

      {meetingNotes && (
        <div className="bg-gray-100 p-4 rounded mt-4">
          <h2 className="font-semibold mb-2 text-lg">Meeting Notes</h2>
          <p>{meetingNotes}</p>
        </div>
      )}
    </div>
  );
}
