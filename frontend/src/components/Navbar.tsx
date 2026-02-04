import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { TrendingUp, Info, Briefcase, Settings, FileText, UserPlus } from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: TrendingUp },
    { path: '/about', label: 'About Us', icon: Info },
    { path: '/features', label: 'Features', icon: Briefcase },
    { path: '/blogs', label: 'Blogs', icon: FileText },
    { path: '/signup', label: 'Signup', icon: UserPlus },
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
      </div>
    </nav>
  );
};

export default Navbar;
