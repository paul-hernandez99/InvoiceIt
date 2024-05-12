import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import axios from '../../../axios';
import { useUser } from '../../../UserContext';

const UploadScreen = () => {

  const { user } = useUser() || {}; // Use optional chaining to handle null value

  // Define the type for productData
  interface ProductData {
    code_id: string;
    item_name: string;
    date: string;
    price_per_unit: string;
    quantity: string;
    discount: string;
  }

  // Define the initial state for productData
  const initialProductData: ProductData = {
    code_id: '',
    item_name: '',
    date: '',
    price_per_unit: '',
    quantity: '',
    discount: '',
  };

  // State to store product data
  const [productData, setProductData] = useState<ProductData>(initialProductData);

  // State to store products added to the invoice
  const [products, setProducts] = useState<ProductData[]>([]);

  // Function to handle adding a product
  const handleAddProduct = async () => {
    try {
      // Add product to local state
      const newProduct = { ...productData };
      setProducts([...products, newProduct]);

      // Save product to database
      await axios.post('/products', {
        ...productData,
        buyer: user?.email, // Use optional chaining
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
      await axios.post('/invoices', {
        user: user?.email, // Use optional chaining
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Enter Product Details</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Code ID"
          value={productData.code_id}
          onChangeText={value => setProductData({...productData, code_id: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="Item Name"
          value={productData.item_name}
          onChangeText={value => setProductData({...productData, item_name: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="Date"
          value={productData.date}
          onChangeText={value => setProductData({...productData, date: value })}
        />
        <TextInput
          style={styles.input}
          placeholder="Price Per Unit"
          value={productData.price_per_unit}
          onChangeText={value => setProductData({...productData, price_per_unit: value })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Quantity"
          value={productData.quantity}
          onChangeText={value => setProductData({...productData, quantity: value })}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Discount (%)"
          value={productData.discount}
          onChangeText={value => setProductData({...productData, discount: value })}
          keyboardType="numeric"
        />
        <Button title="Add Product" onPress={handleAddProduct} />
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Price: {handleCalculateTotalInvoice()}</Text>
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
