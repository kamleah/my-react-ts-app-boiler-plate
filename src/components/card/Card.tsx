import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', containerClassName = '' }) => {
  return (
    <div className={`bg-gray-100 flex justify-center p-4 ${containerClassName}`}>
      <div className={`w-full max-w-5xl mx-auto p-6 bg-white rounded-2xl shadow-md space-y-6 ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
