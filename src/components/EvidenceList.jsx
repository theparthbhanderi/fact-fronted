import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import "./EvidenceList.css";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemAnim = {
  hidden: { opacity: 0, y: 15 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function EvidenceList({ evidence, loading }) {
  if (!loading && (!evidence || evidence.length === 0)) return null;

  // Render Skeleton if loading
  if (loading) {
    return (
      <div className="evidence-list evidence-loading">
        <h3 className="evidence-title">Analyzing Sources...</h3>
        <div className="evidence-grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="evidence-card skeleton-card">
              <div className="skeleton-content">
                <div className="skeleton-line title" />
                <div className="skeleton-line snippet" />
                <div className="skeleton-line snippet short" />
                <div className="skeleton-meta">
                  <div className="skeleton-badge" />
                  <div className="skeleton-badge small" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Determine credibility tag based on publisher string
  const getCredibilityTag = (sourceName) => {
    const s = sourceName.toLowerCase();
    if (s.includes("reuters") || s.includes("ap") || s.includes("bbc") || s.includes("npr")) {
      return "News Agency";
    }
    if (s.includes("who") || s.includes("cdc") || s.includes("gov") || s.includes("official")) {
      return "Official Organization";
    }
    if (s.includes("pubmed") || s.includes("nature") || s.includes("science") || s.includes("journal")) {
      return "Research Paper";
    }
    return "Trusted Source";
  };

  return (
    <div className="evidence-list">
      <h3 className="evidence-title">Evidence & Sources</h3>
      <motion.div
        className="evidence-grid"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {evidence.slice(0, 3).map((item, i) => (
          <motion.div key={i} variants={itemAnim} className="evidence-card">
            <div className="evidence-card-header">
              <h4 className="evidence-headline">{item.title}</h4>
            </div>

            <p className="evidence-snippet">"{item.snippet || "No direct snippet available."}"</p>

            <div className="evidence-card-footer">
              <div className="evidence-meta">
                <span className="evidence-source">{item.source || "Web"}</span>
                <span className="credibility-badge">{getCredibilityTag(item.source || "")}</span>
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="evidence-link-btn"
              >
                Read Source <ArrowUpRight size={14} className="link-icon" />
              </a>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
