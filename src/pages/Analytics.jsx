import { useState, useEffect } from "react";
import TrendingClaims from "../components/TrendingClaims";
import FalseClaims from "../components/FalseClaims";
import ActivityChart from "../components/ActivityChart";
import { getTrendingClaims, getFalseClaims, getActivityStats } from "../services/api";
import "./Analytics.css";

export default function Analytics() {
  const [trending, setTrending] = useState([]);
  const [falseClaims, setFalseClaims] = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        setLoading(true);
        const [trendingData, falseData, activityData] = await Promise.all([
          getTrendingClaims(5),
          getFalseClaims(5),
          getActivityStats()
        ]);
        
        setTrending(trendingData);
        setFalseClaims(falseData);
        setActivity(activityData);
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
        <h1>Misinformation Analytics</h1>
        <p>Live insights into trending claims and fact-check activity.</p>
      </header>

      <section className="analytics-grid">
        <div className="analytics-card span-full">
          <h2>Fact-Check Activity Over Time</h2>
          <ActivityChart data={activity} />
        </div>

        <div className="analytics-card">
          <h2>🔥 Trending Claims</h2>
          <TrendingClaims data={trending} />
        </div>

        <div className="analytics-card">
          <h2>⚠️ Most Common False Claims</h2>
          <FalseClaims data={falseClaims} />
        </div>
      </section>
    </div>
  );
}
