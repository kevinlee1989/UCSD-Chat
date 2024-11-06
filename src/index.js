import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Profile from './pages/profile'; // Ensure correct import path

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} /> {/* Add default route */}
      <Route path="/profile" element={<Profile />} />
    </Routes>
  </BrowserRouter>
);
