const productService = require('../services/productService');

const productController = {
  async addProduct(req, res) {
    const { user, code_id, item_name, price_per_unit, quantity, discount } = req.body;
    try {
      const product = await productService.addProduct(user, code_id, item_name, price_per_unit, quantity, discount);
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getAllProductsOfUser(req, res) {
    const userId = req.params.userId;
    try {
      const products = await productService.getAllProductsOfUser(userId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getProductsByCodeId(req, res) {
    const { userId, code_id } = req.params;
    try {
      const products = await productService.getProductsByCodeId(userId, code_id);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = productController;
