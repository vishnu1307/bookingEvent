const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const helpers = {}

const removeEmpty = async (obj) => {
  Object.keys(obj).forEach(key => {
    if (obj[key] && typeof obj[key] === 'object') removeEmpty(obj[key])
    else if (obj[key] === null || key === 'createdAt' || key === 'updatedAt') { delete obj[key] }
  })
  return obj
}

helpers.removeEmpty = async (obj) => {
  return removeEmpty(obj)
}

helpers.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)
  return hash
}

helpers.matchPassword = async (password, savedPassword) => {
  try {
    return await bcrypt.compare(password, savedPassword)
  } catch (e) {
    console.log(e)
  }
}

helpers.createToken = async (data, expire) => {
  const token = jwt.sign(data, 'stiddlenowsecretkey', { expiresIn: expire || '2d' })
  return token
}

helpers.verifyToken = async (token) => {
  try {
    return await jwt.verify(token, 'stiddlenowsecretkey')
  } catch (e) {
    return e
  }
}

helpers.response = async (code, data, message) => {
  return {
    type: 'response',
    status: code,
    data,
    message
  }
}

helpers.paginationResponse = async (code, data, total, message) => {
  return {
    type: 'pagination',
    status: code,
    total,
    data,
    message
  }
}

helpers.errorResponse = async (code, message, err) => {
  return {
    type: 'error',
    status: code,
    message,
    error: err
  }
}

module.exports = helpers
