import React, { useState } from 'react';
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Signin: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Signin data:', formData);
      // Handle signin logic here
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <div className="signin-content">
          <div className="signin-header">
            <div className="signin-icon">
              <LogIn size={48} />
            </div>
            <h1>Welcome Back</h1>
            <p>Sign in to your AITrade account to continue trading</p>
          </div>

          <form className="signin-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={errors.email ? 'error' : ''}
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={errors.password ? 'error' : ''}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span className="checkbox-custom">
                  <div className="checkmark"></div>
                </span>
                Remember me
              </label>
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="signin-btn">
              Sign In
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="signin-footer">
            <p>Don't have an account? <Link to="/signup" className="link">Sign up</Link></p>
          </div>

          <div className="divider">
            <span>Or continue with</span>
          </div>

          <div className="social-signin">
            <button className="social-btn google">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="social-btn microsoft">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="2" width="9" height="9" fill="#F25022"/>
                <rect x="13" y="2" width="9" height="9" fill="#7FBA00"/>
                <rect x="2" y="13" width="9" height="9" fill="#00A4EF"/>
                <rect x="13" y="13" width="9" height="9" fill="#FFB900"/>
              </svg>
              Microsoft
            </button>
          </div>
        </div>

        <div className="signin-benefits">
          <h3>Sign In Benefits</h3>
          <div className="benefits-grid">
            <div className="benefit-item">
              <User className="benefit-icon" />
              <div className="benefit-content">
                <h4>Access Your Dashboard</h4>
                <p>View your portfolio and trading performance</p>
              </div>
            </div>
            <div className="benefit-item">
              <LogIn className="benefit-icon" />
              <div className="benefit-content">
                <h4>Continue Trading</h4>
                <p>Pick up where you left off</p>
              </div>
            </div>
            <div className="benefit-item">
              <Lock className="benefit-icon" />
              <div className="benefit-content">
                <h4>Secure Access</h4>
                <p>Bank-level security for your account</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
