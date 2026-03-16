import "./ConfidenceMeter.css";

const COLORS = {
  high: "#22c55e",
  medium: "#f59e0b",
  low: "#ef4444",
};

function getColor(value) {
  if (value >= 0.75) return COLORS.high;
  if (value >= 0.5) return COLORS.medium;
  return COLORS.low;
}

export default function ConfidenceMeter({ value, breakdown }) {
  const pct = Math.round(value * 100);
  const color = getColor(value);

  return (
    <div className="confidence-meter">
      <div className="meter-header">
        <span className="meter-label">Confidence</span>
        <span className="meter-value" style={{ color }}>
          {pct}%
        </span>
      </div>

      <div className="meter-track">
        <div
          className="meter-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>

      {breakdown && (
        <div className="meter-breakdown">
          <div className="breakdown-item">
            <span>🤖 LLM</span>
            <span>{Math.round(breakdown.llm_confidence * 100)}%</span>
          </div>
          <div className="breakdown-item">
            <span>🔍 Similarity</span>
            <span>{Math.round(breakdown.avg_similarity * 100)}%</span>
          </div>
          <div className="breakdown-item">
            <span>📰 Source Trust</span>
            <span>{Math.round(breakdown.avg_source_score * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}
