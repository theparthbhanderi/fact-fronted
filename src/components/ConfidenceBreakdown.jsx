import "./ConfidenceBreakdown.css";

function clamp01(x) {
  const n = Number(x);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function row(label, weight, value) {
  const v = clamp01(value);
  const w = weight;
  const contrib = v * w;
  return { label, weight: w, value: v, contrib };
}

export default function ConfidenceBreakdown({ confidence, breakdown = {} }) {
  const weights = {
    source: 0.25,
    agreement: 0.25,
    similarity: 0.15,
    llm: 0.25,
    knowledge: 0.1,
  };

  const rows = [
    row("Source credibility", weights.source, breakdown.avg_source_score),
    row("Evidence agreement", weights.agreement, breakdown.agreement_score),
    row("Semantic similarity", weights.similarity, breakdown.avg_similarity),
    row("AI reasoning certainty", weights.llm, breakdown.llm_confidence),
    row("Knowledge verification", weights.knowledge, breakdown.knowledge_score),
  ];

  const total = rows.reduce((s, r) => s + r.contrib, 0);
  const shown = clamp01(confidence ?? total);

  return (
    <div className="cb-root">
      <div className="cb-header">
        <div className="cb-title">Confidence Breakdown</div>
        <div className="cb-score">Confidence Score: {(shown * 100).toFixed(0)}%</div>
      </div>

      <div className="cb-rows">
        {rows.map((r) => (
          <div key={r.label} className="cb-row">
            <div className="cb-row-label">{r.label}</div>
            <div className="cb-row-bar">
              <div
                className="cb-row-barFill"
                style={{ width: `${Math.round(r.contrib * 100)}%` }}
              />
            </div>
            <div className="cb-row-value">{r.contrib.toFixed(2)}</div>
          </div>
        ))}
      </div>

      {breakdown.memory_hit ? (
        <div className="cb-note">Returned from memory (confidence boosted).</div>
      ) : null}
    </div>
  );
}

