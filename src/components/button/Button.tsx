import React from 'react';

interface ButtonProps {
  text?: string; // Made optional to support icon-only buttons
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  color?: 'indigo' | 'red' | 'green' | 'blue' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode; // Added to support icons or custom content
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  type = 'button',
  color = 'indigo',
  size = 'md',
  disabled = false,
  className = '',
  children,
}) => {
  const baseStyles = 'relative text-white font-semibold rounded-full shadow-md focus:outline-none transform transition-all duration-200 ease-in-out';
  const colorStyles = {
    indigo: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-300',
    red: 'bg-red-600 hover:bg-red-700 focus:ring-red-300',
    green: 'bg-green-600 hover:bg-green-700 focus:ring-green-300',
    blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300',
    gray: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-300',
  };
  const sizeStyles = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2 text-base',
    lg: 'px-8 py-3 text-lg',
  };
  const disabledStyles = disabled
    ? 'opacity-50 cursor-not-allowed hover:scale-100'
    : 'hover:scale-105 focus:ring-4 focus:ring-opacity-50';
  const buttonClasses = `${baseStyles} ${colorStyles[color]} ${sizeStyles[size]} ${disabledStyles} ${className}`;
  const overlayColor = {
    indigo: 'bg-indigo-800',
    red: 'bg-red-800',
    green: 'bg-green-800',
    blue: 'bg-blue-800',
    gray: 'bg-gray-800',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClasses}
      disabled={disabled}
    >
      <span className="relative z-10 flex items-center justify-center">
        {children || text}
      </span>
      <span
        className={`absolute inset-0 ${overlayColor[color]} rounded-full opacity-0 hover:opacity-20 transition-opacity duration-200`}
      />
    </button>
  );
};

export default Button;