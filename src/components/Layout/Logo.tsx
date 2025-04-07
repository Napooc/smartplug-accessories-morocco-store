
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', withText = true }) => {
  // Determine size class based on prop
  const sizeClass = {
    small: 'h-7 w-7',
    medium: 'h-9 w-9',
    large: 'h-12 w-12'
  }[size];
  
  return (
    <Link to="/" className="flex items-center">
      <div className={`relative ${sizeClass}`}>
        <div className="absolute inset-0 bg-smartplug-blue rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-1/2 w-1/2 bg-white rounded-sm transform rotate-45"></div>
        </div>
      </div>
      
      {withText && (
        <span className="ml-2 font-semibold text-xl">SmartPlug</span>
      )}
    </Link>
  );
};

export default Logo;
