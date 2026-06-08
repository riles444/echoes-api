const mongoose = require('mongoose')

const echoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'photo', 'video', 'voice'],
    required: true
  },
  content: {
    type: String,
    default: null
  },
  mediaUrl: {
    type: String,
    default: null
  },
  mediaFilename: {
    type: String,
    default: null
  },
  mediaMimeType: {
    type: String,
    default: null
  },
  deliverAt: {
    type: Date,
    required: [true, 'Delivery date is required']
  },
  status: {
    type: String,
    enum: ['pending', 'delivered', 'failed'],
    default: 'pending'
  },
  deliveredAt: {
    type: Date,
    default: null
  },
  title: {
    type: String,
    trim: true,
    default: null
  }
}, { timestamps: true })

echoSchema.index({ user: 1, status: 1 })
echoSchema.index({ deliverAt: 1, status: 1 })

module.exports = mongoose.model('Echo', echoSchema)
