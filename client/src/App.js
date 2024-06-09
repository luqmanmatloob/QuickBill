import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Setting from './pages/Settings'; 

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/setting" element={<Setting />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
