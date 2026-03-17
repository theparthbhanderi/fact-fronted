import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { searchNews } from "../services/api";
import PremiumTextInput from "./PremiumTextInput";
import "./LiveNewsSearch.css";

function formatDate(s) {
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleString();
}

export default function LiveNewsSearch() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const canSearch = q.trim().length > 1;

  const onSearch = async () => {
    if (!canSearch) return;
    setLoading(true);
    setError("");
    try {
      const data = await searchNews(q.trim());
      setArticles(data?.articles || []);
    } catch (e) {
      setError("Failed to fetch live news. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lns-root">
      <div className="lns-header">
        <div className="lns-title">Live News Reader</div>
        <div className="lns-subtitle">
          Search a topic and open an internal AI summary (no full article text).
        </div>
      </div>

      <div className="lns-searchRow">
        <PremiumTextInput
          icon={Search}
          inline
          actionIcon={Search}
          actionAriaLabel="Search live news"
          actionDisabled={!canSearch || loading}
          onAction={onSearch}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search topic (India, AI, Elections)…"
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch();
          }}
          error={error || undefined}
          ariaLabel="Live news search"
        />
      </div>

      <div className="lns-grid">
        {articles.map((a) => (
          <button
            key={a.url}
            className="lns-card"
            onClick={() => {
              const qp = new URLSearchParams();
              qp.set("url", a.url);
              if (a.title) qp.set("title", a.title);
              if (a.source) qp.set("source", a.source);
              if (a.published_at) qp.set("published_at", a.published_at);
              if (a.description) qp.set("description", a.description);
              navigate(`/news?${qp.toString()}`);
            }}
          >
            {a.image ? (
              <img className="lns-img" src={a.image} alt="" loading="lazy" />
            ) : (
              <div className="lns-img lns-img--placeholder" />
            )}
            <div className="lns-cardBody">
              <div className="lns-cardTitle">{a.title}</div>
              <div className="lns-meta">
                <span className="lns-source">{a.source || "News"}</span>
                {a.published_at ? (
                  <span className="lns-date">{formatDate(a.published_at)}</span>
                ) : null}
              </div>
              {a.description ? (
                <div className="lns-desc">{a.description}</div>
              ) : null}
            </div>
            <div className="lns-cardChevron">
              <ExternalLink size={16} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

