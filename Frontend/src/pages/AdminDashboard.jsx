import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/api'
import Footer from '../components/Footer'

function AdminDashboard() {
  const [complaints, setComplaints] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const fetchComplaints = async () => {
    try {
      const response = await api.get(`/complaints?search=${search}&category=${category}&status=${status}`)
      setComplaints(response.data.complaints)
    } catch (error) {
      navigate('/admin-login')
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [search, category, status, navigate])

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await api.put(`/complaints/${id}`, { status: newStatus })
      setMessage(response.data.message)
      fetchComplaints()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not update status.')
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await api.delete(`/complaints/${id}`)
      setMessage(response.data.message)
      fetchComplaints()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Delete failed.')
    }
  }

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
          <h2>Admin Dashboard</h2>
          <button className="btn secondary" onClick={handleLogout}>Logout</button>
        </div>
        {message && <p className="success">{message}</p>}
        <div className="filters">
          <input placeholder="Search complaints" value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            <option>Road Damage</option>
            <option>Garbage Collection</option>
            <option>Water Supply</option>
            <option>Street Light</option>
            <option>Drainage</option>
            <option>Others</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Status</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
        </div>
        <div className="card-grid">
          {complaints.map((complaint) => (
            <div key={complaint._id} className="card">
              <h3>{complaint.title}</h3>
              <p className="card-description">{complaint.description}</p>
              <p><strong>Category:</strong> {complaint.category}</p>
              <p><strong>Area:</strong> {complaint.area || 'Not specified'}</p>
              <p><strong>Priority:</strong> {complaint.priority || 'Medium'}</p>
              <p><strong>Submitted by:</strong> {complaint.user?.name}</p>
              <div className="button-row">
                <Link to={`/admin-complaints/${complaint._id}`} className="btn primary">View Details</Link>
                <select value={complaint.status} onChange={(e) => updateStatus(complaint._id, e.target.value)} className="status-select">
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
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

export default AdminDashboard
