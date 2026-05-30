import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFileInvoice, FaUsers, FaMoneyBillWave, FaArrowRight } from 'react-icons/fa';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const token = localStorage.getItem('token');

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalCustomers: 0,
    totalPayments: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [invoicesData, setInvoicesData] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);

  const COLORS = ['#384959', '#6A89A7', '#88BDF2', '#BDDDFC', '#6D8196', '#4ECDC4', '#FF6B6B', '#A855F7'];

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch invoices count
      const invoicesResponse = await fetch(`${BASE_URL}/api/invoicequote/allInvoicesQuotes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!invoicesResponse.ok) {
        throw new Error('Failed to fetch invoices');
      }
      
      const invoicesData = await invoicesResponse.json();
      
      // Fetch customers count with error handling
      let customersData = { data: [] };
      try {
        const customersResponse = await fetch(`${BASE_URL}/api/customer/allCustomers`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (customersResponse.ok) {
          customersData = await customersResponse.json();
        } else {
          console.warn('Failed to fetch customers, using 0 as default');
        }
      } catch (customerError) {
        console.warn('Error fetching customers, using 0 as default:', customerError);
      }

      // Calculate stats
      const totalRevenue = invoicesData.data?.reduce((sum, invoice) => sum + (invoice.orderTotal || 0), 0) || 0;
      const totalPaymentsCount = invoicesData.data?.reduce((sum, invoice) => sum + (invoice.payments?.length || 0), 0) || 0;

      setStats({
        totalInvoices: invoicesData.data?.length || 0,
        totalCustomers: customersData.data?.length || 0,
        totalPayments: totalPaymentsCount,
        totalRevenue: totalRevenue
      });

      setInvoicesData(invoicesData.data || []);

      // Prepare chart data
      prepareChartData(invoicesData.data || []);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Set default values on error
      setStats({
        totalInvoices: 0,
        totalCustomers: 0,
        totalPayments: 0,
        totalRevenue: 0
      });
      setChartData([]);
      setPieData([]);
      setLineData([]);
      setLoading(false);
    }
  };

  const prepareChartData = (invoices) => {
    // Bar chart data: Revenue by month
    const monthlyRevenue = {};
    const monthlyCount = {};
    
    invoices.forEach(invoice => {
      const date = new Date(invoice.dateOrdered);
      const monthKey = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      if (!monthlyRevenue[monthKey]) {
        monthlyRevenue[monthKey] = 0;
        monthlyCount[monthKey] = 0;
      }
      monthlyRevenue[monthKey] += invoice.orderTotal || 0;
      monthlyCount[monthKey] += 1;
    });

    const barChartData = Object.keys(monthlyRevenue).map(month => ({
      month,
      revenue: monthlyRevenue[month],
      count: monthlyCount[month]
    })).sort((a, b) => new Date(a.month) - new Date(b.month));

    setChartData(barChartData);

    // Pie chart data: Invoice types
    const typeCounts = { Invoice: 0, Quote: 0 };
    invoices.forEach(invoice => {
      const type = invoice.type || 'Invoice';
      if (typeCounts[type] !== undefined) {
        typeCounts[type]++;
      } else {
        typeCounts.Invoice++;
      }
    });

    const pieChartData = Object.keys(typeCounts).map(type => ({
      name: type,
      value: typeCounts[type]
    }));

    setPieData(pieChartData);

    // Line chart data: Revenue trend over time
    const sortedInvoices = [...invoices].sort((a, b) => new Date(a.dateOrdered) - new Date(b.dateOrdered));
    let cumulativeRevenue = 0;
    const lineChartData = sortedInvoices.map(invoice => {
      cumulativeRevenue += invoice.orderTotal || 0;
      return {
        date: new Date(invoice.dateOrdered).toLocaleDateString(),
        revenue: invoice.orderTotal || 0,
        cumulative: cumulativeRevenue
      };
    });

    setLineData(lineChartData);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#384959]">Dashboard</h1>
        <p className="mt-2 text-[#6D8196]">Welcome back! Here's an overview of your business.</p>
      </div>

      {loading ? (
        <div className="rounded-xl bg-[#BDDDFC] px-6 py-4 text-center text-[#384959]">
          Loading dashboard...
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border-2 border-[#6D8196] bg-gradient-to-br from-[#F8FAFC] to-[#BDDDFC] p-6 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#384959]">Total Invoices</p>
                  <p className="mt-2 text-3xl font-bold text-[#384959]">{stats.totalInvoices}</p>
                </div>
                <FaFileInvoice className="text-4xl text-[#6A89A7]" />
              </div>
            </div>

            <div className="rounded-2xl border-2 border-[#6D8196] bg-gradient-to-br from-[#F8FAFC] to-[#BDDDFC] p-6 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#384959]">Total Customers</p>
                  <p className="mt-2 text-3xl font-bold text-[#384959]">{stats.totalCustomers}</p>
                </div>
                <FaUsers className="text-4xl text-[#88BDF2]" />
              </div>
            </div>

            <div className="rounded-2xl border-2 border-[#6D8196] bg-gradient-to-br from-[#F8FAFC] to-[#BDDDFC] p-6 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#384959]">Total Payments</p>
                  <p className="mt-2 text-3xl font-bold text-[#384959]">{stats.totalPayments}</p>
                </div>
                <FaMoneyBillWave className="text-4xl text-[#FF6B6B]" />
              </div>
            </div>

            <div className="rounded-2xl border-2 border-[#6D8196] bg-gradient-to-br from-[#F8FAFC] to-[#BDDDFC] p-6 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#384959]">Total Revenue</p>
                  <p className="mt-2 text-3xl font-bold text-[#384959]">${stats.totalRevenue.toFixed(2)}</p>
                </div>
                <FaMoneyBillWave className="text-4xl text-[#4ECDC4]" />
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Bar Chart - Monthly Revenue */}
            <div className="rounded-2xl border-2 border-[#6D8196] bg-[#F8FAFC] p-6 shadow-lg">
              <h3 className="mb-4 text-xl font-bold text-[#384959]">Monthly Revenue</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#6D8196" />
                  <XAxis dataKey="month" stroke="#6D8196" />
                  <YAxis stroke="#6D8196" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#384959', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="revenue" fill="url(#revenueGradient)" name="Revenue ($)" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="count" fill="url(#countGradient)" name="Invoice Count" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6A89A7" />
                      <stop offset="95%" stopColor="#4ECDC4" />
                    </linearGradient>
                    <linearGradient id="countGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#88BDF2" />
                      <stop offset="95%" stopColor="#A855F7" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart - Invoice Types */}
            <div className="rounded-2xl border-2 border-[#6D8196] bg-[#F8FAFC] p-6 shadow-lg">
              <h3 className="mb-4 text-xl font-bold text-[#384959]">Invoice Types</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#6A89A7', '#4ECDC4', '#FF6B6B', '#A855F7', '#88BDF2'][index % 5]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#384959', 
                      border: 'none', 
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart - Revenue Trend */}
          <div className="rounded-2xl border-2 border-[#6D8196] bg-[#F8FAFC] p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-bold text-[#384959]">Revenue Trend Over Time</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#6D8196" />
                <XAxis dataKey="date" stroke="#6D8196" />
                <YAxis stroke="#6D8196" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#384959', 
                    border: 'none', 
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <defs>
                  <linearGradient id="lineGradient1" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#6A89A7" />
                    <stop offset="100%" stopColor="#4ECDC4" />
                  </linearGradient>
                  <linearGradient id="lineGradient2" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#88BDF2" />
                    <stop offset="100%" stopColor="#A855F7" />
                  </linearGradient>
                </defs>
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="url(#lineGradient1)"
                  strokeWidth={3}
                  name="Revenue ($)"
                  dot={{ fill: '#4ECDC4', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8, fill: '#4ECDC4' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="cumulative" 
                  stroke="url(#lineGradient2)"
                  strokeWidth={3}
                  name="Cumulative Revenue ($)"
                  dot={{ fill: '#A855F7', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 8, fill: '#A855F7' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl border-2 border-[#6D8196] bg-[#F8FAFC] p-6 lg:p-8 shadow-lg">
            <h2 className="mb-6 text-2xl font-bold text-[#384959]">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                to="/"
                className="group flex items-center justify-between rounded-xl border-2 border-[#6D8196] bg-white p-4 transition-all duration-200 hover:border-[#6A89A7] hover:bg-[#BDDDFC]"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#6A89A7]/10 p-2">
                    <FaFileInvoice className="text-xl text-[#6A89A7]" />
                  </div>
                  <span className="font-semibold text-[#384959]">Create Invoice</span>
                </div>
                <FaArrowRight className="text-[#6D8196] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#6A89A7]" />
              </Link>

              <Link
                to="/customer"
                className="group flex items-center justify-between rounded-xl border-2 border-[#6D8196] bg-white p-4 transition-all duration-200 hover:border-[#88BDF2] hover:bg-[#BDDDFC]"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#88BDF2]/10 p-2">
                    <FaUsers className="text-xl text-[#88BDF2]" />
                  </div>
                  <span className="font-semibold text-[#384959]">Manage Customers</span>
                </div>
                <FaArrowRight className="text-[#6D8196] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#88BDF2]" />
              </Link>

              <Link
                to="/InvoiceQuotesListPage"
                className="group flex items-center justify-between rounded-xl border-2 border-[#6D8196] bg-white p-4 transition-all duration-200 hover:border-[#BDDDFC] hover:bg-[#BDDDFC]"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#BDDDFC]/10 p-2">
                    <FaFileInvoice className="text-xl text-[#6D8196]" />
                  </div>
                  <span className="font-semibold text-[#384959]">View Invoices</span>
                </div>
                <FaArrowRight className="text-[#6D8196] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#6D8196]" />
              </Link>

              <Link
                to="/paymentslistpage"
                className="group flex items-center justify-between rounded-xl border-2 border-[#6D8196] bg-white p-4 transition-all duration-200 hover:border-[#6A89A7] hover:bg-[#BDDDFC]"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#6A89A7]/10 p-2">
                    <FaMoneyBillWave className="text-xl text-[#6A89A7]" />
                  </div>
                  <span className="font-semibold text-[#384959]">View Payments</span>
                </div>
                <FaArrowRight className="text-[#6D8196] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#6A89A7]" />
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
