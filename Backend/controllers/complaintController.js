const Complaint = require('../models/Complaint')
const mongoose = require('mongoose')

const createComplaint = async (req, res) => {
  try {
    const { title, description, category, area, otherIssue, priority } = req.body

    if (!title || !description || !category || !area) {
      return res.status(400).json({ message: 'Title, description, category and area are required.' })
    }

    const complaint = new Complaint({
      title,
      description,
      category,
      area,
      otherIssue: otherIssue || '',
      priority: priority || 'Medium',
      status: 'Pending',
      user: req.session.userId
    })

    await complaint.save()
    res.status(201).json({ message: 'Complaint created successfully.', complaint })
  } catch (error) {
    res.status(500).json({ message: 'Could not create complaint.', error: error.message })
  }
}

const getComplaints = async (req, res) => {
  try {
    const { search, category, status, mine } = req.query

    const query = {}
    if (mine === 'true' || req.session.role !== 'admin') {
      query.user = req.session.userId
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    if (category) query.category = category
    if (status) query.status = status

    const complaints = await Complaint.find(query).sort({ createdAt: -1 }).populate('user', 'name email')
    res.status(200).json({ complaints })
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch complaints.', error: error.message })
  }
}

const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid complaint id.' })
    }

    const complaint = await Complaint.findById(id).populate('user', 'name email')
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' })
    }

    if (req.session.role !== 'admin' && complaint.user.toString() !== req.session.userId.toString()) {
      return res.status(403).json({ message: 'You cannot access this complaint.' })
    }

    res.status(200).json({ complaint })
  } catch (error) {
    res.status(500).json({ message: 'Could not fetch complaint.', error: error.message })
  }
}

const updateComplaint = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid complaint id.' })
    }

    const complaint = await Complaint.findById(id)
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' })
    }

    if (req.session.role !== 'admin' && complaint.user.toString() !== req.session.userId.toString()) {
      return res.status(403).json({ message: 'You cannot update this complaint.' })
    }

    const updates = req.body
    if (req.session.role !== 'admin') {
      delete updates.status
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(id, updates, { new: true })
    res.status(200).json({ message: 'Complaint updated successfully.', complaint: updatedComplaint })
  } catch (error) {
    res.status(500).json({ message: 'Could not update complaint.', error: error.message })
  }
}

const deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid complaint id.' })
    }

    const complaint = await Complaint.findById(id)
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' })
    }

    if (req.session.role !== 'admin' && complaint.user.toString() !== req.session.userId.toString()) {
      return res.status(403).json({ message: 'You cannot delete this complaint.' })
    }

    await Complaint.findByIdAndDelete(id)
    res.status(200).json({ message: 'Complaint deleted successfully.' })
  } catch (error) {
    res.status(500).json({ message: 'Could not delete complaint.', error: error.message })
  }
}

module.exports = { createComplaint, getComplaints, getComplaintById, updateComplaint, deleteComplaint }
