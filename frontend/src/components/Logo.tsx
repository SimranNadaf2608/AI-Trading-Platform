import React from 'react';
import { TrendingUp } from 'lucide-react';

const Logo: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = "" }) => {
  return (
    <div className={`logo ${className}`} style={{ fontSize: size }}>
      <div className="logo-icon">
        <TrendingUp size={size * 0.8} />
      </div>
      <span className="logo-text">AITrade</span>
    </div>
  );
};

export default Logo;
