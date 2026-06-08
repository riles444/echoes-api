const router = require('express').Router()
const c = require('../controllers/battleController')
const { protect } = require('../middleware/auth')

router.use(protect)
router.post('/',                    c.startBattle)
router.get('/history',              c.getBattleHistory)
router.get('/:battleId',            c.getBattle)
router.post('/:battleId/turn',      c.takeTurn)

module.exports = router
