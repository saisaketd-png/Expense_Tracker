import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  isIcon?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isIcon = false,
  className = '', 
  ...props 
}) => {
  const baseClass = `btn btn-${variant} ${isIcon ? 'btn-icon' : ''} ${className}`;
  return (
    <button className={baseClass.trim()} {...props}>
      {children}
    </button>
  );
};
