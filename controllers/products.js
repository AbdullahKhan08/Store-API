const Product = require('../models/product')

const getAllProductsStatic = async (req, res) => {
  //   throw new Error('testing async errors')
  const products = await Product.find({}).sort('name')
  res.status(200).json({ products, nbhits: products.length })
}

const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields } = req.query
  const queryObject = {}

  // featured attribute from database
  if (featured) {
    queryObject.featured = featured === 'true' ? true : false
  }

  //   company attribute from database
  if (company) {
    queryObject.company = company
  }

  //   name attribute from database
  if (name) {
    queryObject.name = { $regex: name, $options: 'i' }
  }

  //   sorting
  let result = Product.find(queryObject)
  if (sort) {
    let sortList = sort.split(',').join(' ')
    result = result.sort(sortList)
  } else {
    result = result.sort('createdAt')
  }

  //   select method
  if (fields) {
    let fieldsList = fields.split(',').join(' ')
    result = result.select(fieldsList)
  }

  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  result = result.skip(skip).limit(limit)

  const products = await result

  res.status(200).json({ products, nbhits: products.length })
}

module.exports = {
  getAllProductsStatic,
  getAllProducts,
}
