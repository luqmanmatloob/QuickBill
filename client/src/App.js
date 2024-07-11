import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import UploadPage from './pages/Upload';
import Setting from './pages/Settings'; 
import Edit from './pages/Edit'
import PrintPage from './pages/PrintPage'
import InvoiceQuotesListPage from './pages/InvoiceQuotesListPage'


const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/uploadPage" element={<UploadPage />} />
          <Route path="/edit/:id" element={<Edit />} /> 
          <Route path="/print/:id" element={<PrintPage />} /> 
          <Route path="/setting" element={<Setting />} />
          <Route path="/InvoiceQuotesListPage" element={<InvoiceQuotesListPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
