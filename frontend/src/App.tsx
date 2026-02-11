import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Features from './pages/Features';
import Blogs from './pages/Blogs';
import SignupReal from './pages/SignupReal';
import SigninReal from './pages/SigninReal';
import OtpVerification from './pages/OtpVerification';
import ForgotPassword from './pages/ForgotPassword';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/signup" element={<SignupReal />} />
            <Route path="/login" element={<SigninReal />} />
            <Route path="/verify-otp" element={<OtpVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
