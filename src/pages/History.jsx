import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SegmentedControl from "../components/SegmentedControl";
import { getHistory, searchHistory } from "../services/api";
import "./History.css";

const FILTERS = [
  { value: "ALL", label: "All" },
  { value: "TRUE", label: "True" },
  { value: "FALSE", label: "False" },
  { value: "MISLEADING", label: "Misleading" },
  { value: "UNVERIFIED", label: "Unverified" },
];

function verdictTone(v) {
  const verdict = String(v || "").toUpperCase();
  if (verdict === "TRUE") return { color: "#22c55e", bg: "rgba(34, 197, 94, 0.12)" };
  if (verdict === "FALSE") return { color: "#ef4444", bg: "rgba(239, 68, 68, 0.12)" };
  if (verdict === "MISLEADING") return { color: "#f59e0b", bg: "rgba(245, 158, 11, 0.14)" };
  return { color: "#f59e0b", bg: "rgba(245, 158, 11, 0.14)" };
}

export default function History() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchRecent = async () => {
    setLoading(true);
    try {
      // Load a larger batch and paginate on the client (backend has limit-only).
      const data = await getHistory(200);
      setRecords(Array.isArray(data) ? data : []);
      setError("");
    } catch (e) {
      setError("Failed to load history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = records || [];
    if (filter !== "ALL") {
      list = list.filter((r) => String(r?.verdict || "").toUpperCase() === filter);
    }
    if (q) {
      list = list.filter((r) => String(r?.claim || "").toLowerCase().includes(q));
    }
    return list;
  }, [records, filter, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const pageItems = useMemo(() => {
    const start = (clampedPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, clampedPage]);

  useEffect(() => {
    setPage(1);
  }, [filter, query]);

  const onSearchSubmit = async (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      fetchRecent();
      return;
    }
    setLoading(true);
    try {
      const data = await searchHistory(q);
      setRecords(Array.isArray(data) ? data : []);
      setError("");
    } catch (err) {
      setError("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="history-page">
      <header className="history-page-header">
        <h1>Fact-Check History</h1>
        <p>Review previously analyzed claims.</p>
      </header>

      <div className="history-toolbar">
        <form className="history-searchbar" onSubmit={onSearchSubmit}>
          <input
            className="history-searchInput"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search past fact-checks..."
            aria-label="Search past fact-checks"
          />
        </form>

        <div className="history-filters">
          <SegmentedControl
            ariaLabel="History filters"
            layoutId="seg-history-filter"
            value={filter}
            onChange={(v) => setFilter(String(v))}
            items={FILTERS}
          />
        </div>
      </div>

      {loading ? (
        <div className="history-state">Loading…</div>
      ) : error ? (
        <div className="history-state">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="history-empty">
          <div className="history-emptyTitle">No fact checks yet.</div>
          <div className="history-emptySub">Start by verifying a claim.</div>
        </div>
      ) : (
        <>
          <div className="history-cards">
            {pageItems.map((r) => {
              const tone = verdictTone(r?.verdict);
              const dt = r?.timestamp ? new Date(r.timestamp) : null;
              return (
                <button
                  key={r.id}
                  type="button"
                  className="history-item"
                  onClick={() => navigate(`/result/${r.id}`)}
                >
                  <div className="history-itemTop">
                    <div className="history-claimText">{r.claim}</div>
                    <span className="history-verdictBadge" style={{ color: tone.color, background: tone.bg }}>
                      {String(r.verdict || "UNVERIFIED").toUpperCase()}
                    </span>
                  </div>

                  <div className="history-itemBottom">
                    <div className="history-subRow">
                      <span className="history-subLabel">Confidence</span>
                      <span className="history-subValue">{Math.round((Number(r.confidence) || 0) * 100)}%</span>
                    </div>
                    <div className="history-subRow">
                      <span className="history-subLabel">Checked</span>
                      <span className="history-subValue">{dt ? dt.toLocaleDateString() : "—"}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="history-pagination">
            <button
              type="button"
              className="history-pageBtn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={clampedPage <= 1}
            >
              Prev
            </button>
            <div className="history-pageMeta">
              Page {clampedPage} of {totalPages}
            </div>
            <button
              type="button"
              className="history-pageBtn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={clampedPage >= totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

