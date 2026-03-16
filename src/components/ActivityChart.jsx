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
            top: 20,
            right: 20,
            left: -20,
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
              backgroundColor: "var(--card-bg)", 
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              color: "var(--text-primary)"
            }}
            itemStyle={{ color: "#a78bfa" }}
          />
          <Line
            type="monotone"
            dataKey="Checks"
            stroke="#a78bfa"
            strokeWidth={3}
            dot={{ r: 4, fill: "#a78bfa", strokeWidth: 2, stroke: "var(--bg-color)" }}
            activeDot={{ r: 6, fill: "#818cf8", strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
