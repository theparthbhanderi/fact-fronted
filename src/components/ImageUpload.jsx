import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, Camera } from "lucide-react";
import "./ImageUpload.css";

export default function ImageUpload({ onSubmit, loading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleValidFile = (file) => {
    if (file && (file.type === "image/png" || file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/webp")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e) => {
    handleValidFile(e.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!loading) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (!loading && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleValidFile(e.dataTransfer.files[0]);
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
        <AnimatePresence mode="wait">
          {!previewUrl ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className={`upload-dropzone ${isDragging ? "dragging" : ""} ${loading ? "disabled" : ""}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <div className="upload-icon-wrapper">
                <UploadCloud size={48} className="upload-icon" />
              </div>
              <h3 className="upload-title">Upload Screenshot</h3>
              <p className="upload-subtitle">Drag & drop an image or click to browse</p>
              <div className="upload-badges">
                <span className="file-badge">PNG</span>
                <span className="file-badge">JPG</span>
                <span className="file-badge">WEBP</span>
              </div>
              <input
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: "none" }}
                disabled={loading}
              />
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="preview-container"
            >
              <div className="preview-image-wrapper">
                <img src={previewUrl} alt="Screenshot preview" className="image-preview" />
                <button
                  type="button"
                  className="preview-clear-btn absolute-clear"
                  onClick={clearSelection}
                  disabled={loading}
                  title="Remove image"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="preview-actions">
                <motion.button
                  type="submit"
                  className="analyze-btn"
                  disabled={loading}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {loading ? (
                    <span className="btn-content loading">
                      <span className="mini-spinner" /> Processing...
                    </span>
                  ) : (
                    <span className="btn-content">
                      <Camera size={18} /> Extract Text & Analyze
                    </span>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
