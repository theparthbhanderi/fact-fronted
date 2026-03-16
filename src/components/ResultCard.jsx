import { motion } from "framer-motion";
import ConfidenceMeter from "./ConfidenceMeter";
import "./ResultCard.css";

const VERDICT_STYLES = {
  TRUE: { color: "#22c55e", bg: "rgba(34, 197, 94, 0.08)", label: "TRUE ✓" },
  FALSE: { color: "#ef4444", bg: "rgba(239, 68, 68, 0.08)", label: "FALSE ✗" },
  UNVERIFIED: {
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.08)",
    label: "UNVERIFIED ?",
  },
};

export default function ResultCard({ result }) {
  const v = VERDICT_STYLES[result.verdict] || VERDICT_STYLES.UNVERIFIED;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="result-card"
      style={{ "--accent": v.color }}
    >
      {/* Verdict badge */}
      <div className="verdict-section" style={{ background: v.bg }}>
        <span className="verdict-badge" style={{ color: v.color }}>
          {v.label}
        </span>
      </div>

      {/* Claim */}
      <div className="result-section">
        <h3 className="section-label">Claim</h3>
        {result.original_claim && result.original_claim !== result.corrected_claim ? (
          <>
            <p className="claim-text" style={{ textDecoration: "line-through", color: "#888", fontSize: "0.9em", marginBottom: "4px" }}>
              "{result.original_claim}"
            </p>
            <p className="claim-text">"{result.corrected_claim}"</p>
          </>
        ) : (
          <p className="claim-text">"{result.corrected_claim || result.claim}"</p>
        )}
      </div>

      {/* Confidence */}
      <ConfidenceMeter
        value={result.confidence}
        breakdown={result.confidence_breakdown}
      />

      {/* Explanation */}
      <div className="result-section">
        <h3 className="section-label">AI Analysis</h3>
        <p className="explanation-text">{result.explanation}</p>
      </div>
    </motion.div>
  );
}
