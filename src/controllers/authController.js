const jwt = require('jsonwebtoken')
const User = require('../models/User')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

const signRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN })

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ message: 'Email already in use' })

    const user = await User.create({ name, email, password })
    const accessToken = signToken(user._id)
    const refreshToken = signRefreshToken(user._id)

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    res.status(201).json({
      message: 'Account created',
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email }
    })
  } catch (error) {
    next(error)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const accessToken = signToken(user._id)
    const refreshToken = signRefreshToken(user._id)
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    res.json({
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email }
    })
  } catch (error) {
    next(error)
  }
}

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) return res.status(401).json({ message: 'Refresh token required' })

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    const user = await User.findById(decoded.id).select('+refreshToken')
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Invalid refresh token' })
    }

    const accessToken = signToken(user._id)
    res.json({ accessToken })
  } catch (error) {
    next(error)
  }
}

exports.logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null })
    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    next(error)
  }
}
