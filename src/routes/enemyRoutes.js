const router = require('express').Router()
const c = require('../controllers/enemyController')
const { protect } = require('../middleware/auth')

router.get('/',      protect, c.getEnemiesByLocation)
router.get('/all',   c.getAllEnemies)
router.get('/:id',   c.getEnemy)

module.exports = router
