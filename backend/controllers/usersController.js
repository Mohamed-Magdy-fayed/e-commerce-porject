// Generate a token to auth users
const jwt = require('jsonwebtoken')
// Create hashed password to be saved in DB
const bcrypt = require('bcryptjs')
// Handle the async requests to the API
const asyncHandler = require('express-async-handler')
// mongoDB models
const User = require('../models/usersModel')
const Product = require('../models/productsModel')
const Orders = require('../models/ordersModel')

// @desc    Get admin statstics
// @route   POST /api/users/admin
// @access  Private
const getAdminData = asyncHandler(async (req, res) => {
  // check user privilege
  if (req.user.type !== 'Admin') return res.status(401).json({ error: `access denied, not an admin` })
  if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, admin account is not active` })

  const users = await User.find()
  const products = await Product.find()
  const orders = await Orders.find()

  if (users && products && orders) {
    const data = {
      users,
      products,
      orders,
    }
    res.status(200).json(data)
  } else {
    res.status(500).json({ error: 'unknowen server or DB error' })
  }
})

// @desc    Gets all users
// @route   POST /api/users
// @access  Private
const getUsers = asyncHandler(async (req, res) => {
  // check user privilege
  if (req.user.type !== 'Admin') return res.status(401).json({ error: `access denied, not an admin` })
  if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, admin account is not active` })

  // get the data
  const data = await User.find()
  if (!data) return res.status(500).json({ error: 'unknowen server or DB error' })

  res.status(200).json(data)
})

// @desc    Get one user
// @route   GET /api/users/userid:id
// @access  Public
const getUser = asyncHandler(async (req, res) => {
  // check user privilege
  if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, account is not active` })

  const id = req.params.id
  // get the data
  const data = await User.findById(id).select('-password')
  if (!data) return res.status(500).json({ error: 'unknowen server or DB error' })

  res.status(200).json(data)
})

// @desc    Register new user
// @route   POST /api/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName,
    lastName,
    email,
    password,
    address,
    phone,
  } = req.body

  // Check if user exists
  const userExists = await User.findOne({ email })
  if (userExists) return res.status(400).json({ error: `user already exists` })

  // Hash the password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    address,
    phone,
    type: 'User',
    status: 'Active',
    cartItems: [],
    wishlistItems: [],
    orders: [],
  })
  if (!user) return res.status(500).json({ error: `unknowen server or DB error` })

  res.status(201).json({
    user,
    token: generateToken(user._id),
  })
})

// @desc    Admin add new user
// @route   POST /api/adduser
// @access  Public
const adminAddUser = asyncHandler(async (req, res) => {
  // check user privilege
  if (req.user.type !== 'Admin') return res.status(401).json({ error: `access denied, not an admin` })
  if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, admin account is not active` })

  const { firstName,
    lastName,
    email,
    password,
    address,
    phone,
    type,
    status,
  } = req.body


  // Check if user exists
  const userExists = await User.findOne({ email })
  if (userExists) return res.status(400).json({ error: `user already exists` })

  // Hash the password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    address,
    phone,
    type,
    status,
    cartItems: [],
    wishlistItems: [],
    orders: [],
  })
  if (!user) return res.status(500).json({ error: `unknowen server or DB error` })

  res.status(201).json({
    user,
    token: generateToken(user._id),
  })
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check for user email
  const user = await User.findOne({ email })

  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(400).json({ error: `invalid credentials` })

  res.json({
    user,
    token: generateToken(user._id),
  })
})

