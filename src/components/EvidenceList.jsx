import "./EvidenceList.css";

export default function EvidenceList({ evidence }) {
  if (!evidence || evidence.length === 0) return null;

  return (
    <div className="evidence-list">
      <h3 className="evidence-title">Evidence Sources</h3>
      <div className="evidence-grid">
        {evidence.slice(0, 3).map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="evidence-card"
          >
            <span className="evidence-index">{i + 1}</span>
            <div className="evidence-content">
              <h4 className="evidence-headline">{item.title}</h4>
              <span className="evidence-source">{item.source}</span>
            </div>
            <span className="evidence-arrow">→</span>
          </a>
        ))}
      </div>
    </div>
  );
}
