const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const session = require('express-session')
const bcrypt = require('bcrypt')
const authRoutes = require('./routes/authRoutes')
const complaintRoutes = require('./routes/complaintRoutes')
const User = require('./models/User')

const app = express()
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/municipal-complaints'

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(session({
  secret: 'municipal-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 8 }
}))

app.use('/api/auth', authRoutes)
app.use('/api/complaints', complaintRoutes)

app.get('/', (req, res) => {
  res.send('Municipal Complaint Management System API is running')
})

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected')

    const existingAdmin = await User.findOne({ role: 'admin' })
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10)
      await User.create({
        name: 'Admin User',
        email: 'admin@municipal.com',
        password: hashedPassword,
        role: 'admin'
      })
      console.log('Seeded default admin user: admin@municipal.com / admin123')
    }

    app.listen(PORT, () => console.log("Server running"))
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error)
  })
