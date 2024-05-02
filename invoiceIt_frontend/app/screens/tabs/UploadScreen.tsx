import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import axios from '../../../axios';
import { useUser } from '../../../UserContext';


interface Product {
  code_id: string;
  item_name: string;
  date: string;
  price_per_unit: number;
  quantity: number;
  discount: number;
}

const UploadScreen = () => {

  const { user } = useUser(); // Use useUser hook at the top level of the component
  
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [invoiceId, setInvoiceId] = useState<string>('');
  const [productData, setProductData] = useState<Product>({
    code_id: '',
    item_name: '',
    date: '',
    price_per_unit: 0,
    quantity: 0,
    discount: 0,
  });

  const handleAddProduct = async () => {
    const productDataWithUser = { ...productData, user: user?.email || '' }; // Access user data from the top-level hook
    console.log('Going to save in MongoDB (USER):', user);
    console.log('Going to save in MongoDB:', productDataWithUser);
    try {
      
      // Update local state
      setProducts([...products, productDataWithUser]);
      setProductData({
        code_id: '',
        item_name: '',
        date: '',
        price_per_unit: 0,
        quantity: 0,
        discount: 0,
      });

      // Send product data to backend
      console.log('Going to save in MongoDB:', productDataWithUser);
      const response = await axios.post('/product', productDataWithUser);
      console.log('Product added in MongoDB:', response.data);

    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleCalculateTotal = () => {
    let total = 0;
    products.forEach(product => {
      const price = product.price_per_unit;
      const quantity = product.quantity;
      const discount = product.discount;
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Enter Product Details</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Code ID"
          value={productData.code_id}
          onChangeText={value => setProductData({ ...productData, code_id: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="Item Name"
          value={productData.item_name}
          onChangeText={value => setProductData({ ...productData, item_name: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="Date"
          value={productData.date}
          onChangeText={value => setProductData({ ...productData, date: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="Price Per Unit"
          value={productData.price_per_unit.toString()}
          onChangeText={value => setProductData({ ...productData, price_per_unit: parseFloat(value) })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          value={productData.quantity.toString()}
          onChangeText={value => setProductData({ ...productData, quantity: parseFloat(value) })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Discount (%)"
          value={productData.discount.toString()}
          onChangeText={value => setProductData({ ...productData, discount: parseFloat(value) })}
          keyboardType="numeric"
        />
        <Button title="Add Product" onPress={handleAddProduct} />
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Price: {totalPrice}</Text>
        <Button title="Calculate Total" onPress={handleCalculateTotal} />
        <Button title="Save Invoice" onPress={handleSaveInvoice} />
      </View>
      {/* Display added products */}
      <Text style={styles.header}>Products Added to Invoice:</Text>
      {products.map((product, index) => (
        <View key={index} style={styles.productContainer}>
          <Text>{product.item_name}</Text>
          <Text>Price Per Unit: {product.price_per_unit}</Text>
          <Text>Quantity: {product.quantity}</Text>
          <Text>Discount: {product.discount}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  totalContainer: {
    marginBottom: 20,
  },
  totalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  productContainer: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default UploadScreen;
