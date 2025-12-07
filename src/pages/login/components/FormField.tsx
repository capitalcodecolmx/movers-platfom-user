import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: LucideIcon;
  trailingContent?: React.ReactNode;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, icon: Icon, trailingContent, error, className = '', ...props }, ref) => {
    const paddingLeft = Icon ? 'pl-12' : 'pl-4';
    const paddingRight = trailingContent ? 'pr-12' : 'pr-4';
    const borderColor = error ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-500';

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
          )}
          <input
            ref={ref}
            className={`w-full ${paddingLeft} ${paddingRight} py-3 border ${borderColor} rounded-xl focus:border-transparent transition-all duration-200 ${className}`}
            {...props}
          />
          {trailingContent && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{trailingContent}</div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;
