import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TextPage from "./pages/TextPage";
import AudioPage from "./pages/AudioPage";
import VideoPage from "./pages/VideoPage";
import FilePage from "./pages/FilePage";
import MeetingPage from "./pages/MeetingPage";
import YoutubePage from "./pages/YouTubePage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/text" element={<TextPage />} />
        <Route path="/audio" element={<AudioPage />} />
        <Route path="/video" element={<VideoPage />} />
        <Route path="/file" element={<FilePage />} />
        <Route path="/meeting" element={<MeetingPage />} />
        <Route path="/youtube" element={<YoutubePage />} />
      </Routes>
    </Router>
  );
}
