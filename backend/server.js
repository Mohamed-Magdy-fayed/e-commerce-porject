const path = require('path')
const express = require('express')
const dotenv = require('dotenv').config()
const { errorHandler } = require('./middleware/errorMiddleware')
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const port = process.env.PORT || 5000

// Connect the DB to the server
const connectDB = require('./config/db')
connectDB()

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Define the routers used
app.use('/api/users', require('./routes/usersRoutes'))
app.use('/api/products', require('./routes/productsRoutes'))
app.use('/api/orders', require('./routes/ordersRoutes'))
app.use('/api/coupons', require('./routes/couponsRoutes'))
app.use('/api/carousel', require('./routes/carouselRoutes'))
app.use('/api/payment', require('./routes/paymentRoutes'))

// Serve frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(
      path.resolve(__dirname, '../', 'frontend', 'build', 'index.html')
    )
  )
} else {
  app.get('/', (req, res) => res.send('Please set to production!'))
}

app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))
