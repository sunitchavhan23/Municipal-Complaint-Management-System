import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  const isAuthPage = ['/login', '/register', '/admin-login'].includes(location.pathname)

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand">
          <span className="brand-mark">🏛️</span>
          <div className="brand-text">
            <strong>Municipal Desk</strong>
            <p>Complaint Portal</p>
          </div>
        </Link>
        <div className="nav-links">
          {!isAuthPage && (
            <>
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
              <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link>
              <Link to="/my-complaints" className={location.pathname === '/my-complaints' ? 'active' : ''}>My Complaints</Link>
              <Link to="/admin-dashboard" className={location.pathname === '/admin-dashboard' ? 'active' : ''}>Admin</Link>
            </>
          )}
          {isAuthPage && (
            <>
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
              <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>Login</Link>
              <Link to="/register" className={location.pathname === '/register' ? 'active' : ''}>Register</Link>
              <Link to="/admin-login" className={location.pathname === '/admin-login' ? 'active' : ''}>Admin</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
