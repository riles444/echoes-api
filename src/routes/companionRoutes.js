const router = require('express').Router()
const c = require('../controllers/companionController')
const { protect } = require('../middleware/auth')

router.get('/',                protect, c.getAllCompanions)
router.get('/:id',             c.getCompanion)
router.post('/:id/recruit',    protect, c.recruitCompanion)

module.exports = router
