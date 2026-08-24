import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/api'
import Footer from '../components/Footer'

function MyComplaints() {
  const [complaints, setComplaints] = useState([])
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const fetchComplaints = async () => {
    try {
      const response = await api.get('/complaints?mine=true')
      setComplaints(response.data.complaints)
    } catch (error) {
      navigate('/login')
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [navigate])

  const handleDelete = async (id) => {
    try {
      await api.delete(`/complaints/${id}`)
      setMessage('Complaint deleted successfully.')
      fetchComplaints()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Delete failed.')
    }
  }

  return (
    <>
      <div className="page-card">
        <div className="page-header">
          <h2>My Complaints</h2>
          <Link to="/dashboard" className="btn secondary">Back to Dashboard</Link>
        </div>
        {message && <p className="success">{message}</p>}
        <div className="card-grid">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="card">
              <h3>{complaint.title}</h3>
              <p>{complaint.category}</p>
              <p>{complaint.area && <span><strong>Area:</strong> {complaint.area}</span>}</p>
              <p>{complaint.status}</p>
              <div className="button-row">
                <Link to={`/complaints/${complaint._id}`} className="btn secondary">View</Link>
                <Link to={`/edit-complaint/${complaint._id}`} className="btn secondary">Edit</Link>
                <button className="btn danger" onClick={() => handleDelete(complaint._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default MyComplaints
