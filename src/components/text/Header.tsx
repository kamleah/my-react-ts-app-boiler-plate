import React from 'react';

interface HeaderProps {
  children: React.ReactNode;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className = '' }) => {
  return (
    <h2 className={`text-2xl font-bold text-gray-800 mb-4 ${className}`}>
      {children}
    </h2>
  );
};

export default Header;
