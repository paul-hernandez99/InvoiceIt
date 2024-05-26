import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import { useAuth } from '../../AuthContext';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'chart.js/auto';
import '../../css/HomeScreen.css';

const HomeScreen = () => {
    const { currentUser } = useAuth();
    const [totalMoneySpent, setTotalMoneySpent] = useState(0);
    const [totalProductsBought, setTotalProductsBought] = useState(0);
    const [totalInvoices, setTotalInvoices] = useState(0);
    const [chartData, setChartData] = useState(null);
    const [timeRange, setTimeRange] = useState('custom');
    const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
    const [endDate, setEndDate] = useState(new Date());

    useEffect(() => {
        if (currentUser) {
            fetchMetrics();
        }
    }, [currentUser, timeRange, startDate, endDate]);

    const fetchMetrics = async () => {
        try {
            const [invoicesRes, productsRes] = await Promise.all([
                axios.get(`/invoices/users/${currentUser?.email}`),
                axios.get(`/products/user/${currentUser?.email}`)
            ]);

            const invoices = invoicesRes.data;
            const products = productsRes.data;

            const filteredInvoices = filterByDateRange(invoices);
            const filteredProducts = filterByDateRange(products);

            setTotalMoneySpent(filteredInvoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0));
            setTotalProductsBought(filteredProducts.reduce((sum, product) => sum + product.quantity, 0));
            setTotalInvoices(filteredInvoices.length);

            generateChartData(filteredInvoices);
        } catch (error) {
            console.error('Error fetching metrics:', error.message);
        }
    };

    const filterByDateRange = (items) => {
        const now = new Date();
        return items.filter(item => {
            const itemDate = new Date(item.date || item.createdAt);
            if (timeRange === 'lastMonth') {
                return itemDate >= new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
            } else if (timeRange === 'lastYear') {
                return itemDate >= new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
            } else {
                return itemDate >= startDate && itemDate <= endDate;
            }
        });
    };

    const generateChartData = (filteredInvoices) => {
        const dataMap = new Map();

        filteredInvoices.forEach(invoice => {
            const date = new Date(invoice.createdAt);
            const key = timeRange === 'lastYear' || timeRange === 'custom' && endDate.getFullYear() - startDate.getFullYear() > 1
                ? `${date.getFullYear()}-${date.getMonth() + 1}`
                : date.toLocaleDateString();

            if (!dataMap.has(key)) {
                dataMap.set(key, 0);
            }
            dataMap.set(key, dataMap.get(key) + invoice.totalAmount);
        });

        const labels = Array.from(dataMap.keys()).sort();
        const data = labels.map(label => dataMap.get(label));

        setChartData({
            labels,
            datasets: [{
                label: 'Money Spent',
                data,
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            }],
        });
    };

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center">Home Dashboard</h1>
            <div className="row mb-4">
                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5>Total Money Spent</h5>
                            <p className="card-text">${totalMoneySpent.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5>Total Products Bought</h5>
                            <p className="card-text">{totalProductsBought}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h5>Total Invoices</h5>
                            <p className="card-text">{totalInvoices}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <div className="form-group">
                        <label htmlFor="timeRangeSelect"><strong>Select Time Range:</strong></label>
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
            {chartData && (
                <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <h2>Money Spent Over Time</h2>
                        <Line data={chartData} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeScreen;
