require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')

const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')

// middleware
app.use(express.json())

// routes
// app.get('/', (req, res) => {
//   res.send(`<h1>Store API</h1><a href="/api/v1/products">Products route</a>`)
// })

app.use('/api/v1/products', productsRouter)

// products route

// error handler middlewares
app.use(errorMiddleware)
app.use(notFoundMiddleware)

const start = async () => {
  try {
    // connect db
    await connectDB(process.env.MONGO_URI)

    app.listen(PORT, () => {
      console.log(`Server started at port ${PORT}...`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
