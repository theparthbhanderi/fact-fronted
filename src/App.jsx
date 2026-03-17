import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Analytics from "./pages/Analytics";
import History from "./pages/History";
import Result from "./pages/Result";
import NewsReader from "./pages/NewsReader";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { HomeIcon, BarChart2, History as HistoryIcon, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import SegmentedControl from "./components/SegmentedControl";
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
  const navigate = useNavigate();

  return (
    <nav className="main-nav desktop-only">
      <div className="nav-container">
        <div className="nav-logo">
          <h2>AI Fact-Checker</h2>
        </div>
        <div className="nav-right">
          <SegmentedControl
            ariaLabel="Primary navigation"
            layoutId="seg-nav-active"
            value={
              location.pathname.startsWith("/history")
                ? "/history"
                : location.pathname.startsWith("/analytics")
                  ? "/analytics"
                  : "/"
            }
            onChange={(v) => navigate(String(v))}
            items={[
              { value: "/", label: "Home" },
              { value: "/analytics", label: "Analytics" },
              { value: "/history", label: "History" },
            ]}
          />
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
          <HomeIcon className="tab-icon" size={20} />
          <span className="tab-label">Home</span>
        </Link>
        <Link to="/analytics" className={`bottom-tab ${location.pathname.startsWith("/analytics") ? "active" : ""}`}>
          <BarChart2 className="tab-icon" size={20} />
          <span className="tab-label">Analytics</span>
        </Link>
        <Link to="/history" className={`bottom-tab ${location.pathname.startsWith("/history") ? "active" : ""}`}>
          <HistoryIcon className="tab-icon" size={20} />
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
              <Route path="/history" element={<History />} />
              <Route path="/result/:id" element={<Result />} />
              <Route path="/news" element={<NewsReader />} />
            </Routes>
          </main>
          <BottomNavigation />
        </div>
      </Router>
    </ThemeProvider>
  );
}
