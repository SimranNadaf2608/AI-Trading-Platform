import React, { useState, useEffect } from 'react';
import { Lock, Mail, ArrowRight, CheckCircle, Shield, Clock, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/authService';


const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState<'email' | 'otp' | 'password' | 'success'>('email');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  if (!email.trim()) {
    setError('Email is required');
    return;
  }

  if (!validateEmail(email)) {
    setError('Please enter a valid email address');
    return;
  }

  setIsLoading(true);

  try {
    const res = await authAPI.sendPasswordResetOTP(email);

    localStorage.setItem('resetEmail', email);
    setCurrentStep('otp');
  } catch (err: any) {
    setError(
      err.response?.data?.detail ||
      'Failed to send verification code'
    );
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
  setError('');
  setIsLoading(true);

  try {
    await authAPI.verifyResetOTP(email, otpValue);

    // Move to password step
    setCurrentStep('password');
  } catch (err: any) {
    setError(
      err.response?.data?.detail ||
      'Invalid OTP. Please try again.'
    );
  } finally {
    setIsLoading(false);
  }
};


const handlePasswordSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  if (!newPassword) {
    setError('New password is required');
    return;
  }

  if (!validatePassword(newPassword)) {
    setError('Password must be at least 8 characters long');
    return;
  }

  if (newPassword !== confirmPassword) {
    setError('Passwords do not match');
    return;
  }

  setIsLoading(true);

  try {
    const email = localStorage.getItem('resetEmail');
    const otpValue = otp.join('');

    if (!email) {
      setError('Session expired. Please start again.');
      return;
    }

    await authAPI.resetPassword(email, otpValue, newPassword);

    // success
    setCurrentStep('success');
    localStorage.removeItem('resetEmail');
  } catch (err: any) {
    setError(
      err.response?.data?.detail ||
      'Password reset failed'
    );
  } finally {
    setIsLoading(false);
  }
};


  const handleBackToSignin = () => {
    navigate('/login');
  };

  const handleResendOtp = async () => {
  try {
    setIsLoading(true);

    const email = localStorage.getItem('resetEmail');
    if (!email) {
      setError('Session expired. Please start again.');
      return;
    }

    await authAPI.sendPasswordResetOTP(email);
    setOtp(['', '', '', '', '', '']);
    setError('');
  } catch (err: any) {
    setError(
      err.response?.data?.detail ||
      'Failed to resend OTP'
    );
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

  if (currentStep === 'success') {
    return (
      <div className="forgot-password-page">
        <div className="forgot-password-container">
          <div className="forgot-password-content">
            <div className="success-animation">
              <div className="success-icon-wrapper">
                <CheckCircle size={48} className="success-icon" />
              </div>
            </div>
            <h1>Password Reset Successful!</h1>
            <p>Your password has been successfully updated.</p>
            <p className="instruction-text">
              You can now use your new password to sign in to your account.
            </p>
            
            <div className="next-steps">
              <h3>What's next?</h3>
              <div className="steps-list">
                <div className="step-item">
                  <Lock className="step-icon" />
                  <span>Use your new password to sign in</span>
                </div>
                <div className="step-item">
                  <Shield className="step-icon" />
                  <span>Your account is now secure</span>
                </div>
                <div className="step-item">
                  <CheckCircle className="step-icon" />
                  <span>All sessions have been logged out</span>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="signin-btn" onClick={handleBackToSignin}>
                Sign In Now
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-content">
          <div className="forgot-password-header">
            <button className="back-btn" onClick={handleBackToSignin}>
              <ArrowLeft size={20} />
              Back to Sign In
            </button>
            
            <div className="forgot-password-icon">
              <Lock size={48} />
            </div>
            <h1>
              {currentStep === 'email' && 'Reset Your Password'}
              {currentStep === 'otp' && 'Enter Verification Code'}
              {currentStep === 'password' && 'Create New Password'}
            </h1>
            <p>
              {currentStep === 'email' && 'Enter your email address to receive a verification code'}
              {currentStep === 'otp' && `We've sent a 6-digit code to ${email}`}
              {currentStep === 'password' && 'Enter your new password below'}
            </p>
          </div>

          {currentStep === 'email' && (
            <form className="forgot-password-form" onSubmit={handleEmailSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className={error ? 'error' : ''}
                  />
                </div>
                {error && <span className="error-message">{error}</span>}
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Verification Code'}
                <ArrowRight size={20} />
              </button>
            </form>
          )}

          {currentStep === 'otp' && (
            <div className="otp-form">
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
                    className={`otp-input ${error ? 'error' : ''}`}
                  />
                ))}
              </div>

              {error && <div className="error-message">{error}</div>}

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
            </div>
          )}

          {currentStep === 'password' && (
            <form className="forgot-password-form" onSubmit={handlePasswordSubmit}>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className={error ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className={error ? 'error' : ''}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {error && <span className="error-message">{error}</span>}
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
                <ArrowRight size={20} />
              </button>
            </form>
          )}

          <div className="security-info">
            <div className="security-item">
              <Shield size={20} />
              <div className="security-text">
                <h4>Secure & Private</h4>
                <p>Your information is encrypted and protected</p>
              </div>
            </div>
            <div className="security-item">
              <Clock size={20} />
              <div className="security-text">
                <h4>Quick Expiry</h4>
                <p>Verification codes expire in 15 minutes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="forgot-password-benefits">
          <h3>Password Security Tips</h3>
          <div className="benefits-grid">
            <div className="benefit-item">
              <Lock className="benefit-icon" />
              <div className="benefit-content">
                <h4>Strong Password</h4>
                <p>Use 8+ characters with mix of letters, numbers, and symbols</p>
              </div>
            </div>
            <div className="benefit-item">
              <Shield className="benefit-icon" />
              <div className="benefit-content">
                <h4>Unique Password</h4>
                <p>Don't reuse passwords across different accounts</p>
              </div>
            </div>
            <div className="benefit-item">
              <CheckCircle className="benefit-icon" />
              <div className="benefit-content">
                <h4>Regular Updates</h4>
                <p>Change your password every 3-6 months</p>
              </div>
            </div>
            <div className="benefit-item">
              <Mail className="benefit-icon" />
              <div className="benefit-content">
                <h4>Verify Requests</h4>
                <p>Only enter codes from trusted sources</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
