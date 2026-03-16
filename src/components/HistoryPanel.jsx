import { useState, useEffect } from "react";
import { getHistory, searchHistory } from "../services/api";
import "./HistoryPanel.css";

export default function HistoryPanel() {
  const [history, setHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getHistory(10);
      setHistory(data);
      setError("");
    } catch (err) {
      setError("Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchHistory();
      return;
    }

    try {
      setLoading(true);
      const data = await searchHistory(searchQuery);
      setHistory(data);
      setError("");
    } catch (err) {
      setError("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case "TRUE": return "#10b981";
      case "FALSE": return "#ef4444";
      default: return "#f59e0b";
    }
  };

  return (
    <div className="history-panel">
      <div className="history-header">
        <h2>Recent Fact Checks</h2>
        <form onSubmit={handleSearch} className="history-search">
          <input
            type="text"
            placeholder="Search previous claims..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {loading ? (
        <div className="history-loading">Loading history...</div>
      ) : error ? (
        <div className="history-error">{error}</div>
      ) : history.length === 0 ? (
        <div className="history-empty">No fact-checks found.</div>
      ) : (
        <div className="history-list">
          {history.map((record) => (
            <div 
              key={record.id} 
              className={`history-card ${expandedId === record.id ? 'expanded' : ''}`}
            >
              <div 
                className="history-card-header"
                onClick={() => toggleExpand(record.id)}
              >
                <h3 className="history-claim">
                  {record.original_claim && record.original_claim !== record.claim ? (
                    <>
                      <span style={{ textDecoration: "line-through", color: "#888", fontSize: "0.75em", display: "block", marginBottom: "4px" }}>
                        "{record.original_claim}"
                      </span>
                      "{record.claim}"
                    </>
                  ) : (
                    `"${record.claim}"`
                  )}
                </h3>
                <div className="history-meta">
                  <span 
                    className="history-verdict"
                    style={{ color: getVerdictColor(record.verdict), borderColor: getVerdictColor(record.verdict) }}
                  >
                    {record.verdict} — {Math.round(record.confidence * 100)}%
                  </span>
                  <span className="history-date">
                    {new Date(record.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {expandedId === record.id && (
                <div className="history-card-body">
                  <div className="history-explanation">
                    <h4>AI Explanation</h4>
                    <p>{record.explanation}</p>
                  </div>
                  {record.evidence && record.evidence.length > 0 && (
                    <div className="history-evidence">
                      <h4>Sources</h4>
                      <ul>
                        {record.evidence.map((ev, i) => (
                          <li key={i}>
                            <a href={ev.url} target="_blank" rel="noopener noreferrer">
                              {ev.source || "Source"}
                            </a>
                            <span className="history-ev-title"> - {ev.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
