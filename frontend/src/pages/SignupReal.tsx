import React, { useState, useEffect } from 'react';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, authUtils, OTPResponse, VerifyResponse } from '../services/authService';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'email' | 'otp' | 'success'>('email');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResendAfter, setCanResendAfter] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutUntil, setLockoutUntil] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);
  
  const navigate = useNavigate();

  // Timer for OTP expiry
  useEffect(() => {
    if (currentStep === 'otp' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentStep, timeLeft]);

  // Timer for resend cooldown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});
    setGeneralError('');

    try {
      const response = await authAPI.sendOTP(formData.email);
      
      if (response.is_locked && response.lockout_until) {
        setIsLocked(true);
        setLockoutUntil(response.lockout_until);
        setGeneralError('Too many failed attempts. Please try again later.');
      } else if (response.can_resend_after) {
        setCanResendAfter(response.can_resend_after);
        setResendTimer(response.can_resend_after);
        setGeneralError('OTP already sent. Please wait before requesting a new one.');
      } else {
        setCurrentStep('otp');
        setTimeLeft(300);
        setResendTimer(60);
      }
    } catch (error: any) {
      setGeneralError(error.response?.data?.detail || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }

    // Check if OTP is complete
    if (newOtp.every(digit => digit !== '')) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        (prevInput as HTMLInputElement).focus();
      }
    }
  };

  const handleVerifyOTP = async (otpValue: string) => {
    setIsLoading(true);
    setErrors({});
    setOtpError('');

    try {
      const response = await authAPI.verifyOTP(formData.email, otpValue);
      
      if (response.success) {
        // Complete registration
        const authResponse = await authAPI.register(formData.email, formData.password);
        authUtils.setAuthData(authResponse.access_token, authResponse.user);
        setCurrentStep('success');
      } else {
        setOtpError(response.message);
        // Clear OTP inputs on error
        setOtp(['', '', '', '', '', '']);
      }
    } catch (error: any) {
      setOtpError(error.response?.data?.detail || 'Verification failed. Please try again.');
      setOtp(['', '', '', '', '', '']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendTimer > 0 || isLoading) return;

    setIsLoading(true);
    setErrors({});
    setGeneralError('');
    
    try {
      const response = await authAPI.sendOTP(formData.email);
      
      if (response.is_locked && response.lockout_until) {
        setIsLocked(true);
        setLockoutUntil(response.lockout_until);
        setGeneralError('Too many failed attempts. Please try again later.');
      } else {
        setTimeLeft(300);
        setResendTimer(60);
        setErrors({});
        setOtp(['', '', '', '', '', '']);
      }
    } catch (error: any) {
      setGeneralError(error.response?.data?.detail || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
      setOtp(newOtp);
      if (pastedData.length === 6) {
        handleVerifyOTP(pastedData);
      }
    }
  };

  if (currentStep === 'success') {
    return (
      <div className="signup-page">
        <div className="signup-container">
          <div className="signup-content">
            <div className="success-animation">
              <CheckCircle size={48} className="success-icon" />
            </div>
            <h1>Registration Successful!</h1>
            <p>Your account has been created and verified successfully.</p>
            <div className="action-buttons">
              <button className="signin-btn" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-content">
          <div className="signup-header">
            <div className="signup-icon">
              <UserPlus size={48} />
            </div>
            <h1>
              {currentStep === 'email' && 'Create Account'}
              {currentStep === 'otp' && 'Verify Your Email'}
            </h1>
            <p>
              {currentStep === 'email' && 'Join AITrade and start your AI-powered trading journey'}
              {currentStep === 'otp' && `Enter the verification code sent to ${formData.email}`}
            </p>
          </div>

          {currentStep === 'email' && (
            <form className="signup-form" onSubmit={handleSendOTP}>
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
                    placeholder="Create a strong password"
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

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={errors.confirmPassword ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              {generalError && (
                <div className="error-message general">{generalError}</div>
              )}

              <button type="submit" className="signup-btn" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Verification Code'}
                <ArrowRight size={20} />
              </button>
            </form>
          )}

          {currentStep === 'otp' && (
            <div className="otp-form">
              <div className="otp-timer">
                <Clock size={16} />
                <span>Code expires in {formatTime(timeLeft)}</span>
              </div>

              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className={`otp-input ${otpError ? 'error' : ''}`}
                  />
                ))}
              </div>

              {otpError && <div className="error-message">{otpError}</div>}
              {generalError && <div className="error-message general">{generalError}</div>}

              <div className="otp-footer">
                <p>Didn't receive the code?</p>
                <button 
                  className="resend-btn"
                  onClick={handleResendOTP}
                  disabled={resendTimer > 0 || isLoading}
                >
                  {isLoading ? 'Sending...' : resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                </button>
              </div>

              {isLocked && lockoutUntil && (
                <div className="lockout-message">
                  <AlertCircle size={16} />
                  <span>Account locked. Try again in {authUtils.formatLockoutTime(lockoutUntil)}</span>
                </div>
              )}
            </div>
          )}

          <div className="signup-footer">
            <p>Already have an account? <Link to="/login" className="link">Sign in</Link></p>
          </div>
        </div>

        <div className="signup-benefits">
          <h3>Why Choose AITrade?</h3>
          <div className="benefits-grid">
            <div className="benefit-item">
              <CheckCircle className="benefit-icon" />
              <div className="benefit-content">
                <h4>Secure Trading</h4>
                <p>Bank-level security for your investments</p>
              </div>
            </div>
            <div className="benefit-item">
              <UserPlus className="benefit-icon" />
              <div className="benefit-content">
                <h4>Easy Setup</h4>
                <p>Get started in minutes with our simple onboarding</p>
              </div>
            </div>
            <div className="benefit-item">
              <Lock className="benefit-icon" />
              <div className="benefit-content">
                <h4>Email Verification</h4>
                <p>Secure account verification via email</p>
              </div>
            </div>
            <div className="benefit-item">
              <Clock className="benefit-icon" />
              <div className="benefit-content">
                <h4>Real-time Data</h4>
                <p>Live market data and AI insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
