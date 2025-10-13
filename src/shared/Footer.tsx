// src/components/Footer.tsx
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="footer-container">
        <div className="footer-bottom flex lg:flex-row flex-col justify-center">
          <p className="developer-credit lg:mr-4">&copy; {currentYear} DevTools. All rights reserved.</p>
          <p className="developer-credit">
            Developed by <span className="developer-name"><a href="https://rrk.rniverse.com" target="_blank" rel="noopener noreferrer">rrkjonnapalli</a></span>
          </p>
        </div>
      </div>
    </footer>
  );
}