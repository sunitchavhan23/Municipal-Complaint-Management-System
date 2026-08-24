const express = require('express')
const router = express.Router()
const { registerUser, loginUser, adminLogin, logoutUser, getCurrentUser } = require('../controllers/authController')
const { isAuthenticated } = require('../middleware/auth')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/admin-login', adminLogin)
router.post('/logout', logoutUser)
router.get('/me', isAuthenticated, getCurrentUser)

module.exports = router
