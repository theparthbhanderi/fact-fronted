import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ClaimResultView from "../components/ClaimResultView";
import { getHistory } from "../services/api";
import "./Result.css";

export default function Result() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [records, setRecords] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Backend does not expose /history/:id; load a batch and resolve locally.
        const data = await getHistory(500);
        setRecords(Array.isArray(data) ? data : []);
        setError("");
      } catch (e) {
        setError("Failed to load result.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const record = useMemo(() => {
    const nid = Number(id);
    return (records || []).find((r) => Number(r?.id) === nid) || null;
  }, [records, id]);

  return (
    <div className="result-page">
      <div className="result-topbar">
        <Link to="/history" className="result-back">
          ← Back to History
        </Link>
      </div>

      {loading ? (
        <div className="result-state">Loading…</div>
      ) : error ? (
        <div className="result-state">{error}</div>
      ) : !record ? (
        <div className="result-state">Result not found.</div>
      ) : (
        <div className="result-content">
          <ClaimResultView result={record} evidenceLoading={false} />
        </div>
      )}
    </div>
  );
}

