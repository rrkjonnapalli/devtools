// src/components/Header.tsx
import { Link } from 'react-router';
import ThemeToggle from './Theme/ThemeToggle';

export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-brand">
          <Link to="/" className="brand-link">
            <h1 className="brand-title">DevTools</h1>
          </Link>
        </div>

        <nav className="header-nav">
          <Link to="/" className="nav-link">Home</Link>
          {/* <Link to="/tools" className="nav-link">Tools</Link> */}
          <Link to="/about" className="nav-link">About</Link>
        </nav>

        <div className="header-actions">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
