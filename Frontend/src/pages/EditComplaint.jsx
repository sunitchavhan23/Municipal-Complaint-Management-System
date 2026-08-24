import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../api/api'
import Footer from '../components/Footer'

function EditComplaint() {
  const [form, setForm] = useState({ title: '', description: '', category: 'Road Damage', area: '', otherIssue: '', priority: 'Medium', status: 'Pending' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { id } = useParams()
  const navigate = useNavigate()

  const areas = [
    'North Zone',
    'South Zone',
    'East Zone',
    'West Zone',
    'Central Zone',
    'Downtown District',
    'Residential Area 1',
    'Residential Area 2',
    'Commercial District',
    'Industrial Zone',
    'Other'
  ]

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await api.get(`/complaints/${id}`)
        const complaint = response.data.complaint
        setForm({
          title: complaint.title,
          description: complaint.description,
          category: complaint.category,
          area: complaint.area || '',
          otherIssue: complaint.otherIssue || '',
          priority: complaint.priority || 'Medium',
          status: complaint.status
        })
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load complaint for editing.')
      }
    }

    fetchComplaint()
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (!form.title || !form.description || !form.area) {
      setError('Title, description, and area are required.')
      return
    }

    if (form.category === 'Others' && !form.otherIssue) {
      setError('Please specify the other issue.')
      return
    }

    try {
      const response = await api.put(`/complaints/${id}`, form)
      setMessage(response.data.message)
      setTimeout(() => navigate('/my-complaints'), 800)
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed.')
    }
  }

  return (
    <>
      <div className="page-card form-card">
        <h2>Edit Complaint</h2>
        <form onSubmit={handleSubmit}>
          <input 
            name="title" 
            placeholder="Complaint title" 
            value={form.title} 
            onChange={handleChange}
            maxLength="100"
          />
          <textarea 
            name="description" 
            placeholder="Describe the issue" 
            value={form.description} 
            onChange={handleChange}
            rows="5"
            maxLength="1000"
          />
          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange}>
                <option>Road Damage</option>
                <option>Garbage Collection</option>
                <option>Water Supply</option>
                <option>Street Light</option>
                <option>Drainage</option>
                <option>Others</option>
              </select>
            </div>
            <div className="form-group">
              <label>Area/Location *</label>
              <select name="area" value={form.area} onChange={handleChange}>
                <option value="">Select Area</option>
                {areas.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
          </div>
          {form.category === 'Others' && (
            <input 
              name="otherIssue" 
              placeholder="Please specify what the other issue is" 
              value={form.otherIssue} 
              onChange={handleChange}
              maxLength="200"
            />
          )}
          <div className="form-row">
            <div className="form-group">
              <label>Priority Level</label>
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status *</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option>Pending</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn primary">Update Complaint</button>
        </form>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
        <Link to="/my-complaints" className="btn secondary">Cancel</Link>
      </div>
      <Footer />
    </>
  )
}

export default EditComplaint
