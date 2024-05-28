import React, { useState, useEffect, useCallback } from 'react';
import axios from '../../axios';
import { useAuth } from '../../AuthContext';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'chart.js/auto';
import '../../css/InventoryScreen.css';

const InventoryScreen = () => {
    const { currentUser } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [timeRange, setTimeRange] = useState('custom');
    const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
    const [endDate, setEndDate] = useState(new Date());
    const [chartData, setChartData] = useState(null);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [quantityChartData, setQuantityChartData] = useState(null);

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

    const handleFetchChartData = useCallback(async () => {
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
                filteredPurchases = productPurchases.filter(purchase => {
                    const purchaseDate = new Date(purchase.date);
                    return purchaseDate >= startDate && purchaseDate <= endDate;
                });
            }

            const purchasesMap = new Map();
            filteredPurchases.forEach(purchase => {
                const purchaseDate = new Date(purchase.date).toLocaleDateString();
                const effectivePricePerUnit = purchase.price_per_unit * (1 - purchase.discount / 100);
                if (!purchasesMap.has(purchaseDate) || purchasesMap.get(purchaseDate).effectivePricePerUnit < effectivePricePerUnit) {
                    purchasesMap.set(purchaseDate, {
                        ...purchase,
                        effectivePricePerUnit,
                    });
                }
            });

            const filteredUniquePurchases = Array.from(purchasesMap.values());

            const reversedLabels = filteredUniquePurchases.map(purchase => new Date(purchase.date).toLocaleDateString()).reverse();
            const reversedData = filteredUniquePurchases.map(purchase => purchase.effectivePricePerUnit).reverse();

            const data = {
                labels: reversedLabels,
                datasets: [{
                    label: 'Effective Price per Unit',
                    data: reversedData,
                    fill: false,
                    backgroundColor: 'rgb(75, 192, 192)',
                    borderColor: 'rgba(75, 192, 192, 0.2)',
                }],
            };

            setChartData(data);
        } catch (error) {
            setError('Error fetching chart data: ' + error.message);
        }
    }, [currentUser?.email, selectedProduct, timeRange, startDate, endDate]);

    const handleFetchQuantityChartData = useCallback((filteredPurchases) => {
        const monthlyData = new Array(12).fill(0);

        filteredPurchases.forEach(purchase => {
            const purchaseDate = new Date(purchase.date);
            if (purchaseDate.getFullYear() === selectedYear) {
                const month = purchaseDate.getMonth();
                monthlyData[month] += purchase.quantity;
            }
        });

        const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const quantityData = {
            labels: labels,
            datasets: [{
                label: 'Number of Items Bought',
                data: monthlyData,
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
            }],
        };

        setQuantityChartData(quantityData);
    }, [selectedYear]);

    useEffect(() => {
        if (selectedProduct) {
            handleFetchChartData();

            axios.get(`/products/user/${currentUser?.email}/code/${selectedProduct}`)
                .then(response => {
                    const productPurchases = response.data;
                    handleFetchQuantityChartData(productPurchases);
                })
                .catch(error => {
                    setError('Error fetching quantity chart data: ' + error.message);
                });
        }
    }, [selectedProduct, selectedYear, currentUser?.email, handleFetchChartData, handleFetchQuantityChartData]);

    const getUniqueProducts = () => {
        const uniqueProducts = [];
        const productCodes = new Set();
        products.forEach(product => {
            if (!productCodes.has(product.code_id)) {
                productCodes.add(product.code_id);
                uniqueProducts.push(product);
            }
        });
        return uniqueProducts;
    };

    const filterProductsByDateRange = () => {
        const now = new Date();
        let filteredProducts = [];

        if (timeRange === 'lastMonth') {
            filteredProducts = products.filter(product => {
                const productDate = new Date(product.date);
                return productDate >= new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            });
        } else if (timeRange === 'lastYear') {
            filteredProducts = products.filter(product => {
                const productDate = new Date(product.date);
                return productDate >= new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            });
        } else {
            filteredProducts = products.filter(product => {
                const productDate = new Date(product.date);
                return productDate >= startDate && productDate <= endDate;
            });
        }

        return filteredProducts.slice(0, 30);
    };

    const downloadProducts = () => {
        const filteredProducts = filterProductsByDateRange();
        const csvContent = "data:text/csv;charset=utf-8," 
            + filteredProducts.map(product => 
                Object.values(product).join(',')
            ).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "products.csv");
        document.body.appendChild(link);
        link.click();
    };

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    if (error) {
        return <div className="alert alert-danger mt-5">{error}</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center">Inventory Management</h1>

            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <div className="form-group">
                        <label htmlFor="timeRangeSelect"><strong>Select Time Range for Inventory and Price per Unit Plot:</strong></label>
                        <select
                            id="timeRangeSelect"
                            className="form-control"
                            value={timeRange}
                            onChange={e => setTimeRange(e.target.value)}
                        >
                            <option value="lastMonth">Last Month</option>
                            <option value="lastYear">Last Year</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>
                    {timeRange === 'custom' && (
                        <div className="form-group">
                            <label><strong>Select Date Range:</strong></label>
                            <div className="d-flex">
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    selectsStart
                                    startDate={startDate}
                                    endDate={endDate}
                                    className="form-control mr-2"
                                />
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    selectsEnd
                                    startDate={startDate}
                                    endDate={endDate}
                                    className="form-control"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <div className="form-group">
                        <label htmlFor="yearSelect"><strong>Select Year for Number of Items Bought:</strong></label>
                        <select
                            id="yearSelect"
                            className="form-control"
                            value={selectedYear}
                            onChange={e => setSelectedYear(parseInt(e.target.value))}
                        >
                            {Array.from(new Set(products.map(product => new Date(product.date).getFullYear()))).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="card mb-4 shadow-sm">
                <div className="card-body table-responsive">
                    <table className="table table-bordered table-hover table-striped">
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
                            {filterProductsByDateRange().map(product => (
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
            </div>

            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <button className="btn btn-primary mb-4" onClick={downloadProducts}>Download Products</button>
                    <h2>Product Purchases Over Time</h2>
                    <div className="form-group">
                        <label htmlFor="productSelect"><strong>Select Product:</strong></label>
                        <select
                            id="productSelect"
                            className="form-control"
                            value={selectedProduct}
                            onChange={e => setSelectedProduct(e.target.value)}
                        >
                            <option value="">-- Select a Product --</option>
                            {getUniqueProducts().map(product => (
                                <option key={product.code_id} value={product.code_id}>{product.item_name}</option>
                            ))}
                        </select>
                    </div>
                    {chartData && (
                        <div className="mt-4">
                            <Line data={chartData} />
                        </div>
                    )}
                    {quantityChartData && (
                        <div className="mt-4">
                            <h2>Number of Items Bought</h2>
                            <Line data={quantityChartData} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InventoryScreen;
