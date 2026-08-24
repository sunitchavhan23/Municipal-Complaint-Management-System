const express = require('express')
const router = express.Router()
const { createComplaint, getComplaints, getComplaintById, updateComplaint, deleteComplaint } = require('../controllers/complaintController')
const { isAuthenticated, isAdmin } = require('../middleware/auth')

router.post('/', isAuthenticated, createComplaint)
router.get('/', isAuthenticated, getComplaints)
router.get('/:id', isAuthenticated, getComplaintById)
router.put('/:id', isAuthenticated, updateComplaint)
router.delete('/:id', isAuthenticated, deleteComplaint)

module.exports = router
