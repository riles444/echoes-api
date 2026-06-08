const router = require('express').Router()
const c = require('../controllers/characterController')
const { protect } = require('../middleware/auth')

router.use(protect)
router.post('/',           c.createCharacter)
router.get('/',            c.getCharacter)
router.post('/level-up',   c.levelUp)
router.post('/move',       c.moveToLocation)
router.post('/choice',     c.makeChoice)
router.delete('/',         c.deleteCharacter)

module.exports = router
