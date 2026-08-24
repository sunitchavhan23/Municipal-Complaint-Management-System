import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../api/api'
import Footer from '../components/Footer'

function AdminComplaintDetails() {
  const [complaint, setComplaint] = useState(null)
  const [error, setError] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [message, setMessage] = useState('')
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await api.get(`/complaints/${id}`)
        setComplaint(response.data.complaint)
        setNewStatus(response.data.complaint.status)
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load complaint details.')
      }
    }

    fetchComplaint()
  }, [id])

  const handleStatusUpdate = async () => {
    try {
      const response = await api.put(`/complaints/${id}`, { status: newStatus })
      setMessage(response.data.message)
      setComplaint({ ...complaint, status: newStatus })
      setTimeout(() => setMessage(''), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update status.')
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        await api.delete(`/complaints/${id}`)
        navigate('/admin-dashboard')
      } catch (err) {
        setError(err.response?.data?.message || 'Could not delete complaint.')
      }
    }
  }

  if (error && !complaint) {
    return (
      <>
        <div className="page-card form-card">
          <h2>Complaint Details</h2>
          <p className="error">{error}</p>
          <Link to="/admin-dashboard" className="btn secondary">Back to Dashboard</Link>
        </div>
        <Footer />
      </>
    )
  }

  if (!complaint) {
    return (
      <>
        <div className="page-card form-card">
          <h2>Complaint Details</h2>
          <p>Loading...</p>
          <Link to="/admin-dashboard" className="btn secondary">Back</Link>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <div className="page-card admin-detail-card">
        <div className="admin-detail-header">
          <div>
            <h2>{complaint.title}</h2>
            <p className="complaint-id">Complaint ID: {complaint._id}</p>
          </div>
          <Link to="/admin-dashboard" className="btn secondary">Back to Dashboard</Link>
        </div>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <div className="admin-detail-grid">
          <div className="detail-section">
            <h3>Complaint Information</h3>
            <div className="detail-row">
              <div className="detail-column">
                <label>Title</label>
                <p>{complaint.title}</p>
              </div>
              <div className="detail-column">
                <label>Category</label>
                <p className="badge badge-category">{complaint.category}</p>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-column">
                <label>Area/Location</label>
                <p>{complaint.area || 'Not specified'}</p>
              </div>
              <div className="detail-column">
                <label>Priority Level</label>
                <p className={`badge badge-${(complaint.priority || 'Medium').toLowerCase()}`}>
                  {complaint.priority || 'Medium'}
                </p>
              </div>
            </div>

            <div className="detail-row full">
              <div className="detail-column">
                <label>Description</label>
                <div className="description-box">
                  {complaint.description}
                </div>
              </div>
            </div>

            {complaint.otherIssue && (
              <div className="detail-row full">
                <div className="detail-column">
                  <label>Other Issue Details</label>
                  <div className="description-box">
                    {complaint.otherIssue}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="detail-section">
            <h3>Status & Management</h3>
            <div className="detail-row">
              <div className="detail-column">
                <label>Current Status</label>
                <p className={`badge badge-${complaint.status.toLowerCase()}`}>
                  {complaint.status}
                </p>
              </div>
            </div>

            <div className="detail-row full">
              <div className="detail-column">
                <label>Update Status</label>
                <div className="status-update">
                  <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="status-select">
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                  <button 
                    onClick={handleStatusUpdate} 
                    className="btn primary"
                    disabled={newStatus === complaint.status}
                  >
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>User Information</h3>
            <div className="detail-row">
              <div className="detail-column">
                <label>Submitted By</label>
                <p>{complaint.user?.name || 'Unknown'}</p>
              </div>
              <div className="detail-column">
                <label>User Email</label>
                <p>{complaint.user?.email || 'Not available'}</p>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-column">
                <label>Submitted Date</label>
                <p>{new Date(complaint.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-action-buttons">
          <button onClick={handleDelete} className="btn danger">Delete Complaint</button>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AdminComplaintDetails
