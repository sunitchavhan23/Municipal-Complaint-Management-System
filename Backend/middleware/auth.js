const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next()
  }

  return res.status(401).json({ message: 'Please log in to continue.' })
}

const isAdmin = (req, res, next) => {
  if (req.session && req.session.role === 'admin') {
    return next()
  }

  return res.status(403).json({ message: 'Admin access required.' })
}

module.exports = { isAuthenticated, isAdmin }
