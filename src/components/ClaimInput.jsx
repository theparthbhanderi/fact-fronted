import { useState } from "react";
import { ArrowRight, MessageSquareText } from "lucide-react";
import PremiumTextInput from "./PremiumTextInput";
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
        <PremiumTextInput
          id="claim-input"
          icon={MessageSquareText}
          inline
          actionIcon={ArrowRight}
          actionType="submit"
          actionDisabled={loading || !claim.trim()}
          actionAriaLabel="Check fact"
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          placeholder="Type a claim or statement to verify…"
          disabled={loading}
          ariaLabel="Enter claim"
        />
      </div>
    </form>
  );
}
