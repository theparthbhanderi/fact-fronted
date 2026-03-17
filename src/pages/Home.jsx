import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ClaimInput from "../components/ClaimInput";
import ImageUpload from "../components/ImageUpload";
import UrlInput from "../components/UrlInput";
import ProgressLoader from "../components/ProgressLoader";
import ClaimResultView from "../components/ClaimResultView";
import HistoryPanel from "../components/HistoryPanel";
import { checkFact, checkFactImage, checkFactUrl } from "../services/api";
import "./Home.css";

export default function Home() {
  const [inputType, setInputType] = useState("text"); // 'text', 'image', or 'url'
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTextSubmit = async (claim) => {
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const data = await checkFact(claim);
      setResult(data);
      window.dispatchEvent(new Event("historyUpdated"));
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
    setResult(null);
    setError("");

    try {
      const data = await checkFactImage(file);
      setResult(data);
      window.dispatchEvent(new Event("historyUpdated"));
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        "Unable to process image. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };
  
  const handleUrlSubmit = async (url) => {
    setLoading(true);
    setResult(null);
    setError("");

    try {
      const data = await checkFactUrl(url);
      setResult(data);
      window.dispatchEvent(new Event("historyUpdated"));
    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.detail ||
        "Failed to analyze URL. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Helper to get active tab pill offset
  const getPillOffset = () => {
    if (inputType === "text") return "2px";
    if (inputType === "image") return "calc(33.33% + 2px)";
    if (inputType === "url") return "calc(66.66% - 2px)";
    return "2px";
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
        <div className="input-tabs triple">
          {["text", "image", "url"].map((type) => (
            <button
              key={type}
              className={`tab-btn triple-tab ${inputType === type ? "active" : ""}`}
              onClick={() => { setInputType(type); setResult(null); setError(""); }}
              disabled={loading}
            >
              {type === "text" ? "Enter Claim" : type === "image" ? "Screenshot" : "Article Link"}
            </button>
          ))}
          <motion.div
            className="tab-active-pill triple-pill"
            animate={{ left: getPillOffset() }}
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
            {inputType === "text" && (
              <ClaimInput onSubmit={handleTextSubmit} loading={loading} />
            )}
            {inputType === "image" && (
              <ImageUpload onSubmit={handleImageSubmit} loading={loading} />
            )}
            {inputType === "url" && (
              <UrlInput onSubmit={handleUrlSubmit} loading={loading} />
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Results area */}
      <section className="results-section">
        {loading && <ProgressLoader />}

        {error && (
          <div className="error-card">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {(result || loading) && !result?.claims && (
          <div className="results-grid single-claim">
            {result && <ClaimResultView result={result} evidenceLoading={loading} />}
            {!result && loading && <ClaimResultView result={{}} evidenceLoading={true} />}
          </div>
        )}

        {result?.claims && (
          <div className="multi-claim-container">
            <div className="article-header-card">
              <h2 className="article-title">{result.article_title}</h2>
              <p className="article-source">Source: <a href={result.source_url} target="_blank" rel="noreferrer">{result.source_url}</a></p>
              <div className="article-stats">
                <span className="stat-badge">Extracted {result.claims.length} Claims</span>
              </div>
            </div>

            <h3 className="claims-list-title">Fact-Check Breakdown</h3>
            <div className="claims-list">
              {result.claims.map((claimResult, i) => (
                <div key={i} className="claim-breakdown-wrapper">
                   <div className="results-grid claim-row-grid">
                      <ClaimResultView result={claimResult} evidenceLoading={false} />
                   </div>
                </div>
              ))}
            </div>
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
