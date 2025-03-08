import React from 'react';

interface InputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    disabled?: boolean;
    className?: string;
    wrapperClassName?: string;
}

const Input: React.FC<InputProps> = ({
    value,
    onChange,
    placeholder = 'Enter text',
    type = 'text',
    disabled = false,
    className = '',
    wrapperClassName = '',
}) => {
    return (
        <div className={`relative flex-1 group ${wrapperClassName}`}>
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                className={`w-full px-5 py-3 border-none bg-white text-gray-700 rounded-full shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 placeholder-gray-400 transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
            />
        </div>
    );
};

export default Input;