import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { readNews } from "../services/api";
import "./NewsReader.css";

function useQueryParam(name) {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search).get(name), [search, name]);
}

function formatDate(s) {
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleString();
}

export default function NewsReader() {
  const url = useQueryParam("url");
  const title = useQueryParam("title");
  const source = useQueryParam("source");
  const published_at = useQueryParam("published_at");
  const description = useQueryParam("description");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!url) return;
    setLoading(true);
    setError("");
    setData(null);
    readNews({ url, title, source, published_at, description })
      .then((d) => setData(d))
      .catch(() => setError("Failed to load this article."))
      .finally(() => setLoading(false));
  }, [url, title, source, published_at, description]);

  return (
    <div className="nr-root">
      <div className="nr-card">
        {loading ? (
          <div className="nr-loading">Loading AI summary...</div>
        ) : error ? (
          <div className="nr-error">{error}</div>
        ) : data ? (
          <>
            <div className="nr-title">{data.title || "News Article"}</div>
            <div className="nr-meta">
              <span className="nr-source">{data.source || "Source"}</span>
              {data.published_at ? (
                <span className="nr-date">{formatDate(data.published_at)}</span>
              ) : null}
            </div>

            <div className="nr-section">
              <div className="nr-sectionTitle">AI Summary</div>
              <div className="nr-text">{data.summary || "No summary available."}</div>
            </div>

            <div className="nr-section">
              <div className="nr-sectionTitle">AI Reasoning</div>
              <div className="nr-text">{data.reasoning || "No reasoning available."}</div>
            </div>

            <a
              className="nr-btn"
              href={data.source_url || url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Read Full Article <ExternalLink size={16} />
            </a>
          </>
        ) : (
          <div className="nr-empty">Open an article from Live News Search.</div>
        )}
      </div>
    </div>
  );
}

