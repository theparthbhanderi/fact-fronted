import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import "./EvidenceConsensusChart.css";

const COLORS = {
  supporting: "#22c55e",
  contradicting: "#ef4444",
  neutral: "#94a3b8",
};

export default function EvidenceConsensusChart({
  supporting = 0,
  contradicting = 0,
  neutral = 0,
  note,
}) {
  const data = [
    { name: "Supporting", key: "supporting", value: supporting },
    { name: "Contradicting", key: "contradicting", value: contradicting },
    { name: "Neutral", key: "neutral", value: neutral },
  ].filter((d) => d.value > 0);

  return (
    <div className="ecc-root">
      <div className="ecc-chart">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data.length ? data : [{ name: "Neutral", key: "neutral", value: 1 }]}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={80}
              paddingAngle={2}
            >
              {(data.length ? data : [{ key: "neutral" }]).map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.key] || COLORS.neutral}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      {note ? <div className="ecc-note">{note}</div> : null}
    </div>
  );
}

