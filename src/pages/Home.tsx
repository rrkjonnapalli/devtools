// src/pages/HomePage.tsx
import { Link } from 'react-router';

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to DevTools</h1>
        <p>Your comprehensive toolkit for development utilities</p>
        <Link to="/tools" className="cta-button">
          Explore Tools
        </Link>
      </div>
    </div>
  );
}