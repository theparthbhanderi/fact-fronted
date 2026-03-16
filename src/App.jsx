import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Analytics from "./pages/Analytics";
import "./App.css";

import { HomeIcon, BarChart2 } from "lucide-react";

function DesktopNavigation() {
  const location = useLocation();

  return (
    <nav className="main-nav desktop-only">
      <div className="nav-container">
        <div className="nav-logo">
          <h2>AI Fact-Checker</h2>
        </div>
        <div className="nav-links">
          <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
          <Link to="/analytics" className={location.pathname === "/analytics" ? "active" : ""}>Analytics</Link>
        </div>
      </div>
    </nav>
  );
}

function BottomNavigation() {
  const location = useLocation();
  
  return (
    <nav className="bottom-nav mobile-only">
      <div className="bottom-nav-container">
        <Link to="/" className={`bottom-tab ${location.pathname === "/" ? "active" : ""}`}>
          <HomeIcon className="tab-icon" size={24} />
          <span className="tab-label">Verify</span>
        </Link>
        <Link to="/analytics" className={`bottom-tab ${location.pathname === "/analytics" ? "active" : ""}`}>
          <BarChart2 className="tab-icon" size={24} />
          <span className="tab-label">History</span>
        </Link>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="app-container pb-safe">
        <DesktopNavigation />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
        <BottomNavigation />
      </div>
    </Router>
  );
}
