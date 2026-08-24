import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/api'
import Footer from '../components/Footer'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [complaints, setComplaints] = useState([])
  const navigate = useNavigate()

  const fetchData = async () => {
    try {
      const [userRes, complaintsRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/complaints?mine=true')
      ])
      setUser(userRes.data.user)
      setComplaints(complaintsRes.data.complaints)
    } catch (error) {
      navigate('/login')
    }
  }

  useEffect(() => {
    fetchData()
  }, [navigate])

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
      navigate('/')
    } catch (error) {
      navigate('/')
    }
  }

  return (
    <>
      <div className="page-card">
        <div className="page-header">
          <div>
            <h2>Welcome, {user?.name || 'User'}</h2>
            <p>Manage your complaints from one place.</p>
          </div>
          <button className="btn secondary" onClick={handleLogout}>Logout</button>
        </div>

        <div className="button-row">
          <Link to="/create-complaint" className="btn primary">Create Complaint</Link>
          <Link to="/my-complaints" className="btn secondary">My Complaints</Link>
        </div>

        <div className="card-grid">
          {complaints.slice(0, 3).map((complaint) => (
            <div key={complaint._id} className="card">
              <h3>{complaint.title}</h3>
              <p>{complaint.description}</p>
              <p><strong>Area:</strong> {complaint.area || 'Not specified'}</p>
              <span className="pill">{complaint.status}</span>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Dashboard
