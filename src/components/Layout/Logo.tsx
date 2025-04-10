
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', withText = true }) => {
  // Determine size class based on prop
  const sizeClass = {
    small: 'h-7',
    medium: 'h-9',
    large: 'h-12'
  }[size];
  
  return (
    <Link to="/" className="flex items-center">
      <img 
        src="/lovable-uploads/eadfa6b1-267d-4782-914f-c0c339dba27d.png" 
        alt="Ma7alkom Logo" 
        className={`${sizeClass} object-contain`} 
      />
      
      {withText && (
        <span className="ml-2 font-semibold text-xl">Ma7alkom</span>
      )}
    </Link>
  );
};

export default Logo;
