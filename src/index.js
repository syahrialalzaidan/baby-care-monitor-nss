import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Music from "./Music";
import Status from "./Status";
import Monitor from "./Monitor";
import { WebSocketProvider } from "./WebSocketContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <WebSocketProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/status" element={<Status />} />
        <Route path="/music" element={<Music />} />
        <Route path="/monitor" element={<Monitor />} />
      </Routes>
    </BrowserRouter>
  </WebSocketProvider>
);

reportWebVitals();
