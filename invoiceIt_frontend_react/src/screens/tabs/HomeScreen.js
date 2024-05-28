import React, { useState, useEffect } from 'react';
import axios from '../../axios';
import { useAuth } from '../../AuthContext';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const HomeScreen = () => {
    const { currentUser } = useAuth();
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [chartData, setChartData] = useState(null);
    const [invoiceCount, setInvoiceCount] = useState(0);
    const [productCount, setProductCount] = useState(0); // New state for product count
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1)); // Start date for time range
    const [endDate, setEndDate] = useState(new Date()); // End date for time range
    const [productPurchases, setProductPurchases] = useState([]);

    
    const calculateProductCount = (filteredProductPurchases) => {
        let totalCount = 0;
        filteredProductPurchases.forEach(purchase => {
            totalCount += purchase.quantity;
        });
        setProductCount(totalCount);
    };


    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axios.get(`/invoices/users/${currentUser?.email}`);
                setInvoices(response.data);
                const response_products = await axios.get(`/products/user/${currentUser?.email}`);
                setProductPurchases(response_products.data);

            } catch (err) {
                setError('Error fetching invoices: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [currentUser]);

    useEffect(() => {
        if (invoices.length > 0) {
            if (selectedMonth) {
                const filteredInvoices = invoices.filter(invoice => {
                    const invoiceDate = new Date(invoice.date);
                    return (
                        invoiceDate.getFullYear() === selectedYear &&
                        invoiceDate.getMonth() + 1 === selectedMonth
                    );
                });
    
                const filteredProductPurchases = productPurchases.filter(purchase => {
                    const purchaseDate = new Date(purchase.date);
                    return (
                        purchaseDate.getFullYear() === selectedYear &&
                        purchaseDate.getMonth() + 1 === selectedMonth
                    );
                });
    
                calculateProductCount(filteredProductPurchases);
                generateMonthlyChartData(filteredInvoices);
                setInvoiceCount(filteredInvoices.length);
            } else {
                const filteredInvoices = invoices.filter(invoice => {
                    const invoiceDate = new Date(invoice.date);
                    return invoiceDate.getFullYear() === selectedYear;
                });
    
                const filteredProductPurchases = productPurchases.filter(purchase => {
                    const purchaseDate = new Date(purchase.date);
                    return purchaseDate.getFullYear() === selectedYear;
                });
    
                calculateProductCount(filteredProductPurchases);
                generateYearlyChartData(filteredInvoices);
                setInvoiceCount(filteredInvoices.length);
            }
        }
    }, [invoices, selectedYear, selectedMonth]);

    useEffect(() => {
        if (invoices.length > 0) {
            // Filter invoices based on selected time range
            const filteredInvoices = invoices.filter(invoice => {
                const invoiceDate = new Date(invoice.date);
                return (
                    invoiceDate >= startDate && invoiceDate <= endDate
                );
            });
            // Calculate the total count of products bought within the selected time range
            let totalCount = 0;
            filteredInvoices.forEach(invoice => {
                // Add the number of products in each invoice to the total count
                totalCount += invoice.products.length;
            });
            // Update the state with the new count
            // setProductCount(totalCount);
        }
    }, [invoices, startDate, endDate]);

    const generateYearlyChartData = (filteredInvoices) => {
        const monthlyTotalAmounts = new Array(12).fill(0);

        filteredInvoices.forEach(invoice => {
            const invoiceDate = new Date(invoice.date);
            const month = invoiceDate.getMonth();
            monthlyTotalAmounts[month] += invoice.totalAmount;
        });

        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            datasets: [{
                label: `Total Amount Expended in ${selectedYear}`,
                data: monthlyTotalAmounts,
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            }],
        };

        setChartData(data);
    };

    const generateMonthlyChartData = (filteredInvoices) => {
        const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
        const dailyTotalAmounts = new Array(daysInMonth).fill(0);

        filteredInvoices.forEach(invoice => {
            const invoiceDate = new Date(invoice.date);
            const day = invoiceDate.getDate() - 1;
            dailyTotalAmounts[day] += invoice.totalAmount;
        });

        const data = {
            labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
            datasets: [{
                label: `Total Amount Expended in ${getMonthName(selectedMonth)}, ${selectedYear}`,
                data: dailyTotalAmounts,
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            }],
        };

        setChartData(data);
    };

    const getMonthName = (month) => {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return months[month - 1];
    };

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    if (error) {
        return <div className="alert alert-danger mt-5">{error}</div>;
    }

    return (
        <div className="container mt-5">
            <h1 className="mb-4 text-center">Home Screen</h1>

            <div className="card mb-4 shadow-sm">
                <div className="card-body">
                    <div className="form-group">
                        <label htmlFor="yearSelect"><strong>Select Year:</strong></label>
                        <select
                            id="yearSelect"
                            className="form-control"
                            value={selectedYear}
                            onChange={e => setSelectedYear(parseInt(e.target.value))}
                        >
                            {Array.from(new Set(invoices.map(invoice => new Date(invoice.date).getFullYear()))).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="monthSelect"><strong>Select Month:</strong></label>
                        <select
                            id="monthSelect"
                            className="form-control"
                            value={selectedMonth}
                            onChange={e => setSelectedMonth(parseInt(e.target.value))}
                        >
                            <option value="">All Months</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                <option key={month} value={month}>{getMonthName(month)}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className="card mb-4 shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Invoice Count</h5>
                            <p className="card-text">{invoiceCount}</p>
                        </div>
                    </div>
                </div>
                <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title">Product Count</h5>
                            <p className="card-text">{productCount}</p>
                </div>
            </div>
                <div className="col-md-6">
                    <div className="card mb-4 shadow-sm">
                        <div className="card-body">
                            {chartData && (
                                <div className="mt-4">
                                    <Line data={chartData} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;
