import React from 'react';

interface CaptionProps {
  children: React.ReactNode;
  className?: string;
}

const Caption: React.FC<CaptionProps> = ({ children, className = '' }) => {
  return (
    <span className={`text-sm text-gray-500 ${className}`}>
      {children}
    </span>
  );
};

export default Caption;
