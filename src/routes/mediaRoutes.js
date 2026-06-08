const router = require('express').Router()
const { uploadMedia } = require('../controllers/mediaController')
const { protect } = require('../middleware/auth')
const upload = require('../middleware/upload')

router.post('/upload', protect, upload.single('file'), uploadMedia)

module.exports = router
