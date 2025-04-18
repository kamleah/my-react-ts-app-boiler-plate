import React from 'react';

interface SubHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const SubHeader: React.FC<SubHeaderProps> = ({ children, className = '' }) => {
  return (
    <h3 className={`text-xl font-semibold text-gray-800 mb-2 ${className}`}>
      {children}
    </h3>
  );
};

export default SubHeader;
