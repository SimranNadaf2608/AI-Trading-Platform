import React, { useState, useEffect } from 'react';
import { Mail, ArrowRight, CheckCircle, Clock, Shield, Smartphone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const OtpVerification: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

  const verifyOtp = (otpValue: string) => {
    // Simulate OTP verification
    if (otpValue === '123456') {
      setIsVerified(true);
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      setError('Invalid OTP. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    // Simulate resend OTP
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTimeLeft(120);
    setIsResending(false);
    setError('');
    setOtp(['', '', '', '', '', '']);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  if (isVerified) {
    return (
      <div className="otp-page">
        <div className="otp-container">
          <div className="otp-content">
            <div className="success-animation">
              <CheckCircle size={80} className="success-icon" />
            </div>
            <h1>Email Verified!</h1>
            <p>Your account has been successfully created and verified.</p>
            <p>Redirecting to your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="otp-page">
      <div className="otp-container">
        <div className="otp-content">
          <div className="otp-header">
            <div className="otp-icon">
              <Mail size={48} />
            </div>
            <h1>Verify Your Email</h1>
            <p>We've sent a 6-digit verification code to your email address</p>
            <p className="email-display">user@example.com</p>
          </div>

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

            <div className="otp-timer">
              <Clock size={16} />
              <span>Code expires in {formatTime(timeLeft)}</span>
            </div>

            <button 
              className="verify-btn"
              onClick={() => verifyOtp(otp.join(''))}
              disabled={otp.some(digit => digit === '')}
            >
              Verify Email
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="otp-footer">
            <p>Didn't receive the code?</p>
            <button 
              className="resend-btn"
              onClick={handleResend}
              disabled={timeLeft > 0 || isResending}
            >
              {isResending ? 'Sending...' : timeLeft > 0 ? `Resend in ${formatTime(timeLeft)}` : 'Resend Code'}
            </button>
          </div>

          <div className="otp-security">
            <div className="security-item">
              <Shield size={20} />
              <span>Secure encryption</span>
            </div>
            <div className="security-item">
              <Smartphone size={20} />
              <span>Code valid for 2 minutes</span>
            </div>
          </div>
        </div>

        <div className="otp-benefits">
          <h3>Why Verify Your Email?</h3>
          <div className="benefits-grid">
            <div className="benefit-item">
              <Shield className="benefit-icon" />
              <div className="benefit-content">
                <h4>Account Security</h4>
                <p>Protect your account from unauthorized access</p>
              </div>
            </div>
            <div className="benefit-item">
              <Mail className="benefit-icon" />
              <div className="benefit-content">
                <h4>Important Updates</h4>
                <p>Receive trading alerts and account notifications</p>
              </div>
            </div>
            <div className="benefit-item">
              <CheckCircle className="benefit-icon" />
              <div className="benefit-content">
                <h4>Full Access</h4>
                <p>Unlock all trading features and tools</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
