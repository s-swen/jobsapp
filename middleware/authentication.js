const jwt = require('jsonwebtoken')
require('dotenv').config()
const { UnauthenticatedError } = require('../errors')
const User = require('../models/User')

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({_id: decoded.userId})
    if (!user) {
      throw new UnauthenticatedError('Invalid Credentials')
    }
    req.user = {userId: user._id, name: user.name}
    next()
  } catch (error) {
    throw new UnauthenticatedError('Invalid Credentials')
  }
}

module.exports = auth
