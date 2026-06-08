const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: 'Validation error', errors: Object.values(err.errors).map(e => e.message) })
  }
  if (err.code === 11000) return res.status(400).json({ message: 'Duplicate value — username or email already exists' })
  res.status(status).json({ message: err.message || 'Internal server error' })
}

module.exports = errorHandler
