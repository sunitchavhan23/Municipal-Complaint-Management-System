const bcrypt = require('bcrypt')
const User = require('../models/User')

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = new User({ name, email, password: hashedPassword, role: 'user' })
    await user.save()

    res.status(201).json({ message: 'User registered successfully.' })
  } catch (error) {
    res.status(500).json({ message: 'Registration failed.', error: error.message })
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' })
    }

    req.session.userId = user._id
    req.session.role = user.role
    req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role }

    res.status(200).json({
      message: 'Login successful.',
      user: req.session.user
    })
  } catch (error) {
    res.status(500).json({ message: 'Login failed.', error: error.message })
  }
}

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const adminUser = await User.findOne({ email, role: 'admin' })
    if (!adminUser) {
      return res.status(401).json({ message: 'Invalid admin credentials.' })
    }

    const isMatch = await bcrypt.compare(password, adminUser.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials.' })
    }

    req.session.userId = adminUser._id
    req.session.role = adminUser.role
    req.session.user = { id: adminUser._id, name: adminUser.name, email: adminUser.email, role: adminUser.role }

    res.status(200).json({ message: 'Admin login successful.', user: req.session.user })
  } catch (error) {
    res.status(500).json({ message: 'Admin login failed.', error: error.message })
  }
}

const logoutUser = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({ message: 'Logout failed.' })
    }

    res.clearCookie('connect.sid')
    res.status(200).json({ message: 'Logged out successfully.' })
  })
}

const getCurrentUser = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated.' })
    }

    const user = await User.findById(req.session.userId).select('-password')
    if (!user) {
      return res.status(401).json({ message: 'User not found.' })
    }

    res.status(200).json({ user })
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch user.', error: error.message })
  }
}

module.exports = { registerUser, loginUser, adminLogin, logoutUser, getCurrentUser }
