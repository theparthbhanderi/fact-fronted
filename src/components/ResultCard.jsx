import { motion, AnimatePresence } from "framer-motion";
import ConfidenceMeter from "./ConfidenceMeter";
import "./ResultCard.css";

const VERDICT_STYLES = {
  TRUE: { color: "#22c55e", bg: "rgba(34, 197, 94, 0.15)", label: "TRUE" },
  FALSE: { color: "#ef4444", bg: "rgba(239, 68, 68, 0.15)", label: "FALSE" },
  MISLEADING: {
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.15)",
    label: "MISLEADING",
  },
  UNVERIFIED: {
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.15)",
    label: "UNVERIFIED",
  },
};

export default function ResultCard({ result, headerAction, isTranslating }) {
  // Map backend verdicts to our styles. Assume 'False' maps to 'FALSE', etc.
  const rawVerdict = result.verdict?.toUpperCase() || "UNVERIFIED";
  let v = VERDICT_STYLES[rawVerdict];
  
  if (!v) {
    if (rawVerdict.includes("TRUE")) v = VERDICT_STYLES.TRUE;
    else if (rawVerdict.includes("MISLEADING") || rawVerdict.includes("PARTIALLY")) v = VERDICT_STYLES.MISLEADING;
    else if (rawVerdict.includes("FALSE")) v = VERDICT_STYLES.FALSE;
    else v = VERDICT_STYLES.UNVERIFIED;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      className="result-card"
      style={{ "--accent": v.color }}
    >
      {/* Verdict & Claim */}
      <div className="result-section">
        <div className="claim-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 className="section-label">Claim</h3>
            <span
              className="verdict-pill"
              style={{ color: v.color, backgroundColor: v.bg }}
            >
              {v.label}
            </span>
          </div>
          {headerAction && <div className="header-action">{headerAction}</div>}
        </div>
        
        {result.original_claim && result.original_claim !== result.corrected_claim ? (
          <>
            <p className="claim-text claim-text-strike">
              "{result.original_claim}"
            </p>
            <p className="claim-text">"{result.corrected_claim}"</p>
          </>
        ) : (
          <p className="claim-text">"{result.corrected_claim || result.claim}"</p>
        )}
      </div>

      <div className="divider" />

      {/* Confidence */}
      <div className="result-section confidence-section">
         <ConfidenceMeter
          value={result.confidence}
          color={v.color}
        />
      </div>

      <div className="divider" />

      {/* Explanation */}
      <div className="result-section explanation-section">
        <h3 className="section-label">Explanation</h3>
        <AnimatePresence mode="wait">
          {isTranslating ? (
            <motion.p
              key="translating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="explanation-text"
              style={{ fontStyle: "italic", opacity: 0.6 }}
            >
              Translating...
            </motion.p>
          ) : (
            <motion.p
              key={result.explanation}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="explanation-text"
            >
              {result.explanation}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
