import "./ListCards.css";

export default function TrendingClaims({ data }) {
  if (!data || data.length === 0) {
    return <div className="empty-state">No claims checked yet.</div>;
  }

  return (
    <ul className="stats-list">
      {data.map((item, index) => (
        <li key={index} className="stats-item">
          <div className="stats-rank">{index + 1}</div>
          <div className="stats-content">
            <span className="stats-claim">
              {item.original_claim && item.original_claim !== item.claim ? (
                <>
                  <span style={{ textDecoration: "line-through", color: "var(--text-muted)", marginRight: "8px" }}>"{item.original_claim}"</span>
                  "{item.claim}"
                </>
              ) : (
                `"${item.claim}"`
              )}
            </span>
            <span className="stats-count">{item.count} check{item.count > 1 ? 's' : ''}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
