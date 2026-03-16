import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ClaimInput from "../components/ClaimInput";
import ImageUpload from "../components/ImageUpload";
import LoadingSpinner from "../components/LoadingSpinner";
import ResultCard from "../components/ResultCard";
import EvidenceList from "../components/EvidenceList";
import HistoryPanel from "../components/HistoryPanel";
import { checkFact, checkFactImage } from "../services/api";
import "./Home.css";

export default function Home() {
  const [inputType, setInputType] = useState("text"); // 'text' or 'image'
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Analyzing claim...");
  const [error, setError] = useState("");

  const handleTextSubmit = async (claim) => {
    setLoading(true);
    setLoadingText("Analyzing claim...");
    setResult(null);
    setError("");

    try {
      const data = await checkFact(claim);
      setResult(data);
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        "Unable to verify claim. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSubmit = async (file) => {
    setLoading(true);
    setLoadingText("Extracting text and analyzing...");
    setResult(null);
    setError("");

    try {
      const data = await checkFactImage(file);
      setResult(data);
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        "Unable to process image. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Hero */}
      <header className="hero">
        <div className="hero-badge">AI-Powered</div>
        <h1 className="hero-title">Fact-Checker</h1>
        <p className="hero-subtitle">
          Verify news claims using AI and real evidence
        </p>
      </header>

      {/* Input */}
      <section className="input-section">
        <div className="input-tabs">
          {["text", "image"].map((type) => (
            <button
              key={type}
              className={`tab-btn ${inputType === type ? "active" : ""}`}
              onClick={() => setInputType(type)}
              disabled={loading}
            >
              {type === "text" ? "Enter Claim" : "Upload Screenshot"}
            </button>
          ))}
          <motion.div
            className="tab-active-pill"
            animate={{ left: inputType === "text" ? "2px" : "calc(50%)" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={inputType}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {inputType === "text" ? (
              <ClaimInput onSubmit={handleTextSubmit} loading={loading} />
            ) : (
              <ImageUpload onSubmit={handleImageSubmit} loading={loading} />
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Results area */}
      <section className="results-section">
        {loading && <LoadingSpinner text={loadingText} />}

        {error && (
          <div className="error-card">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="results-grid">
            <ResultCard result={result} />
            <EvidenceList evidence={result.evidence} />
          </div>
        )}
      </section>

      {/* History section */}
      <HistoryPanel />

      {/* Footer */}
      <footer className="footer">
        <p>
          Built with NewsAPI · Sentence-Transformers · FAISS · LLM
        </p>
      </footer>
    </div>
  );
}
