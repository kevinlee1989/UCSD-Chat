import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'; 
import Home from './pages/Home';
import Profile from './pages/Profile';
import Search from './pages/Search';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/search" element={<Search />} />
    </Routes>
  </BrowserRouter>
);
