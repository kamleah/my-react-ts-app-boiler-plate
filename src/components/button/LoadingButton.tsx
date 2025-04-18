import React from 'react';
import LoadingSpinner from '../spinner/LoadingSpinner';

interface LoadingButtonProps {
    isLoading: boolean;
    onClick?: () => void;
    text: string; // Changed from children to text
    activeClassName?: string;
    disabledClassName?: string;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
    isLoading,
    onClick,
    text, // Using text instead of children
    activeClassName = 'bg-blue-600 hover:bg-blue-700',
    disabledClassName = 'bg-gray-400 cursor-not-allowed',
    className = '',
    type = 'submit',
}) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-white font-medium transition duration-200 ${isLoading ? disabledClassName : activeClassName} ${className}`}
        >
            {isLoading ? (
                <LoadingSpinner message={text ? text : "Uploading..."} className="text-white" />
            ) : (
                text
            )}
        </button>
    );
};

export default LoadingButton;
