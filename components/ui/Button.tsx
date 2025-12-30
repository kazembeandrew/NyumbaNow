
import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
  className?: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  className = '', 
  disabled = false 
}) => {
  const baseClasses = "w-full py-4 rounded-[24px] font-heading font-bold transition-all duration-300 text-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  const primaryClasses = "bg-primary text-white hover:bg-blue-700 shadow-xl shadow-primary/20";
  const outlineClasses = "bg-transparent border-2 border-primary text-primary hover:bg-primary/5";

  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={`${baseClasses} ${variant === 'primary' ? primaryClasses : outlineClasses} ${className}`}
    >
      {children}
    </button>
  );
};
