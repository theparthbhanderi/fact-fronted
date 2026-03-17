import { useState } from "react";
import { Link2 } from "lucide-react";
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
        <div className="url-input-container">
          <Link2 className="url-icon" size={20} />
          <input
            type="url"
            className="url-input"
            placeholder="Paste news article link here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            autoComplete="off"
            required
            pattern="https?://.+"
            title="Please enter a valid URL starting with http:// or https://"
          />
          <button 
            type="submit" 
            className="url-submit-btn" 
            disabled={!url.trim() || loading}
          >
            Verify Article
          </button>
        </div>
      </form>
    </div>
  );
}
