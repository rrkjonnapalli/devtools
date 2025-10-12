// src/components/Footer.tsx
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">DevTools</h3>
            <p className="footer-description">
              A collection of powerful utilities for developers and professionals
            </p>
          </div>

          <div className="footer-section">
            <h4 className="footer-subtitle">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/tools" className="footer-link">All Tools</a></li>
              <li><a href="/about" className="footer-link">About</a></li>
              {/* <li><a href="/privacy" className="footer-link">Privacy</a></li> */}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} DevTools. All rights reserved.</p>
          <p className="developer-credit">
            Developed by <span className="developer-name"><a href="https://github.com/rrkjonnapalli" target="_blank" rel="noopener noreferrer">rrkjonnapalli</a></span>
          </p>
        </div>
      </div>
    </footer>
  );
}