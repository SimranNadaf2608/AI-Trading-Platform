import React from 'react';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, ArrowUp } from 'lucide-react';
import Logo from './Logo';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-brand">
              <Logo size={40} />
              <p>AI-Powered Trading Platform</p>
            </div>
            <p className="footer-description">
              Empowering traders worldwide with cutting-edge AI technology and comprehensive trading solutions. 
              Join 19,000+ active traders who trust our platform for smarter, faster, and more profitable trading.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-link" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="/">Dashboard</a></li>
              <li><a href="/trading">Trading</a></li>
              <li><a href="/portfolio">Portfolio</a></li>
              <li><a href="/analytics">Analytics</a></li>
              <li><a href="/settings">Settings</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-section">
            <h4>Resources</h4>
            <ul className="footer-links">
              <li><a href="#">Trading Guides</a></li>
              <li><a href="#">Video Tutorials</a></li>
              <li><a href="#">API Documentation</a></li>
              <li><a href="#">Community Forum</a></li>
              <li><a href="#">Market Insights</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <div className="contact-item">
                <Mail size={16} />
                <span>support@aitrade.com</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>123 Trading Street, Mumbai, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <h4>Stay Updated</h4>
            <p>Get the latest trading insights and platform updates delivered to your inbox</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" className="newsletter-input" />
              <button className="newsletter-btn">Subscribe</button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>&copy; 2024 AITrade. All rights reserved.</p>
            </div>
            <div className="footer-bottom-links">
              <a href="#">Terms of Service</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Cookie Policy</a>
              <a href="#">Disclaimer</a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button className="back-to-top" onClick={scrollToTop} aria-label="Back to top">
        <ArrowUp size={20} />
      </button>
    </footer>
  );
};

export default Footer;
