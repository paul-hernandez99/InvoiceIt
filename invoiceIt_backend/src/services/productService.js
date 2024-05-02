const Product = require('../models/Product');

exports.getAllProducts = async() => {
    return await Product.find();
};

exports.addProduct = async(userId, code_id, item_name, price_per_unit, quantity, discount) => {
  try {
    const product = new Product({
      user: userId,
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
};

  exports.getAllProductsOfUser = async(userId) => {
    try {
      const products = await Product.find({ user: userId });
      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  exports.getProductsByCodeId = async(userId, code_id) => {
    try {
      const products = await Product.find({ user: userId, code_id });
      return products;
    } catch (error) {
      throw new Error(error.message);
    }
  };


