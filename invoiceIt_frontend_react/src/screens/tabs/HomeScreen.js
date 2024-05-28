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

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const response = await axios.get(`/invoices/users/${currentUser?.email}`);
                setInvoices(response.data);
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
                generateMonthlyChartData(filteredInvoices);
            } else {
                const filteredInvoices = invoices.filter(invoice => {
                    const invoiceDate = new Date(invoice.date);
                    return invoiceDate.getFullYear() === selectedYear;
                });
                generateYearlyChartData(filteredInvoices);
            }
        }
    }, [invoices, selectedYear, selectedMonth]);

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
    );
};

export default HomeScreen;
