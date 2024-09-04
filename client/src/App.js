import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import UploadPage from './pages/Upload';
import Setting from './pages/Settings';
import Edit from './pages/Edit';
import PrintPage from './pages/PrintPage';
import InvoiceQuotesListPage from './pages/InvoiceQuotesListPage';
import TestPage from './pages/TestPage';
import CustomerPage from './pages/CustomerPage';
import PaymentsListPage from './pages/PaymentsListPage';
import UploadPaymentsPage from './pages/UploadPaymentsPage';
import AccountSettings from './pages/AccountSettings';
import Login from './pages/Login'; // Import your login page
import ProtectedRoute from './components/PrivateRoute'; // Adjust the import path as needed

const App = () => {
  return (
    <Router>
      <Header />
      <Sidebar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/uploadPage" element={<ProtectedRoute element={<UploadPage />} />} />
        <Route path="/edit/:id" element={<ProtectedRoute element={<Edit />} />} />
        <Route path="/print/:id" element={<ProtectedRoute element={<PrintPage />} />} />
        <Route path="/setting" element={<ProtectedRoute element={<Setting />} />} />
        <Route path="/InvoiceQuotesListPage" element={<ProtectedRoute element={<InvoiceQuotesListPage />} />} />
        <Route path="/test" element={<ProtectedRoute element={<TestPage />} />} />
        <Route path="/customer" element={<ProtectedRoute element={<CustomerPage />} />} />
        <Route path="/paymentslistpage" element={<ProtectedRoute element={<PaymentsListPage />} />} />
        <Route path="/uploadpaymentspage" element={<ProtectedRoute element={<UploadPaymentsPage />} />} />
        <Route path="/accountsettings" element={<ProtectedRoute element={<AccountSettings />} />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
