import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Sparkles, Copy } from "lucide-react";
import "./ReasoningPanel.css";

export default function ReasoningPanel({ result, defaultOpen = false }) {
  const [open, setOpen] = useState(Boolean(defaultOpen));
  const [showAllEvidence, setShowAllEvidence] = useState(false);
  const [showAllSources, setShowAllSources] = useState(false);

  const cleanSnippet = (s) => {
    if (!s) return "";
    let t = String(s);
    // Remove markdown images: ![alt](url)
    t = t.replace(/!\[[^\]]*?\]\([^)]+?\)/g, "");
    // Convert markdown links: [text](url) -> text
    t = t.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
    // Drop leftover bullets/nav junk
    t = t.replace(/^\s*[*-]\s+/gm, "");
    // Collapse whitespace
    t = t.replace(/\s+/g, " ").trim();
    return t;
  };

  const ellipsize = (s, max = 180) => {
    const t = cleanSnippet(s);
    if (t.length <= max) return t;
    return t.slice(0, max).trimEnd() + "…";
  };

  const steps = useMemo(() => {
    const sources = Array.from(
      new Set((result?.evidence || []).map((e) => e?.source).filter(Boolean))
    );
    const queries = Array.isArray(result?.search_queries) ? result.search_queries.filter(Boolean) : [];
    const sentences = (result?.evidence || [])
      .map((e) => e?.snippet || e?.text)
      .filter(Boolean)
      .map((s) => cleanSnippet(s))
      .filter(Boolean);

    return [
      {
        title: "Claim we checked",
        meta: null,
        body: result?.corrected_claim || result?.claim || "",
      },
      {
        title: "Search terms used",
        meta: `${queries.length} query${queries.length === 1 ? "" : "ies"}`,
        body: queries.length ? queries.join("\n") : "Search queries were not returned for this result.",
      },
      {
        title: "Sources found",
        meta: `${sources.length} source${sources.length === 1 ? "" : "s"}`,
        body: sources.length ? sources.join("\n") : "No sources were returned.",
      },
      {
        title: "Evidence highlights",
        meta: `${sentences.length} snippet${sentences.length === 1 ? "" : "s"}`,
        body: sentences.length
          ? sentences.map((s) => `- ${ellipsize(s, 220)}`).slice(0, 8).join("\n")
          : "No evidence snippets were extracted.",
      },
      {
        title: "AI explanation",
        meta: null,
        body: result?.explanation || "",
      },
    ];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const sources = useMemo(() => {
    return Array.from(new Set((result?.evidence || []).map((e) => e?.source).filter(Boolean)));
  }, [result]);

  const queries = useMemo(() => {
    return Array.isArray(result?.search_queries) ? result.search_queries.filter(Boolean) : [];
  }, [result]);

  const evidenceSentences = useMemo(() => {
    return (result?.evidence || [])
      .map((e) => e?.snippet || e?.text)
      .filter(Boolean)
      .map((s) => cleanSnippet(s))
      .filter(Boolean);
  }, [result]);

  return (
    <div className="rp-root">
      <button className="rp-toggle" onClick={() => setOpen((v) => !v)}>
        <span className="rp-toggleLeft">
          <span className="rp-toggleIcon" aria-hidden="true">
            <Sparkles size={18} />
          </span>
          <span className="rp-toggleText">
            <span className="rp-toggleTitle">AI reasoning</span>
            <span className="rp-toggleSubtitle">Claim → Search → Sources → Evidence → Explanation</span>
          </span>
        </span>
        <span className="rp-toggleRight">
          <span className="rp-toggleHint">{open ? "Hide" : "View"}</span>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      {open ? (
        <div className="rp-body">
          <div className="rp-actions">
            <button
              className="rp-copy"
              type="button"
              onClick={async () => {
                const parts = [
                  `Claim we checked\n${(result?.corrected_claim || result?.claim || "").trim()}`,
                  `Search terms used\n${queries.length ? queries.join("\n") : "Not available"}`,
                  `Sources found\n${sources.length ? sources.join("\n") : "Not available"}`,
                  `Evidence highlights\n${
                    evidenceSentences.length ? evidenceSentences.map((s) => `- ${s}`).join("\n") : "Not available"
                  }`,
                  `AI explanation\n${(result?.explanation || "").trim()}`,
                ];
                const text = parts.filter(Boolean).join("\n\n");
                try {
                  await navigator.clipboard.writeText(text);
                } catch (e) {
                  console.error("Copy failed", e);
                }
              }}
            >
              <Copy size={16} />
              Copy
            </button>
          </div>

          <div className="rp-step">
            <div className="rp-stepHeader">
              <div className="rp-stepTitle">Claim we checked</div>
            </div>
            <div className="rp-claim">{cleanSnippet(result?.corrected_claim || result?.claim || "") || "—"}</div>
          </div>

          <div className="rp-step">
            <div className="rp-stepHeader">
              <div className="rp-stepTitle">Search terms used</div>
              <div className="rp-stepMeta">{queries.length} query{queries.length === 1 ? "" : "ies"}</div>
            </div>
            {queries.length ? (
              <ul className="rp-list">
                {queries.map((q) => (
                  <li key={q} className="rp-li">{cleanSnippet(q)}</li>
                ))}
              </ul>
            ) : (
              <div className="rp-empty">Search queries were not returned for this result.</div>
            )}
          </div>

          <div className="rp-step">
            <div className="rp-stepHeader">
              <div className="rp-stepTitle">Sources found</div>
              <div className="rp-stepMeta">{sources.length} source{sources.length === 1 ? "" : "s"}</div>
            </div>
            {sources.length ? (
              <>
                <div className="rp-chips">
                  {(showAllSources ? sources : sources.slice(0, 6)).map((src) => (
                    <span key={src} className="rp-chip">{src}</span>
                  ))}
                </div>
                {sources.length > 6 ? (
                  <button className="rp-more" type="button" onClick={() => setShowAllSources((v) => !v)}>
                    {showAllSources ? "Show fewer" : `Show all (${sources.length})`}
                  </button>
                ) : null}
              </>
            ) : (
              <div className="rp-empty">No sources were returned.</div>
            )}
          </div>

          <div className="rp-step">
            <div className="rp-stepHeader">
              <div className="rp-stepTitle">Evidence highlights</div>
              <div className="rp-stepMeta">{evidenceSentences.length} snippet{evidenceSentences.length === 1 ? "" : "s"}</div>
            </div>
            {evidenceSentences.length ? (
              <>
                <ul className="rp-list">
                  {(showAllEvidence ? evidenceSentences : evidenceSentences.slice(0, 4)).map((s, idx) => (
                    <li key={`${idx}-${s.slice(0, 24)}`} className="rp-li">{ellipsize(s, 220)}</li>
                  ))}
                </ul>
                {evidenceSentences.length > 4 ? (
                  <button className="rp-more" type="button" onClick={() => setShowAllEvidence((v) => !v)}>
                    {showAllEvidence ? "Show fewer" : `Show all (${evidenceSentences.length})`}
                  </button>
                ) : null}
              </>
            ) : (
              <div className="rp-empty">No evidence snippets were extracted.</div>
            )}
          </div>

          <div className="rp-step">
            <div className="rp-stepHeader">
              <div className="rp-stepTitle">AI explanation</div>
            </div>
            <pre className="rp-stepText">{result?.explanation || "—"}</pre>
          </div>
        </div>
      ) : null}
    </div>
  );
}

