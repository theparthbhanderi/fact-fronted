import ForceGraph2D from "react-force-graph-2d";
import { useMemo } from "react";
import "./EvidenceGraph.css";

function clamp01(x) {
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

function buildGraphData(claimLabel, evidence = []) {
  const claimNodeId = "claim";

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

  const nodes = [
    { id: claimNodeId, name: claimLabel || "Claim", type: "claim", credibility: 1 },
  ];
  const links = [];

  for (const [source, agg] of bySource.entries()) {
    const avgCred = agg.count ? agg.credSum / agg.count : 0;
    const avgSim = agg.count ? agg.simSum / agg.count : 0;
    const nodeId = `src:${source}`;
    nodes.push({
      id: nodeId,
      name: source,
      type: "source",
      credibility: avgCred,
      similarity: avgSim,
    });
    links.push({ source: claimNodeId, target: nodeId, value: 1 });
  }

  return { nodes, links };
}

export default function EvidenceGraph({ claim, evidence }) {
  const data = useMemo(
    () => buildGraphData(claim, evidence || []),
    [claim, evidence]
  );

  return (
    <div className="eg-root">
      <div className="eg-canvas">
        <ForceGraph2D
          graphData={data}
          width={undefined}
          height={340}
          nodeRelSize={6}
          linkWidth={1.5}
          linkColor={() => "rgba(255,255,255,0.14)"}
          nodeCanvasObject={(node, ctx) => {
            const isClaim = node.type === "claim";
            const radius = isClaim ? 18 : 14;
            const cred = clamp01(node.credibility);

            const fill = isClaim
              ? "rgba(99, 102, 241, 0.55)"
              : `rgba(34, 197, 94, ${0.15 + cred * 0.6})`;

            ctx.beginPath();
            ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = fill;
            ctx.fill();

            ctx.lineWidth = 1;
            ctx.strokeStyle = "rgba(255,255,255,0.22)";
            ctx.stroke();

            const label = node.name;
            ctx.font = "12px ui-sans-serif, system-ui, -apple-system";
            ctx.fillStyle = "rgba(255,255,255,0.9)";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(label, node.x, node.y + radius + 14);

            if (!isClaim) {
              ctx.font = "11px ui-sans-serif, system-ui, -apple-system";
              ctx.fillStyle = "rgba(255,255,255,0.75)";
              ctx.fillText(`cred ${cred.toFixed(2)}`, node.x, node.y + radius + 28);
            }
          }}
        />
      </div>
      <div className="eg-hint">
        Tip: sources closer to the claim node tend to be higher-similarity.
      </div>
    </div>
  );
}

