const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/usersModel')

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      if (decoded.exp < new Date() / 1000) return res.status(401).json({ error: `Your session has expired, please login to continue.` })

      // Get user from the token
      const user = await User.findById(decoded.id).select('-password')
      req.user = user

      next()
    } catch (error) {
      res.status(401).json({ error })
    }
  }

  if (!token) return res.status(401).json({ error: `not authorized, no token` })
})

module.exports = { protect }
