const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const routes = require('./routes/index')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later'
})
app.use('/api', limiter)

app.use('/api', routes)

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'echoes-api' }))

app.use(errorHandler)

module.exports = app
