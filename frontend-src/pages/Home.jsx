import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const options = [
    { label: "Text to Summary", path: "/text", color: "linear-gradient(to right, #00c6ff, #0072ff)" },
    { label: "Audio to Summary", path: "/audio", color: "linear-gradient(to right, #7bed9f, #2ecc71)" },
    { label: "Video to Summary", path: "/video", color: "linear-gradient(to right, #ff758c, #ff7eb3)" },
    { label: "File Extractor", path: "/file", color: "linear-gradient(to right, #f6d365, #fda085)" },
    { label: "Meeting Notes Generator", path: "/meeting", color: "linear-gradient(to right, #ff9a9e, #fecfef)" },
    { label: "YouTube to Summary", path: "/youtube", color: "linear-gradient(to right, #ffb347, #ffcc33)" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f2f0f8ff", padding: "50px", textAlign: "center" }}>
      <h1 style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "50px" }}>AI Content Summarizer</h1>
      <h1 style={{ fontSize: "12px", fontWeight: "bold", marginBottom: "50px" }}> SUMMARIZE    |   MINDMAP  |   MEETING NOTES </h1>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "30px" }}>
        {options.map((opt) => (
          <div
            key={opt.label}
            onClick={() => navigate(opt.path)}
            style={{
              cursor: "pointer",
              background: opt.color,
              color: "#fff",
              padding: "40px 60px",
              borderRadius: "20px",
              boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            <h2 style={{ fontSize: "20px", fontWeight: "600" }}>{opt.label}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
