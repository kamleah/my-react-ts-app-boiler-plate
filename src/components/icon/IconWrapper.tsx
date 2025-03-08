import React from 'react';

interface IconWrapperProps extends React.SVGProps<SVGSVGElement> {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const IconWrapper: React.FC<IconWrapperProps> = ({ icon: Icon, className, ...props }) => {
    return (
        <Icon
            className={className}
            stroke="currentColor"
            {...props}
        />
    );
};

export default IconWrapper;