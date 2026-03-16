import { useState } from "react";
import "./ClaimInput.css";

export default function ClaimInput({ onSubmit, loading }) {
  const [claim, setClaim] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (claim.trim() && !loading) {
      onSubmit(claim.trim());
    }
  };

  return (
    <form className="claim-input" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <input
          id="claim-input"
          type="text"
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          placeholder="Enter a news claim to verify..."
          disabled={loading}
          autoComplete="off"
        />
        <button type="submit" disabled={loading || !claim.trim()}>
          {loading ? "Analyzing..." : "Check Fact"}
        </button>
      </div>
    </form>
  );
}
