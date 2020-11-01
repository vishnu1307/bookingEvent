const pagination = require('../lib/pagination')
const express = require('express')
const router = express.Router()

router.use('/api/v1/event', pagination.init, require('./event.routes'), pagination.response)
router.use('/api/v1/upload', pagination.init, require('./fileUpload.routes'), pagination.response)

module.exports = router
