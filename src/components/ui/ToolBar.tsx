import React from 'react';
import type { ReactNode } from 'react';

interface ToolBarProps {
    title: string | ReactNode; // ✅ Accept string or JSX
    children?: ReactNode;
    className?: string;
  }

const ToolBar: React.FC<ToolBarProps> = ({ title, children,className }) => {
    return (
        <div className={` p-4   items-center shadow-sm ${className}`}>
            <h1 className='text-lg font-bold'>{title}</h1>
            {children}
        </div>
    );
};

export default ToolBar;