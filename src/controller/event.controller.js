const Joi = require('joi')
const _ = require('lodash')
const helpers = require('../lib/helpers')
const EventRepo = require('../repository/event')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const eventCtrl = {}

// GET record
eventCtrl.getList = async (req, res, next) => {
  try {
    if (req.query.where) {
      try {
        req.query.where = JSON.parse(req.query.where)
      } catch (e) {
        res.response = await helpers.errorResponse(400, 'Where parse error!', e)
        return next()
      }
    }
    if (req.query.populate) {
      try {
        req.query.populate = JSON.parse(req.query.populate)
      } catch (e) {
        res.response = await helpers.errorResponse(400, 'Populate parse error!', e)
        return next()
      }
    }

    if (req.query.fields) {
      try {
        req.query.fields = JSON.parse(req.query.fields)
      } catch (e) {
        res.response = await helpers.errorResponse(400, 'Fields parse error!', e)
        return next()
      }
    }
    const result = await EventRepo.find(req.pagination, req.query.isActive, req.query.search,
      req.query.filterBy, req.query.where, req.query.populate, req.query.fields, req.query)
    if (!result) {
      res.response = await helpers.errorResponse(500, 'Something went wrong!')
      return next()
    }
    res.response = await helpers.paginationResponse(200, result.rows, result.count, 'Success')
    return next()
  } catch (e) {
    res.response = await helpers.errorResponse(500, e.message || 'Something went wrong!', e)
    return next()
  }
}
// Get record by Id
eventCtrl.getById = async (req, res, next) => {
  try {
    if (!req.params.id) {
      res.response = await helpers.errorResponse(404, 'Id not found!')
      return next()
    }
    const result = await EventRepo.findById(req.params.id)
    if (!result) {
      res.response = await helpers.errorResponse(500, 'Something went wrong!')
      return next()
    }
    res.response = await helpers.response(200, result, 'Success')
    return next()
  } catch (e) {
    res.response = await helpers.errorResponse(500, e.message || 'Something went wrong!', e)
    return next()
  }
}

// Add record
eventCtrl.create = async (req, res, next) => {
  try {
    const result = await EventRepo.add(req.body)
    if (!result) {
      res.response = await helpers.errorResponse(500, 'Something went wrong!')
      return next()
    }
    res.response = await helpers.response(201, result, 'Created Sucessfully')
    return next()
  } catch (e) {
    res.response = await helpers.errorResponse(500, e.message || 'Something went wrong!', e)
    return next()
  }
}

// UPDATE record
eventCtrl.update = async (req, res, next) => {
  try {
    if (!req.params.id) {
      res.response = await helpers.errorResponse(404, 'Id not found!')
      return next()
    }
    const result = await EventRepo.update({ id: req.params.id }, req.body)
    if (!result) {
      res.response = await helpers.errorResponse(500, 'Something went wrong!')
      return next()
    }
    res.response = await helpers.response(200, result, 'Updated Sucessfully')
    return next()
  } catch (e) {
    res.response = await helpers.errorResponse(500, e.message || 'Something went wrong!', e)
    return next()
  }
}

// DELETE record
eventCtrl.remove = async (req, res, next) => {
  try {
    if (!req.params.id) {
      res.response = await helpers.errorResponse(404, 'Id not found!')
      return next()
    }
    const result = await EventRepo.delete(req.params.id)
    if (!result) {
      res.response = await helpers.errorResponse(500, 'Something went wrong!')
      return next()
    }
    res.response = await helpers.response(200, result, 'Deleted Sucessfully')
    return next()
  } catch (e) {
    res.response = await helpers.errorResponse(500, e.message || 'Something went wrong!', e)
    return next()
  }
}
module.exports = eventCtrl
