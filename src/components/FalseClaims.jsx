import "./ListCards.css";

export default function FalseClaims({ data }) {
  if (!data || data.length === 0) {
    return <div className="empty-state">No false claims recorded yet.</div>;
  }

  return (
    <ul className="stats-list">
      {data.map((item, index) => (
        <li key={index} className="stats-item false-item">
          <div className="stats-rank danger">{index + 1}</div>
          <div className="stats-content">
            <span className="stats-claim">
              {item.original_claim && item.original_claim !== item.claim ? (
                <>
                  <span style={{ textDecoration: "line-through", color: "#888", marginRight: "8px" }}>"{item.original_claim}"</span>
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
