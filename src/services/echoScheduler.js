const cron = require('node-cron')
const Echo = require('../models/Echo')
const { deliverEcho } = require('./deliveryService')

const startScheduler = () => {
  // Runs every minute, checks for echoes due for delivery
  cron.schedule('* * * * *', async () => {
    const now = new Date()
    const dueEchoes = await Echo.find({
      status: 'pending',
      deliverAt: { $lte: now }
    }).populate('user')

    for (const echo of dueEchoes) {
      await deliverEcho(echo)
    }
  })

  console.log('Echo scheduler started')
}

module.exports = { startScheduler }
