const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/usersModel')
const Product = require('../models/productsModel')
const Orders = require('../models/ordersModel')

// @desc    Gets all users
// @route   POST /api/users
// @access  Private
const getAdminData = asyncHandler(async (req, res) => {
  if (req.user.type === 'Admin' && req.user.status === 'Active') {
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
  } else {
    res.status(401)
    throw new Error(`Unauthorized, no privilges`)
  }
})

// @desc    Gets all users
// @route   POST /api/users
// @access  Private
const getUsers = asyncHandler(async (req, res) => {
  if (req.user.type === 'Admin' && req.user.status === 'Active') {
    const data = await User.find()

    if (data) {
      res.status(200).json(data)
    } else {
      res.status(500).json({ error: 'unknowen server or DB error' })
    }
  } else {
    res.status(401)
    throw new Error(`Unauthorized, no privilges`)
  }
})

// @desc    Register new user
// @route   POST /api/users/:id
// @access  Public
const getUser = asyncHandler(async (req, res) => {
  const id = req.params.id

  const data = await User.findById(id).select('-password')

  if (data) {
    res.status(200).json(data)
  } else {
    res.status(500).json({ error: 'unknowen server or DB error' })
  }
})

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName,
    lastName,
    email,
    password,
    address,
    phone,
    type,
    status } = req.body

  if (!email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  // Check if user exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password
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

  if (user) {
    res.status(201).json({
      user,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check for user email
  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      user,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})

// @desc    Edit a product
// @route   PUT /api/users/:id
// @access  private
const editUser = asyncHandler(async (req, res) => {
  if (req.user.status === 'Active') {
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
    const doc = await User.findById(id)

    if (doc) {
      const data = await User.findOneAndUpdate({ _id: id }, {
        firstName,
        lastName,
        email,
        address,
        phone,
        type,
        status,
      }, {
        new: true
      })
      res.status(200).json({
        updated: data
      })
    } else {
      res.status(400)
      throw new Error('Invalid user id')
    }
  } else {
    res.status(401)
    throw new Error(`Unauthorized, no privilges`)
  }
})

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  private
const deleteUser = asyncHandler(async (req, res) => {
  if (req.user.type === 'Admin' && req.user.status === 'Active') {
    const id = req.params.id

    // Check for user
    const doc = await User.findById(id)

    if (doc) {
      await User.deleteOne({ _id: id })
      res.status(200).json({
        id: doc.id
      })
    } else {
      res.status(400)
      throw new Error('Invalid user id')
    }
  } else {
    res.status(401)
    throw new Error(`Unauthorized, no privilges`)
  }
})

// @desc    Add a product to the user's cart, wishlist or orders
// @route   PUT /api/users/:id/:location
// @access  private
const addItemToUser = asyncHandler(async (req, res) => {
  if (req.user.status === 'Active') {

    const { itemID } = req.body
    const { id, location } = req.params

    // Check for user
    const user = await User.findById(id)

    if (user) {
      if (!user[location].includes(itemID)) {
        user[location].push(itemID)
        location === 'orders' ? user.cartItems = [] : null
        const data = await User.findOneAndUpdate({ _id: id }, user, {
          new: true
        })
        res.status(200).json({
          updated: data
        })
      } else {
        res.status(400)
        throw new Error('Item already exists')
      }
    } else {
      res.status(400)
      throw new Error('Invalid user id')
    }
  } else {
    res.status(401)
    throw new Error(`Unauthorized, no privilges`)
  }
})

// @desc    Add a product to the user's cart, wishlist or orders
// @route   DELETE /api/users/:id/:location
// @access  private
const deleteItemFromUser = asyncHandler(async (req, res) => {
  if (req.user.status === 'Active') {

    const { itemID } = req.body
    const { id, location } = req.params

    // Check for user
    const user = await User.findById(id)

    if (user) {
      if (user[location].includes(itemID)) {
        const update = user[location].filter(item => item !== itemID)
        const data = await User.findOneAndUpdate({ _id: id }, {
          [location]: update,
        }, {
          new: true
        })
        console.log(data)
        res.status(200).json({
          updated: data
        })
      } else {
        res.status(400)
        throw new Error("Invalid item id")
      }
    } else {
      res.status(400)
      throw new Error('Invalid user id')
    }
  } else {
    res.status(401)
    throw new Error(`Unauthorized, no privilges`)
  }
})

// @desc    Resets user password
// @route   post /api/users/:id
// @access  private
const resetPassword = asyncHandler(async (req, res) => {
  if (req.user.status === 'Active') {

    const { oldPassword, newPassword } = req.body
    const { id } = req.params
    // Check for user
    const user = await User.findById(id)

    if (user && (await bcrypt.compare(oldPassword, user.password))) {

      // Hash password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(newPassword, salt)

      const data = await User.findOneAndUpdate({ _id: id }, {
        password: hashedPassword,
      }, {
        new: true
      })
      res.status(200).json({
        updated: data
      })
    } else {
      res.status(200).json({
        error: 'incorrect old password'
      })
    }
  } else {
    res.status(401)
    throw new Error(`Unauthorized, no privilges`)
  }
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
  loginUser,
  deleteUser,
  editUser,
  addItemToUser,
  deleteItemFromUser,
}
