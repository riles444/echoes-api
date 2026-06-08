const path = require('path')
const Echo = require('../models/Echo')

exports.uploadMedia = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

    const { deliverAt, title } = req.body
    if (!deliverAt) return res.status(400).json({ message: 'deliverAt is required' })
    if (new Date(deliverAt) <= new Date()) {
      return res.status(400).json({ message: 'Delivery date must be in the future' })
    }

    const mime = req.file.mimetype
    const type = mime.startsWith('video') ? 'video'
      : mime.startsWith('image') ? 'photo'
      : 'voice'

    const echo = await Echo.create({
      user: req.user._id,
      type,
      mediaUrl: `/uploads/${type}s/${req.file.filename}`,
      mediaFilename: req.file.filename,
      mediaMimeType: mime,
      deliverAt,
      title: title || null
    })

    res.status(201).json({ message: 'Media echo scheduled', echo })
  } catch (error) {
    next(error)
  }
}
