import { useState, useEffect } from "react";
import TrendingClaims from "../components/TrendingClaims";
import FalseClaims from "../components/FalseClaims";
import ActivityChart from "../components/ActivityChart";
import {
  getTrendingClaims,
  getFalseClaims,
  getActivityStats,
  getHistory,
} from "../services/api";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import "./Analytics.css";

const VERDICT_COLORS = {
  TRUE: "#22c55e",
  FALSE: "#ef4444",
  MISLEADING: "#f59e0b",
  UNVERIFIED: "#94a3b8",
};

function domainFromUrl(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function topKeywords(claims, limit = 5) {
  const stop = new Set([
    "the","a","an","and","or","but","if","then","so","to","of","in","on","for","with","at","by","from","as","is","are","was","were","be","been","being","this","that","these","those",
  ]);
  const freq = new Map();
  for (const c of claims) {
    const text = String(c || "").toLowerCase();
    const words = text.match(/[a-z]{3,}/g) || [];
    for (const w of words) {
      if (stop.has(w)) continue;
      freq.set(w, (freq.get(w) || 0) + 1);
    }
  }
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([k, v]) => ({ topic: k, count: v }));
}

export default function Analytics() {
  const [trending, setTrending] = useState([]);
  const [falseClaims, setFalseClaims] = useState([]);
  const [activity, setActivity] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const [trendingData, falseData, activityData, historyData] = await Promise.all([
          getTrendingClaims(5),
          getFalseClaims(5),
          getActivityStats(),
          getHistory(500),
        ]);
        
        setTrending(trendingData);
        setFalseClaims(falseData);
        setActivity(activityData);
        setHistory(Array.isArray(historyData) ? historyData : []);
        setError("");
      } catch (err) {
        console.error("Failed to load analytics:", err);
        setError("Failed to load analytics dashboard.");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  const metrics = (() => {
    const total = history.length;
    const falseCount = history.filter((r) => String(r?.verdict || "").toUpperCase() === "FALSE").length;
    const avgConf =
      total > 0
        ? history.reduce((s, r) => s + (Number(r?.confidence) || 0), 0) / total
        : 0;
    const topics = topKeywords(history.map((r) => r?.claim), 1);
    const mostActiveTopic = topics[0]?.topic ? topics[0].topic.toUpperCase() : "—";
    return {
      total,
      falseCount,
      mostActiveTopic,
      avgConf,
    };
  })();

  const verdictData = (() => {
    const counts = { TRUE: 0, FALSE: 0, MISLEADING: 0, UNVERIFIED: 0 };
    for (const r of history) {
      const v = String(r?.verdict || "UNVERIFIED").toUpperCase();
      if (counts[v] === undefined) counts.UNVERIFIED += 1;
      else counts[v] += 1;
    }
    return Object.entries(counts)
      .map(([k, v]) => ({ name: k, value: v }))
      .filter((d) => d.value > 0);
  })();

  const topicsData = topKeywords(history.map((r) => r?.claim), 6);

  const sourcesData = (() => {
    const freq = new Map();
    for (const r of history) {
      const ev = Array.isArray(r?.evidence) ? r.evidence : [];
      for (const e of ev) {
        const d = domainFromUrl(e?.url || "");
        if (!d) continue;
        freq.set(d, (freq.get(d) || 0) + 1);
      }
    }
    return Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([domain, count]) => ({ domain, count }));
  })();

  if (loading) {
    return (
      <div className="analytics-page loading">
        <div className="analytics-spinner"></div>
        <p>Crunching the numbers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-page error">
        <h2>Analytics Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <header className="analytics-header">
        <h1>Misinformation Intelligence</h1>
        <p>Dashboard view of activity, verdicts, topics, and sources.</p>
      </header>

      <section className="analytics-metrics">
        <div className="metric-card">
          <div className="metric-label">Total Fact Checks</div>
          <div className="metric-value">{metrics.total}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">False Claims Detected</div>
          <div className="metric-value">{metrics.falseCount}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Most Active Topic</div>
          <div className="metric-value">{metrics.mostActiveTopic}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Average Confidence</div>
          <div className="metric-value">{Math.round(metrics.avgConf * 100)}%</div>
        </div>
      </section>

      <section className="analytics-grid">
        <div className="analytics-card span-full">
          <h2>Fact-check activity</h2>
          <ActivityChart data={activity} />
        </div>

        <div className="analytics-card">
          <h2>Verdict distribution</h2>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={verdictData.length ? verdictData : [{ name: "UNVERIFIED", value: 1 }]} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} paddingAngle={2}>
                  {(verdictData.length ? verdictData : [{ name: "UNVERIFIED" }]).map((entry, idx) => (
                    <Cell key={idx} fill={VERDICT_COLORS[entry.name] || VERDICT_COLORS.UNVERIFIED} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-card">
          <h2>Top misinformation topics</h2>
          {topicsData.length ? (
            <ul className="topics-list">
              {topicsData.map((t) => (
                <li key={t.topic} className="topic-row">
                  <span className="topic-name">{t.topic.toUpperCase()}</span>
                  <span className="topic-count">{t.count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">No topics yet.</div>
          )}
        </div>

        <div className="analytics-card span-full">
          <h2>Source reliability (most cited domains)</h2>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={sourcesData} margin={{ top: 8, right: 16, left: -8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="domain" tick={{ fill: "var(--text-secondary)", fontSize: 12 }} interval={0} angle={-18} textAnchor="end" height={60} />
                <YAxis allowDecimals={false} tick={{ fill: "var(--text-secondary)", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    color: "var(--text-primary)",
                  }}
                />
                <Bar dataKey="count" fill="#7C7CFF" radius={[10, 10, 10, 10]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="analytics-card">
          <h2>Trending misinformation claims</h2>
          <TrendingClaims data={trending} />
        </div>

        <div className="analytics-card">
          <h2>Common false claims</h2>
          <FalseClaims data={falseClaims} />
        </div>
      </section>
    </div>
  );
}
