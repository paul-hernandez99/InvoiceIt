import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import { useAuth } from '../../AuthContext';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import '../../css/InventoryScreen.css';

const InventoryScreen = () => {
    const { currentUser } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [timeRange, setTimeRange] = useState('lastMonth');
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`/products/user/${currentUser?.email}`);
                setProducts(response.data);
            } catch (err) {
                setError('Error fetching products: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [currentUser]);

    const handleFetchChartData = async () => {
        try {
            const response = await axios.get(`/products/user/${currentUser?.email}/code/${selectedProduct}`);
            const productPurchases = response.data;

            let filteredPurchases;
            const now = new Date();

            if (timeRange === 'lastMonth') {
                filteredPurchases = productPurchases.filter(purchase => {
                    const purchaseDate = new Date(purchase.date);
                    return purchaseDate >= new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                });
            } else if (timeRange === 'lastYear') {
                filteredPurchases = productPurchases.filter(purchase => {
                    const purchaseDate = new Date(purchase.date);
                    return purchaseDate >= new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                });
            } else {
                filteredPurchases = productPurchases;
            }

            const data = {
                labels: filteredPurchases.map(purchase => new Date(purchase.date).toLocaleDateString()),
                datasets: [{
                    label: 'Price per Unit',
                    data: filteredPurchases.map(purchase => purchase.price_per_unit),
                    fill: false,
                    backgroundColor: 'rgb(75, 192, 192)',
                    borderColor: 'rgba(75, 192, 192, 0.2)',
                }],
            };

            setChartData(data);
        } catch (error) {
            setError('Error fetching chart data: ' + error.message);
        }
    };

    useEffect(() => {
        if (selectedProduct) {
            handleFetchChartData();
        }
    }, [selectedProduct, timeRange]);

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    if (error) {
        return <div className="alert alert-danger mt-5">{error}</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Inventory</h1>
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Code ID</th>
                            <th>Item Name</th>
                            <th>Date</th>
                            <th>Price Per Unit</th>
                            <th>Quantity</th>
                            <th>Discount (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}>
                                <td>{product.code_id}</td>
                                <td>{product.item_name}</td>
                                <td>{new Date(product.date).toLocaleDateString()}</td>
                                <td>{product.price_per_unit}</td>
                                <td>{product.quantity}</td>
                                <td>{product.discount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-5">
                <h2>Product Purchases Over Time</h2>
                <div className="form-group">
                    <label htmlFor="productSelect">Select Product</label>
                    <select
                        id="productSelect"
                        className="form-control"
                        value={selectedProduct}
                        onChange={e => setSelectedProduct(e.target.value)}
                    >
                        <option value="">-- Select a Product --</option>
                        {products.map(product => (
                            <option key={product._id} value={product.code_id}>{product.item_name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="timeRangeSelect">Select Time Range</label>
                    <select
                        id="timeRangeSelect"
                        className="form-control"
                        value={timeRange}
                        onChange={e => setTimeRange(e.target.value)}
                    >
                        <option value="lastMonth">Last Month</option>
                        <option value="lastYear">Last Year</option>
                        <option value="historically">Historically</option>
                    </select>
                </div>
                {chartData && (
                    <div className="mt-4">
                        <Line data={chartData} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryScreen;
