// UI Component - Input réutilisable
// Composant de base pour tous les champs de saisie

import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  onIconClick?: () => void;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>((
  {
    label,
    error,
    icon: Icon,
    iconPosition = 'left',
    onIconClick,
    helperText,
    className = '',
    ...props
  },
  ref
) => {
  const baseInputClasses = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200';
  const normalClasses = 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
  const errorClasses = 'border-red-500 focus:ring-red-500 focus:border-red-500';
  const iconPaddingLeft = Icon && iconPosition === 'left' ? 'pl-10' : '';
  const iconPaddingRight = Icon && iconPosition === 'right' ? 'pr-10' : '';
  
  const inputClasses = [
    baseInputClasses,
    error ? errorClasses : normalClasses,
    iconPaddingLeft,
    iconPaddingRight,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <Icon 
              className={`h-5 w-5 ${error ? 'text-red-500' : 'text-gray-400'} ${
                onIconClick ? 'cursor-pointer hover:text-gray-600' : ''
              }`}
              onClick={onIconClick}
            />
          </div>
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        
        {Icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <Icon 
              className={`h-5 w-5 ${error ? 'text-red-500' : 'text-gray-400'} ${
                onIconClick ? 'cursor-pointer hover:text-gray-600' : ''
              }`}
              onClick={onIconClick}
            />
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;