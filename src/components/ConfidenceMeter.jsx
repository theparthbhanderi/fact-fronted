import { useEffect, useState } from "react";
import "./ConfidenceMeter.css";

// Use the color passed from the ResultCard verdict for consistency
export default function ConfidenceMeter({ value, color }) {
  const pct = Math.round(value * 100);
  const [fillWidth, setFillWidth] = useState(0);

  // Animate the fill on mount
  useEffect(() => {
    // Small timeout to ensure the animation triggers after initial render
    const timer = setTimeout(() => {
      setFillWidth(pct);
    }, 100);
    return () => clearTimeout(timer);
  }, [pct]);

  return (
    <div className="confidence-meter">
      <div className="meter-header">
        <span className="meter-label">Confidence Score</span>
        <span className="meter-value" style={{ color }}>
          {pct}%
        </span>
      </div>

      <div className="meter-track">
        <div
          className="meter-fill"
          style={{ width: `${fillWidth}%`, background: color }}
        />
      </div>
    </div>
  );
}
