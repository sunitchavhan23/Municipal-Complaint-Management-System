const mongoose = require('mongoose')

const complaintSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ['Road Damage', 'Garbage Collection', 'Water Supply', 'Street Light', 'Drainage', 'Others'] },
  area: { type: String, required: true },
  otherIssue: { type: String, trim: true },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'In Progress', 'Resolved'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

module.exports = mongoose.model('Complaint', complaintSchema)
