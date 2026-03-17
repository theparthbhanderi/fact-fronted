import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ActivityChart({ data }) {
  if (!data || data.length === 0) {
    return <div className="empty-state">No activity data available yet.</div>;
  }

  // Format dates for display
  const formattedData = data.map((item) => {
    const dateObj = new Date(item.date);
    return {
      name: dateObj.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      Checks: item.count,
    };
  });

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <LineChart
          data={formattedData}
          margin={{
            top: 16,
            right: 16,
            left: -16,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="name" 
            stroke="var(--text-secondary)" 
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }} 
            tickMargin={10}
          />
          <YAxis 
            stroke="var(--text-secondary)" 
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }} 
            allowDecimals={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "var(--surface)", 
              border: "1px solid var(--border)",
              borderRadius: "12px",
              color: "var(--text-primary)"
            }}
            itemStyle={{ color: "#7C7CFF" }}
          />
          <Line
            type="monotone"
            dataKey="Checks"
            stroke="#7C7CFF"
            strokeWidth={3}
            dot={{ r: 4, fill: "#7C7CFF", strokeWidth: 2, stroke: "var(--bg)" }}
            activeDot={{ r: 6, fill: "#7C7CFF", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
