import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, id, className = '', ...props }) => {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        className={`
          flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm placeholder:text-slate-400 
          focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 transition-all
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 focus:ring-indigo-500 focus:border-indigo-500'}
          ${className}
        `}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};
