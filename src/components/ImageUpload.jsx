import { useState, useRef } from "react";
import "./ImageUpload.css";

export default function ImageUpload({ onSubmit, loading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile && !loading) {
      onSubmit(selectedFile);
    }
  };

  return (
    <div className="image-upload-wrapper">
      <form onSubmit={handleSubmit} className="image-upload-form">
        {!previewUrl ? (
          <div 
            className="upload-dropzone" 
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="upload-icon">📸</span>
            <p>Click to upload a news screenshot</p>
            <span className="upload-hint">Supports PNG, JPG (Max 5MB)</span>
            <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              ref={fileInputRef}
              style={{ display: "none" }}
              disabled={loading}
            />
          </div>
        ) : (
          <div className="preview-container">
            <img src={previewUrl} alt="Screenshot preview" className="image-preview" />
            <div className="preview-actions">
              <button 
                type="button" 
                className="clear-btn" 
                onClick={clearSelection}
                disabled={loading}
              >
                ✕ Clear
              </button>
              <button 
                type="submit" 
                className="analyze-btn" 
                disabled={loading}
              >
                {loading ? "Extracting..." : "Analyze Screenshot"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
