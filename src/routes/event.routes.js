const express = require("express");
const router= express.Router();
const { getList, getById, create, update, remove } = require('../controller/event.controller')

router.get('/', getList)
router.get('/:id', getById)
router.post('/', create)
router.put('/:id', update)
router.delete('/:id', remove)

module.exports = router

