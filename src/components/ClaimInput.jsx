import { useState } from "react";
import { motion } from "framer-motion";
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
        <motion.button 
          type="submit" 
          disabled={loading || !claim.trim()}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {loading ? "Analyzing..." : "Check Fact"}
        </motion.button>
      </div>
    </form>
  );
}
