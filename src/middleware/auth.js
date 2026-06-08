const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized' })
    }
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    if (!req.user) return res.status(401).json({ message: 'User not found' })
    next()
  } catch {
    res.status(401).json({ message: 'Token invalid or expired' })
  }
}

module.exports = { protect }
