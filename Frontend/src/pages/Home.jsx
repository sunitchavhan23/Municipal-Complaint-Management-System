import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

function Home() {
  return (
    <>
      <div className="page-card">
        <div className="hero-panel">
          <h1>Municipal Complaint Management System</h1>
          <p className="subtitle">Report civic issues, track progress, and manage public service requests with a secure, session-based portal.</p>
          <div className="button-row">
            <Link to="/register" className="btn primary">Register</Link>
            <Link to="/login" className="btn secondary">Login</Link>
          </div>
        </div>
        <div className="card-grid">
          <div className="card">
            <h3>Fast Reporting</h3>
            <p>Raise road, drainage, streetlight, and sanitation complaints in minutes.</p>
          </div>
          <div className="card">
            <h3>Live Tracking</h3>
            <p>Monitor complaint status from pending to resolved with clear updates.</p>
          </div>
          <div className="card">
            <h3>Municipal Oversight</h3>
            <p>Admins can search, filter, and manage all public complaints efficiently.</p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Home
