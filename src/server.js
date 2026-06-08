require('dotenv').config()
const app = require('./app')
const connectDB = require('./config/db')
const { startScheduler } = require('./services/echoScheduler')

const PORT = process.env.PORT || 5000

const start = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Echoes API running on port ${PORT}`)
    startScheduler()
  })
}

start()
