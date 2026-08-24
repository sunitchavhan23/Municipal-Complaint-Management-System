import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../api/api'
import Footer from '../components/Footer'

function ComplaintDetails() {
  const [complaint, setComplaint] = useState(null)
  const [error, setError] = useState('')
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await api.get(`/complaints/${id}`)
        setComplaint(response.data.complaint)
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load complaint details.')
      }
    }

    fetchComplaint()
  }, [id])

  if (!complaint) {
    return (
      <>
        <div className="page-card form-card">
          <h2>Complaint Details</h2>
          {error ? <p className="error">{error}</p> : <p>Loading...</p>}
          <Link to="/my-complaints" className="btn secondary">Back</Link>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <div className="page-card form-card">
        <h2>{complaint.title}</h2>
        <div className="details-grid">
          <div className="detail-item">
            <strong>Category:</strong> {complaint.category}
          </div>
          <div className="detail-item">
            <strong>Area/Location:</strong> {complaint.area || 'Not specified'}
          </div>
          <div className="detail-item">
            <strong>Priority:</strong> {complaint.priority || 'Medium'}
          </div>
          <div className="detail-item">
            <strong>Status:</strong> {complaint.status}
          </div>
        </div>
        <p><strong>Description:</strong></p>
        <p className="full-description">{complaint.description}</p>
        {complaint.otherIssue && (
          <div>
            <p><strong>Other Issue Details:</strong></p>
            <p>{complaint.otherIssue}</p>
          </div>
        )}
        <p><strong>Created:</strong> {new Date(complaint.createdAt).toLocaleDateString()}</p>
        <div className="button-row">
          <Link to={`/edit-complaint/${complaint._id}`} className="btn primary">Edit</Link>
          <Link to="/my-complaints" className="btn secondary">Back</Link>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ComplaintDetails
