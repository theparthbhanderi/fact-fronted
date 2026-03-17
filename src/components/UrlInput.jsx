import { useState } from "react";
import { ArrowRight, Link2 } from "lucide-react";
import PremiumTextInput from "./PremiumTextInput";
import "./UrlInput.css";

export default function UrlInput({ onSubmit, loading }) {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim() || loading) return;
    onSubmit(url.trim());
  };

  return (
    <div className="url-input-wrapper">
      <form onSubmit={handleSubmit} className="url-input-form">
        <div className="url-row">
          <PremiumTextInput
            icon={Link2}
            inline
            actionIcon={ArrowRight}
            actionType="submit"
            actionDisabled={!url.trim() || loading}
            actionAriaLabel="Verify article"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a news article URL…"
            disabled={loading}
            required
            pattern="https?://.+"
            title="Please enter a valid URL starting with http:// or https://"
            ariaLabel="Paste article link"
          />
        </div>
      </form>
    </div>
  );
}
