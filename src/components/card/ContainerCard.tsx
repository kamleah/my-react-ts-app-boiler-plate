import React from 'react';

interface ContainerCardProps {
    children: React.ReactNode;
    className?: string;
}

const ContainerCard: React.FC<ContainerCardProps> = ({ children, className = '' }) => {
    return (
        <div className={`flex-1 flex flex-col ${className}`}>
            <div className='flex-1 p-6 bg-gray-100 overflow-y-auto max-h-[calc(100vh-20px)]'>
                {children}
            </div>
        </div>
    );
};

export default ContainerCard;
