// Loading.jsx
import './Loading.css';

export default function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="spinner-circle"></div>
        </div>
        <p className="loading-text">Loading...</p>
      </div>
    </div>
  );
}