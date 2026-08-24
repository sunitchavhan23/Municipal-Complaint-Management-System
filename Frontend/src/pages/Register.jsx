import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
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

    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }

    try {
      const response = await api.post('/auth/register', form)
      setMessage(response.data.message)
      setTimeout(() => navigate('/login'), 800)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    }
  }

  return (
    <div className="page-card form-card col-4 text-center">
      <h2>Create an account</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <button type="submit" className="btn primary">Register</button>
      </form>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      <p className="small-link"><a href="/login">Already have an account? Login</a></p>
    </div>
  )
}

export default Register
