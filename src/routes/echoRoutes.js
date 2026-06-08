const router = require('express').Router()
const c = require('../controllers/echoController')
const { protect } = require('../middleware/auth')

router.get('/',              c.getAllEchoes)
router.get('/great',         protect, c.getGreatEchoes)
router.get('/:id',           c.getEchoById)
router.post('/:id/collect',  protect, c.collectEcho)

module.exports = router
