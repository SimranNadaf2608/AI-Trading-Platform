import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TrendingUp, Info, Briefcase, Settings, FileText, UserPlus, LogOut } from 'lucide-react';
import Logo from './Logo';
import { authUtils } from '../services/authService';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = authUtils.isAuthenticated();

  const handleLogout = () => {
    authUtils.clearAuthData();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: TrendingUp },
    { path: '/about', label: 'About Us', icon: Info },
    { path: '/features', label: 'Features', icon: Briefcase },
    { path: '/blogs', label: 'Blogs', icon: FileText },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Logo size={32} />
      </div>

      <div className="navbar-nav">
        {navItems.map(({ path, label, icon: Icon }) => (
          <Link
            key={path}
            to={path}
            className={`nav-link ${location.pathname === path ? 'active' : ''}`}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        ))}

        {/* Auth Button */}
        {!isLoggedIn ? (
          <Link
            to="/signup"
            className={`nav-link ${location.pathname === '/signup' ? 'active' : ''}`}
          >
            <UserPlus size={20} />
            <span>Signup</span>
          </Link>
        ) : (
          <button className="nav-link logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
