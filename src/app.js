const express = require('express')
const cors = require('cors')
const rateLimit = require('express-rate-limit')
const routes = require('./routes/index')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }))
app.use('/api', routes)

app.get('/health', (req, res) => res.json({ status: 'ok', game: 'Echoes RPG' }))

app.use(errorHandler)

module.exports = app
