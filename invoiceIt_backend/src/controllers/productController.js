const productService = require('../services/productService');

exports.addGet = async (req, res, next) => {
  try {
      const users = await productService.getAllProducts();
      res.status(200).json(users);
  } catch (error) {
      next(error);
  }
}; 

exports.addProduct = async(req, res, next) => {
  const { user, code_id, item_name, price_per_unit, quantity, discount } = req.body;
  try {
    const product = await productService.addProduct(user, code_id, item_name, price_per_unit, quantity, discount);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProductsOfUser = async (req, res, next) => {
  const userId = req.params.userId;
  try {
    const products = await productService.getAllProductsOfUser(userId);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductsByCodeId = async (req, res, next) => {
  const { userId, code_id } = req.params;
  try {
    const products = await productService.getProductsByCodeId(userId, code_id);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

