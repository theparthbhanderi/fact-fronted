import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Analytics from "./pages/Analytics";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { HomeIcon, BarChart2, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import "./App.css";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      className="theme-toggle"
      onClick={toggleTheme}
      whileTap={{ scale: 0.85 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      aria-label="Toggle theme"
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
      </motion.div>
    </motion.button>
  );
}

function DesktopNavigation() {
  const location = useLocation();

  return (
    <nav className="main-nav desktop-only">
      <div className="nav-container">
        <div className="nav-logo">
          <h2>AI Fact-Checker</h2>
        </div>
        <div className="nav-right">
          <div className="nav-links">
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
            <Link to="/analytics" className={location.pathname === "/analytics" ? "active" : ""}>Analytics</Link>
          </div>
          <ThemeToggle />
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

function MobileHeader() {
  return (
    <div className="mobile-header mobile-only">
      <h2>AI Fact-Checker</h2>
      <ThemeToggle />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-container pb-safe">
          <DesktopNavigation />
          <MobileHeader />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </main>
          <BottomNavigation />
        </div>
      </Router>
    </ThemeProvider>
  );
}
