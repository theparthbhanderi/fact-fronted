import "./LoadingSpinner.css";

export default function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner-ring" />
      <p className="spinner-text">Analyzing claim...</p>
      <p className="spinner-sub">
        Searching news · Extracting articles · AI reasoning
      </p>
    </div>
  );
}
