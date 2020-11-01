const Sequelize = require('sequelize')
const Models = require('../models')
const PaginationDefaults = require('../../config/pagination')
const Op = Sequelize.Op

const eventRepo = {}


eventRepo.findById = async (id, isActive) => {
  const condition = {}
  if (isActive === false || isActive === true) {
    condition.isActive = isActive
  }
  const result = await Models.event.findOne({
    where: {
      id,
      deletedAt: null,
      ...condition
    }
  })

  if (result) {
    return result.get({ plain: true })
  } else {
    return null
  }
}

eventRepo.find = async (pagination, isActive, search, filterBy, condition, populate, attributes, query) => {
  if (!attributes || !attributes.length) {
    attributes = { include: [] }
  }
  if (!condition) {
    condition = {}
  }
  if (!pagination) {
    pagination = PaginationDefaults
  }
  if (isActive === false || isActive === true) {
    condition.isActive = isActive
  }

  var modelInstance = Models.event
  // check query
  if (query) {
    Object.keys(query).forEach((key) => {
      if (modelInstance.rawAttributes[key]) {
        try {
          condition[key] = JSON.parse(query[key])
        } catch (e) {
          condition[key] = query[key]
        }
      }
    })
  }

  // Search part
  const filterMap = {
    default: 'name',
    name: 'name',
    description: 'description',
  }

  if (search) {
    if (filterBy && filterBy !== 'all') {
      condition[filterMap[filterBy] || filterMap.default] = {
        [Op.like]: `%${search}%`
      }
    } else {
      const filterKeys = Object.keys(filterMap)
      condition[Op.or] = {}
      for (const filter of filterKeys) {
        const colName = filterMap[filter]
        condition[Op.or][colName] = {
          [Op.like]: `%${search}%`
        }
      }
    }
  }

  // include array construct function
  const populateItem = (populateArray, modelInst) => {
    const currentModelInstance = modelInst
    return populateArray.map(item => {
      if (typeof item === 'string') {
        item = { name: item }
      }
      if (currentModelInstance.associations && currentModelInstance.associations[item.name]) {
        const obj = {
          model: Models[currentModelInstance.associations[item.name].target ? currentModelInstance.associations[item.name].target.name : currentModelInstance.associations[item.name].toTarget.as],
          as: currentModelInstance.associations[item.name].as,
          attributes: item.fields || {},
          where: item.where || {},
          required: item.required || false
        }
        if (item.populate) {
          obj.include = populateItem(item.populate, obj.model)
        }
        return obj
      }
    })
  }
  var includeData = []
  if (populate && populate.length) {
    includeData = populateItem(populate, modelInstance)
  }

  const result = await Models.event.findAndCountAll({
    where: {
      ...condition
    },
    attributes,
    include: includeData,
    limit: !pagination.all ? pagination.pageSize : undefined,
    offset: !pagination.all ? pagination.offset : undefined,
    order: Sequelize.literal(`${pagination.sortBy} ${pagination.sortOrder}`)
  })
  return { count: result.count, rows: result.rows.map((data) => data.get({ plain: true })) }
}

eventRepo.add = async (data) => {
  return await Models.event.create(data)
}

eventRepo.update = async (condition, data) => {
  return await Models.event.update(data, {
    where: condition
  }).then(async (i) => {
    return await Models.event.findAll({
      where: condition
    })
  })
}

eventRepo.delete = async (id) => {
  return await Models.event.destroy({
    where: {
      id: id
    }
  })
}

eventRepo.remove = async (id) => {
  return await Sequelize.query(`DELETE FROM event WHERE id = '${id}'`, { type: Sequelize.QueryTypes.DELETE })
}
module.exports = eventRepo
