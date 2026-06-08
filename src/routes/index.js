const router = require('express').Router()

router.use('/auth',       require('./authRoutes'))
router.use('/characters', require('./characterRoutes'))
router.use('/echoes',     require('./echoRoutes'))
router.use('/enemies',    require('./enemyRoutes'))
router.use('/companions', require('./companionRoutes'))
router.use('/battles',    require('./battleRoutes'))

module.exports = router
