import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'

function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')

    try {
      const response = await api.post('/auth/admin-login', form)
      setMessage(response.data.message)
      setTimeout(() => navigate('/admin-dashboard'), 800)
    } catch (err) {
      setError(err.response?.data?.message || 'Admin login failed.')
    }
  }

  return (
    <div className="page-card form-card col-4 text-center">
      <h2>Admin Login</h2> 
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Admin Email" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <button type="submit" className="btn primary">Login as Admin</button>
      </form>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <p className="small-link"><a href="/login">User login</a></p>
    </div>
  )
}

export default AdminLogin
