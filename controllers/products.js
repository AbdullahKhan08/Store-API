const Product = require('../models/product')

// testing route
const getAllProductsStatic = async (req, res) => {
  //   throw new Error('testing async errors')
  const products = await Product.find({ price: { $gt: 30 } }).sort('name')
  res.status(200).json({ products, nbhits: products.length })
}

// get all products route with other functionalities of query params
const getAllProducts = async (req, res) => {
  const { featured, company, name, sort, fields, numericFilters } = req.query
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

  //   numeric filters
  if (numericFilters) {
    const operatorMap = {
      '>': 'gt',
      '>=': 'gte',
      '=': 'eq',
      '<': 'lt',
      '<=': 'lte',
    }

    const regEx = /\b(<|>|>=|=|<|<=)\b/g

    let filters = numericFilters.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    )

    const options = ['price', 'rating']
    filters = filters.split(',').forEach((item) => {
      const [field, operator, value] = item.split('-')

      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) }
      }
    })
  }
  console.log(queryObject)

  let result = Product.find(queryObject)
  //   sorting
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

  //   pagination logic with skip and limit functionalities
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit
  //   result = result.skip(skip).limit(limit)

  const products = await result
  res.status(200).json({ products, nbhits: products.length })
}

module.exports = {
  getAllProductsStatic,
  getAllProducts,
}
