const router = require('express').Router()
const { createEcho, getEchoes, getEcho, updateEcho, deleteEcho } = require('../controllers/echoController')
const { protect } = require('../middleware/auth')

router.use(protect)

router.route('/').get(getEchoes).post(createEcho)
router.route('/:id').get(getEcho).put(updateEcho).delete(deleteEcho)

module.exports = router
