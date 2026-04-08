import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import PlatformDashboard from './pages/PlatformDashboard';
import About from './pages/About';
import Features from './pages/Features';
import Blogs from './pages/Blogs';
import SignupReal from './pages/SignupReal';
import SigninReal from './pages/SigninReal';
import OtpVerification from './pages/OtpVerification';
import Products from './pages/Products';
import ForgotPassword from './pages/ForgotPassword';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className={isDashboard ? "" : "App"}>
      {!isDashboard && <Navbar />}
      <main className={isDashboard ? "" : "main-content"}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<PlatformDashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/products" element={<Products />} />
          <Route path="/signup" element={<SignupReal />} />
          <Route path="/login" element={<SigninReal />} />
          <Route path="/verify-otp" element={<OtpVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
