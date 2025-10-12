// src/components/Layout.tsx
// import { type ReactNode } from 'react';
import { useLocation, Link, Outlet } from 'react-router';
import Header from './Header';
import Footer from './Footer';
import '../styles/layout.css';
// interface LayoutProps {
//   children: ReactNode;
// }

export default function Layout() {
  const location = useLocation();
  
  return (
    <div className="layout">
      <Header />
      <main className="layout-main">
        {location.pathname !== '/' && <Breadcrumbs />}
        {/* {children} */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Breadcrumbs Component
function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs-list">
        <li className="breadcrumb-item">
          <Link to="/" className="breadcrumb-link">
            Home
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const breadcrumbName = value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ');

          return (
            <li key={to} className="breadcrumb-item">
              {isLast ? (
                <span className="breadcrumb-current" aria-current="page">
                  {breadcrumbName}
                </span>
              ) : (
                <Link to={to} className="breadcrumb-link">
                  {breadcrumbName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}