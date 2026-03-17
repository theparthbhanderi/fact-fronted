import "./EvidenceStrengthBars.css";

function clamp01(x) {
  const n = Number(x);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export default function EvidenceStrengthBars({ evidence = [] }) {
  const bySource = new Map();

  evidence.forEach((e) => {
    const source = e?.source || "Web";
    const cred = clamp01(Number(e?.credibility_score ?? e?.source_credibility ?? 0));
    const sim = clamp01(Number(e?.similarity_score ?? e?.score ?? 0));
    const prev = bySource.get(source) || { count: 0, credSum: 0, simSum: 0 };
    bySource.set(source, {
      count: prev.count + 1,
      credSum: prev.credSum + cred,
      simSum: prev.simSum + sim,
    });
  });

  const rows = Array.from(bySource.entries()).map(([source, agg]) => {
    const avgCred = agg.count ? agg.credSum / agg.count : 0;
    const avgSim = agg.count ? agg.simSum / agg.count : 0;
    const strength = clamp01(avgCred * 0.55 + avgSim * 0.45);
    return { source, avgCred, avgSim, strength };
  });

  rows.sort((a, b) => b.strength - a.strength);

  return (
    <div className="esb-root">
      <div className="esb-title">Evidence Strength</div>
      <div className="esb-list">
        {rows.slice(0, 8).map((r) => (
          <div key={r.source} className="esb-row">
            <div className="esb-source">{r.source}</div>
            <div className="esb-bar">
              <div
                className="esb-barFill"
                style={{ width: `${Math.round(r.strength * 100)}%` }}
              />
            </div>
            <div className="esb-score">{r.strength.toFixed(2)}</div>
          </div>
        ))}
      </div>
      <div className="esb-note">
        Strength combines credibility and semantic similarity.
      </div>
    </div>
  );
}

