import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, Eye, EyeOff, CheckCircle, Clock, ArrowLeft, AlertCircle } from 'lucide-react';
import { authAPI, authUtils } from '../services/authService';

const SignupReal: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState<'email' | 'otp' | 'success'>('email');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [resendTimer, setResendTimer] = useState(0);
  const [canResendAfter, setCanResendAfter] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutUntil, setLockoutUntil] = useState<string | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [generalError, setGeneralError] = useState<string>('');
  const [otpError, setOtpError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
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

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');

    if (!formData.firstName.trim()) {
      setErrors({ firstName: 'First name is required' });
      return;
    }

    if (!formData.lastName.trim()) {
      setErrors({ lastName: 'Last name is required' });
      return;
    }

    if (!formData.email.trim()) {
      setErrors({ email: 'Email is required' });
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    if (!formData.password) {
      setErrors({ password: 'Password is required' });
      return;
    }

    if (!validatePassword(formData.password)) {
      setErrors({ password: 'Password must be at least 8 characters long' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.sendOTP({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword
      });
      
      // Save email to localStorage for OTP page
      localStorage.setItem('signupEmail', formData.email);
      
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
      verifyOtp(newOtp.join(''));
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

  const verifyOtp = async (otpValue: string) => {
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

  const handleResendOtp = async () => {
    if (resendTimer > 0 || isLoading) return;

    setIsLoading(true);
    setErrors({});
    setGeneralError('');
    
    try {
      const response = await authAPI.sendOTP({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword
      });
      
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
        verifyOtp(pastedData);
      }
    }
  };

  const handleBackToSignin = () => {
    navigate('/login');
  };

  if (currentStep === 'success') {
    return (
      <div className="signup-page">
        <div className="signup-container">
          <div className="signup-content">
            <div className="success-animation">
              <div className="success-icon-wrapper">
                <CheckCircle size={48} className="success-icon" />
              </div>
            </div>
            <h1>Account Created Successfully!</h1>
            <p>Welcome to AITrade Platform</p>
            <p className="instruction-text">
              Your account has been created and verified. You can now start trading with AI-powered insights.
            </p>
            
            <div className="next-steps">
              <h3>What's next?</h3>
              <div className="steps-list">
                <div className="step-item">
                  <UserPlus className="step-icon" />
                  <span>Complete your profile</span>
                </div>
                <div className="step-item">
                  <Lock className="step-icon" />
                  <span>Set up 2FA authentication</span>
                </div>
                <div className="step-item">
                  <CheckCircle className="step-icon" />
                  <span>Make your first trade</span>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="dashboard-btn" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
                <ArrowLeft size={20} className="rotate-180" />
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
              {currentStep === 'email' && 'Create your account to get started'}
              {currentStep === 'otp' && `We've sent a 6-digit code to ${formData.email}`}
            </p>
          </div>

          <div className="otp-back-section">
            <button className="back-to-signup-btn" onClick={() => navigate('/signup')}>
              <ArrowLeft size={16} />
              Back to Sign Up
            </button>
          </div>

          {currentStep === 'email' && (
            <form className="signup-form" onSubmit={handleEmailSubmit}>
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <div className="input-wrapper">
                  <UserPlus className="input-icon" />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    className={errors.firstName ? 'error' : ''}
                  />
                </div>
                {errors.firstName && <span className="error-message">{errors.firstName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <div className="input-wrapper">
                  <UserPlus className="input-icon" />
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    className={errors.lastName ? 'error' : ''}
                  />
                </div>
                {errors.lastName && <span className="error-message">{errors.lastName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
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

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
                <ArrowLeft size={20} className="rotate-180" />
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
                  onClick={handleResendOtp}
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Resend Code'}
                </button>
              </div>

              {isLocked && lockoutUntil && (
                <div className="lockout-message">
                  <AlertCircle size={16} />
                  <span>Account locked. Try again in {lockoutUntil ? authUtils.formatLockoutTime(lockoutUntil) : ''}</span>
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

export default SignupReal;
