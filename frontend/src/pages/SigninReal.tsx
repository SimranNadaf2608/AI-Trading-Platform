import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, authUtils } from '../services/authService';

const SigninReal: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setGeneralError('');

    try {
      const response = await authAPI.login(formData.email, formData.password);
      
      // Store auth data
      authUtils.setAuthData(response.access_token, response.user);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      if (error.response?.status === 401) {
        const detail = error.response?.data?.detail;
        if (detail.includes('verify')) {
          setGeneralError('Please verify your email first. Check your inbox for verification code.');
        } else {
          setGeneralError('Invalid email or password');
        }
      } else {
        setGeneralError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <div className="signin-content">
          <div className="signin-header">
            <div className="signin-icon">
              <User size={48} />
            </div>
            <h1>Welcome Back</h1>
            <p>Sign in to your AITrade account</p>
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

            {generalError && (
              <div className="error-message general">
                <AlertCircle size={16} />
                {generalError}
              </div>
            )}

            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <Link to="/forgot-password" className="forgot-password-link">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="signin-btn" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="divider">
            <span>or</span>
          </div>

          <div className="social-signin">
            <button className="social-btn">
              <Mail size={20} />
              Continue with Email
            </button>
            <button className="social-btn">
              <User size={20} />
              Continue with Google
            </button>
          </div>

          <div className="signin-footer">
            <p>Don't have an account? <Link to="/signup" className="link">Sign up</Link></p>
          </div>
        </div>

        <div className="signin-benefits">
          <h3>Why Sign In to AITrade?</h3>
          <div className="benefits-list">
            <div className="benefit-item">
              <Lock className="benefit-icon" />
              <div className="benefit-content">
                <h4>Secure Access</h4>
                <p>Your data is protected with industry-standard encryption</p>
              </div>
            </div>
            <div className="benefit-item">
              <User className="benefit-icon" />
              <div className="benefit-content">
                <h4>Personalized Experience</h4>
                <p>Get AI-powered insights tailored to your trading style</p>
              </div>
            </div>
            <div className="benefit-item">
              <ArrowRight className="benefit-icon" />
              <div className="benefit-content">
                <h4>Real-time Trading</h4>
                <p>Access live market data and execute trades instantly</p>
              </div>
            </div>
            <div className="benefit-item">
              <Mail className="benefit-icon" />
              <div className="benefit-content">
                <h4>Email Support</h4>
                <p>Get help whenever you need it from our support team</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninReal;
