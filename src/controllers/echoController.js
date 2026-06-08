const Echo = require('../models/Echo')

exports.createEcho = async (req, res, next) => {
  try {
    const { type, content, deliverAt, title } = req.body

    if (new Date(deliverAt) <= new Date()) {
      return res.status(400).json({ message: 'Delivery date must be in the future' })
    }

    const echo = await Echo.create({
      user: req.user._id,
      type,
      content: content || null,
      deliverAt,
      title: title || null
    })

    res.status(201).json({ message: 'Echo scheduled', echo })
  } catch (error) {
    next(error)
  }
}

exports.getEchoes = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    const filter = { user: req.user._id }
    if (status) filter.status = status

    const echoes = await Echo.find(filter)
      .sort({ deliverAt: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))

    const total = await Echo.countDocuments(filter)

    res.json({ echoes, total, page: parseInt(page), pages: Math.ceil(total / limit) })
  } catch (error) {
    next(error)
  }
}

exports.getEcho = async (req, res, next) => {
  try {
    const echo = await Echo.findOne({ _id: req.params.id, user: req.user._id })
    if (!echo) return res.status(404).json({ message: 'Echo not found' })
    res.json({ echo })
  } catch (error) {
    next(error)
  }
}

exports.updateEcho = async (req, res, next) => {
  try {
    const echo = await Echo.findOne({ _id: req.params.id, user: req.user._id })
    if (!echo) return res.status(404).json({ message: 'Echo not found' })
    if (echo.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot edit an echo that has already been delivered' })
    }

    const { content, deliverAt, title } = req.body
    if (deliverAt && new Date(deliverAt) <= new Date()) {
      return res.status(400).json({ message: 'Delivery date must be in the future' })
    }

    if (content !== undefined) echo.content = content
    if (deliverAt) echo.deliverAt = deliverAt
    if (title !== undefined) echo.title = title
    await echo.save()

    res.json({ message: 'Echo updated', echo })
  } catch (error) {
    next(error)
  }
}

exports.deleteEcho = async (req, res, next) => {
  try {
    const echo = await Echo.findOne({ _id: req.params.id, user: req.user._id })
    if (!echo) return res.status(404).json({ message: 'Echo not found' })
    if (echo.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot delete an echo that has already been delivered' })
    }

    await echo.deleteOne()
    res.json({ message: 'Echo cancelled' })
  } catch (error) {
    next(error)
  }
}
