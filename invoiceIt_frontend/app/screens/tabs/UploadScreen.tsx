import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

const UploadScreen = () => {
  const [products, setProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [invoiceId, setInvoiceId] = useState('');
  const [productData, setProductData] = useState({
    code_id: '',
    item_name: '',
    date: '',
    price_per_unit: '',
    quantity: '',
    discount: '',
  });

  const handleAddProduct = () => {
    setProducts([...products, productData]);
    setProductData({
      code_id: '',
      item_name: '',
      date: '',
      price_per_unit: '',
      quantity: '',
      discount: '',
    });
  };

  const handleCalculateTotal = () => {
    let total = 0;
    products.forEach(product => {
      const price = parseFloat(product.price_per_unit);
      const quantity = parseInt(product.quantity);
      const discount = parseFloat(product.discount);
      total += (price * quantity) * (1 - (discount / 100));
    });
    setTotalPrice(total);
  };

  const handleSaveInvoice = () => {
    // Send request to backend to save products and invoice
    const invoiceData = {
      invoiceId: invoiceId, // You need to set invoiceId when it's available
      products: products,
      totalPrice: totalPrice,
    };
    console.log('Saving invoice:', invoiceData);
    // Implement logic to send request to backend to save invoice
  };

  return (
    <View>
      <Text>Enter Product Details</Text>
      <TextInput
        placeholder="Code ID"
        value={productData.code_id}
        onChangeText={value => setProductData({ ...productData, code_id: value })}
      />
      <TextInput
        placeholder="Item Name"
        value={productData.item_name}
        onChangeText={value => setProductData({ ...productData, item_name: value })}
      />
      <TextInput
        placeholder="Date"
        value={productData.date}
        onChangeText={value => setProductData({ ...productData, date: value })}
      />
      <TextInput
        placeholder="Price Per Unit"
        value={productData.price_per_unit}
        onChangeText={value => setProductData({ ...productData, price_per_unit: value })}
      />
      <TextInput
        placeholder="Quantity"
        value={productData.quantity}
        onChangeText={value => setProductData({ ...productData, quantity: value })}
      />
      <TextInput
        placeholder="Discount (%)"
        value={productData.discount}
        onChangeText={value => setProductData({ ...productData, discount: value })}
      />
      <Button title="Add Product" onPress={handleAddProduct} />
      <Text>Total Price: {totalPrice}</Text>
      <Button title="Calculate Total" onPress={handleCalculateTotal} />
      <Button title="Save Invoice" onPress={handleSaveInvoice} />
    </View>
  );
};

export default UploadScreen;
