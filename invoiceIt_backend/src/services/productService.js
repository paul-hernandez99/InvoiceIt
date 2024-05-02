const Product = require('../models/Product');

const productService = {
  async addProduct(user, code_id, item_name, price_per_unit, quantity, discount) {
    try {
      const product = new Product({
        user,
        code_id,
        item_name,
        price_per_unit,
        quantity,
        discount
      });
      await product.save();
      return { status: 201, body: { message: 'Product created successfully', product } };

    } catch (error) {
      throw new Error(error.message);
    }
  },

  async getAllProductsOfUser(userId) {
    try {
      const products = await Product.find({ user: userId });
      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async getProductsByCodeId(userId, code_id) {
    try {
      const products = await Product.find({ user: userId, code_id });
      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  }
};

module.exports = productService;