// @desc    Edit a user
// @route   PUT /api/users/:id
// @access  private
const editUser = asyncHandler(async (req, res) => {
  // check user privilege
  if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, account is not active` })

  const {
    firstName,
    lastName,
    email,
    address,
    phone,
    type,
    status,
  } = req.body
  const id = req.params.id

  // Check for user
  const user = await User.findById(id)
  if (!user) return res.status(400).json({ error: 'invalid user ID' })

  const edits = req.user.type === 'Admin' ? {
    firstName,
    lastName,
    email,
    address,
    phone,
    type,
    status,
  } : {
    firstName,
    lastName,
    email,
    address,
    phone,
  }

  if (edits.email !== user.email) {
    // check email
    const isDublicate = await User.find({ email: edits.email })
    if (isDublicate.length > 0) return res.status(400).json({ error: `user email already exists` })
  }

  // update the user
  const data = await User.findOneAndUpdate({ _id: id }, edits, {
    new: true
  })
  if (!data) return res.status(500).json({ error: 'unknowen server or DB error' })

  res.status(200).json({ updated: data })
})

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  private
const deleteUser = asyncHandler(async (req, res) => {
  // check user privilege
  if (req.user.type !== 'Admin') return res.status(401).json({ error: `access denied, not an admin` })
  if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, admin account is not active` })

  const id = req.params.id

  // Check for user
  const doc = await User.findById(id)
  if (!doc) return res.status(400).json({ error: `invalid user id` })

  const deleted = await User.deleteOne({ _id: id })
  if (!deleted) return res.status(500).json({ error: 'unknowen server or DB error' })

  res.status(200).json({ deletedID: doc.id })
})

// @desc    Add a product to the user's cart, wishlist or orders
// @route   PUT /api/users/:id/:location
// @access  private
const addItemToUser = asyncHandler(async (req, res) => {
  // check user privilege
  if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, account is not active` })

  const { itemID } = req.body
  const { id, location } = req.params

  // Check for user
  const user = await User.findById(id)

  if (!user) return res.status(400).json({ error: `invalid user id` })
  if (user[location].includes(itemID)) return res.status(400).json({ error: `item already exists` })

  user[location].push(itemID)
  location === 'orders' ? user.cartItems = [] : null
  const data = await User.findOneAndUpdate({ _id: id }, user, {
    new: true
  })
  if (!data) return res.status(500).json({ error: 'unknowen server or DB error' })

  res.status(200).json({ updated: data })
})

// @desc    delete a product from the user's cart, wishlist or orders
// @route   DELETE /api/users/:id/:location
// @access  private
const deleteItemFromUser = asyncHandler(async (req, res) => {
  // check user privilege
  if (req.user.status !== 'Active') return res.status(401).json({ error: `access denied, account is not active` })

  const { itemID } = req.body
  const { id, location } = req.params

  // Check for user
  const user = await User.findById(id)

  if (!user) return res.status(400).json({ error: `invalid user id` })
  if (!user[location].includes(itemID)) return res.status(400).json({ error: `invalid item id` })

  const update = user[location].filter(item => item !== itemID)
  const data = await User.findOneAndUpdate({ _id: id }, {
    [location]: update,
  }, {
    new: true
  })
  if (!data) return res.status(500).json({ error: 'unknowen server or DB error' })

  res.status(200).json({ updated: data })

})

// @desc    Resets user password
// @route   post /api/users/userid:id
// @access  private
const resetPassword = asyncHandler(async (req, res) => {

  const { email, oldPassword, newPassword } = req.body

  // Check for user
  const user = await User.find({ email: email })
  if (!user) return res.status(400).json({ error: 'incorrect email' })
  if (!(await bcrypt.compare(oldPassword, user[0].password))) return res.status(400).json({ error: 'incorrect old password' })

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(newPassword, salt)

  const data = await User.findOneAndUpdate({ email: email }, {
    password: hashedPassword,
  }, {
    new: true
  })
  if (!data) return res.status(500).json({ error: 'unknowen server or DB error' })

  res.status(200).json({ updated: data })
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

module.exports = {
  getAdminData,
  getUser,
  resetPassword,
  getUsers,
  registerUser,
  adminAddUser,
  loginUser,
  deleteUser,
  editUser,
  addItemToUser,
  deleteItemFromUser,
}
