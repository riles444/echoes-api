const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal server error'

  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack)
  }

  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message)
    return res.status(400).json({ message: 'Validation error', errors })
  }

  if (err.code === 11000) {
    return res.status(400).json({ message: 'Email already in use' })
  }

  res.status(statusCode).json({ message })
}

module.exports = errorHandler
