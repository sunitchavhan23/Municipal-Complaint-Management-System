import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import AdminLogin from './pages/AdminLogin'
import Dashboard from './pages/Dashboard'
import CreateComplaint from './pages/CreateComplaint'
import MyComplaints from './pages/MyComplaints'
import ComplaintDetails from './pages/ComplaintDetails'
import EditComplaint from './pages/EditComplaint'
import AdminDashboard from './pages/AdminDashboard'
import AdminComplaintDetails from './pages/AdminComplaintDetails'
import './App.css'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-complaint" element={<CreateComplaint />} />
        <Route path="/my-complaints" element={<MyComplaints />} />
        <Route path="/complaints/:id" element={<ComplaintDetails />} />
        <Route path="/edit-complaint/:id" element={<EditComplaint />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-complaints/:id" element={<AdminComplaintDetails />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
