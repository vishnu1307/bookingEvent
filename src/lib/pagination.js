
const PaginationDefaults = require('../../config/pagination')
const { removeEmpty } = require('./helpers')

const pagination = {}

pagination.init = async (req, res, next) => {
  const pagination = {
    pageSize: Number(req.query.pageSize) || PaginationDefaults.pageSize,
    offset: Number(req.query.offset) || PaginationDefaults.offset,
    sortBy: req.query.sortBy || PaginationDefaults.sortBy,
    sortOrder: req.query.sortOrder || PaginationDefaults.sortOrder,
    message: 'Something Went Wrong!'
  }

  if (req.body) {
    req.body = await removeEmpty(req.body)
  }

  req.pagination = pagination

  // On some APIs, we allow pageSize to be ignored. It can be done by setting
  // pageSize to a negative value.
  req.pagination.all = req.pagination.pageSize < 0

  // If sort order from payload has value other than [asc, desc]
  // Replace it with asc
  if (req.pagination.sortOrder && req.pagination.sortOrder !== 'asc' && req.pagination.sortOrder !== 'desc') {
    req.pagination.sortOrder = 'desc'
  }

  // If pageSize is to be ignored, always set pageSize to -1 for consistency.
  if (req.pagination.all) {
    req.pagination.pageSize = -1
    req.pagination.offset = 0
  }

  // We haven't added .positive() validation because we don't want it to cause
  // any error
  if (req.pagination.offset < 0) {
    req.pagination.offset = 0
  }

  return next()
}

pagination.response = async (req, res, next) => {
  if (res.response) {
    const status = res.response ? res.response.status : 500 || res.status || 500
    const meta = {
      status: status,
      message: res.response.message || req.pagination.message
    }
    if (res.response.type === 'pagination') {
      meta.total = res.response ? (res.response.total || 0) : 0
      meta.pageSize = req.pagination.pageSize
      meta.offset = req.pagination.offset
      meta.sortBy = req.pagination.sortBy
      meta.sortOrder = req.pagination.sortOrder
    }
    res.status(status).json(res.response.type === 'error' ? {
      meta, error: ((res.response.error && res.response.error.stack) ? res.response.error.stack : res.response.error) || {}
    } : {
      meta, data: res.response.data || {}
    })
  } else {
    res.status(404).json({ meta: { status: 404, message: 'Method or URL not found' }, error: {} })
  }
}

module.exports = pagination
