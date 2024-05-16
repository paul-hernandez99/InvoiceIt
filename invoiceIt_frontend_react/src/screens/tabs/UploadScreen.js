import React, { useState } from 'react';
import axios from '../../axios';
import { useAuth } from '../../AuthContext';


const initialProductData = {
    code_id: '',
    item_name: '',
    date: '',
    price_per_unit: '',
    quantity: '',
    discount: '',
};

const UploadScreen = () => {

    const { currentUser } = useAuth();

    // State to store product data
    const [productData, setProductData] = useState(initialProductData);

    // State to store products added to the invoice
    const [products, setProducts] = useState([]);

      // Function to handle adding a product
    const handleAddProduct = async () => {
        try {
            // Add product to local state
            const newProduct = { ...productData };
            setProducts([...products, newProduct]);

            // Save product to database
            await axios.post('/product', {
            ...productData,
            buyer: currentUser?.email, // Use optional chaining
            });

            // Clear product data after adding
            setProductData(initialProductData);
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    // Function to calculate total price of the invoice
    const handleCalculateTotalInvoice = () => {
        const totalPrice = products.reduce((total, product) => {
            const price = parseFloat(product.price_per_unit) * parseFloat(product.quantity);
            const discountedPrice = price - (price * parseFloat(product.discount)) / 100;
            return total + discountedPrice;
        }, 0);
        return totalPrice.toFixed(2); // Fixed to 2 decimal places
    };

    // Function to handle saving the invoice
    const handleSaveInvoice = async () => {
        try {
            // Calculate total amount for the invoice
            const totalAmount = handleCalculateTotalInvoice();

            // Create invoice in the database
            await axios.post('/invoice', {
            user: currentUser?.email, // Use optional chaining
            products: products.map(product => product.code_id),
            totalAmount,
            });

            // Clear products after saving invoice
            setProducts([]);
        } catch (error) {
            console.error('Error saving invoice:', error);
        }
    };

    return (
        <div className="container">
          <h1>Enter Product Details</h1>
          <div className="input-container">
            <input
              placeholder="Code ID"
              value={productData.code_id}
              onChange={e => setProductData({...productData, code_id: e.target.value})}
            />
            <input
              placeholder="Item Name"
              value={productData.item_name}
              onChange={e => setProductData({...productData, item_name: e.target.value})}
            />
            <input
              type="date"
              placeholder="Date"
              value={productData.date}
              onChange={e => setProductData({...productData, date: e.target.value})}
            />
            <input
              placeholder="Price Per Unit"
              value={productData.price_per_unit}
              onChange={e => setProductData({...productData, price_per_unit: e.target.value})}
            />
            <input
              placeholder="Quantity"
              value={productData.quantity}
              onChange={e => setProductData({...productData, quantity: e.target.value})}
            />
            <input
              placeholder="Discount (%)"
              value={productData.discount}
              onChange={e => setProductData({...productData, discount: e.target.value})}
            />
            <button onClick={handleAddProduct}>Add Product</button>
          </div>
          <div className="total-container">
            <p>Total Price: {handleCalculateTotalInvoice()}</p>
            <button onClick={handleSaveInvoice}>Save Invoice</button>
          </div>
          <h2>Products Added to Invoice:</h2>
          {products.map((product, index) => (
            <div key={index} className="product-container">
              <p>{product.item_name}</p>
              <p>Price Per Unit: {product.price_per_unit}</p>
              <p>Quantity: {product.quantity}</p>
              <p>Discount: {product.discount}</p>
            </div>
          ))}
        </div>
      );
}

export default UploadScreen;