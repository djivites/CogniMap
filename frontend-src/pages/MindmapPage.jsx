import React, { useState } from "react";
import axios from "axios";

export default function MindmapPage() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const handleGenerate = async () => {
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/mindmap",
        { text },
        { responseType: "blob" }
      );
      const url = URL.createObjectURL(res.data);
      setImage(url);
    } catch (err) {
      alert("Error generating mindmap");
    }
  };

  return (
    <div className="page-container">
      <h1> Mind Map Generator</h1>
      <textarea
        placeholder="Enter text to create mindmap..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleGenerate}>Generate Mindmap</button>
      {image && (
        <div className="mindmap-box">
          <img src={image} alt="Mindmap" />
        </div>
      )}
    </div>
  );
}
