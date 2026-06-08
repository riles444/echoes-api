const router = require('express').Router()

router.use('/auth', require('./authRoutes'))
router.use('/echoes', require('./echoRoutes'))
router.use('/media', require('./mediaRoutes'))

module.exports = router
