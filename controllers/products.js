const getAllProductsStatic = async (req, res) => {
  res.status(200).json({ message: 'Products testing roue' })
}

const getAllProducts = async (req, res) => {
  res.status(200).json({ message: 'Products Route' })
}

module.exports = {
  getAllProductsStatic,
  getAllProducts,
}
