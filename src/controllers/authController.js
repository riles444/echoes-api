const jwt = require('jsonwebtoken')
const User = require('../models/User')

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body
    const user = await User.create({ username, email, password })
    res.status(201).json({ message: 'Account created', token: signToken(user._id), user: { id: user._id, username, email } })
  } catch (err) { next(err) }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    res.json({ token: signToken(user._id), user: { id: user._id, username: user.username, email } })
  } catch (err) { next(err) }
}

exports.getMe = async (req, res) => {
  res.json({ user: { id: req.user._id, username: req.user.username, email: req.user.email } })
}
