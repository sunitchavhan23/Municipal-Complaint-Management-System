import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'

function Login() {
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
      const response = await api.post('/auth/login', form)
      setMessage(response.data.message)
      setTimeout(() => navigate('/dashboard'), 800)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.')
    }
  }

  return (
    <div className="page-card form-card col-4 text-center">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <button type="submit" className="btn primary">Login</button>
      </form>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <p className="small-link"><a href="/admin-login">Admin login</a></p>
      <p className="small-link"><a href="/register">Create an account</a></p>
    </div>
  )
}

export default Login
