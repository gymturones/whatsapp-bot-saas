import React from 'react';

// Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, className = '', disabled, children, ...props }, ref) => {
    const base = 'font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2';

    const variants = {
      primary: 'bg-green-500 text-white hover:bg-green-400 disabled:opacity-50 shadow-lg shadow-green-500/20',
      secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 disabled:opacity-50',
      danger: 'bg-red-600 text-white hover:bg-red-500 disabled:opacity-50',
      ghost: 'text-slate-300 hover:bg-slate-800 disabled:opacity-40',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {loading && (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

// Input
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>}
      <input
        ref={ref}
        className={`w-full px-4 py-2.5 bg-slate-800 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-colors ${
          error ? 'border-red-500' : 'border-slate-700'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
      {helperText && !error && <p className="text-slate-500 text-xs mt-1.5">{helperText}</p>}
    </div>
  )
);
Input.displayName = 'Input';

// Textarea
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>}
      <textarea
        ref={ref}
        className={`w-full px-4 py-2.5 bg-slate-800 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 resize-none transition-colors ${
          error ? 'border-red-500' : 'border-slate-700'
        } ${className}`}
        {...props}
      />
      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
      {helperText && !error && <p className="text-slate-500 text-xs mt-1.5">{helperText}</p>}
    </div>
  )
);
Textarea.displayName = 'Textarea';

// Select
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string | number; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>}
      <select
        ref={ref}
        className={`w-full px-4 py-2.5 bg-slate-800 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-colors ${
          error ? 'border-red-500' : 'border-slate-700'
        } ${className}`}
        {...props}
      >
        <option value="">Seleccionar...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
    </div>
  )
);
Select.displayName = 'Select';

// Card
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-slate-900/60 rounded-2xl border border-slate-800 p-6 ${className}`}>
    {children}
  </div>
);

// Badge
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  children: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    default: 'bg-slate-700 text-slate-300',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    danger: 'bg-red-500/20 text-red-400',
    info: 'bg-blue-500/20 text-blue-400',
  };

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Alert
interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
}

export const Alert: React.FC<AlertProps> = ({ variant = 'info', title, children, onClose }) => {
  const variants = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    success: 'bg-green-500/10 border-green-500/30 text-green-400',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    error: 'bg-red-500/10 border-red-500/30 text-red-400',
  };

  return (
    <div className={`border rounded-xl p-4 ${variants[variant]}`}>
      <div className="flex items-start justify-between">
        <div>
          {title && <h3 className="font-semibold mb-1">{title}</h3>}
          <p className="text-sm">{children}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-lg font-bold opacity-60 hover:opacity-100 ml-4">×</button>
        )}
      </div>
    </div>
  );
};

// Spinner
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

  return (
    <div className={`${sizes[size]} animate-spin`}>
      <svg className="w-full h-full text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
      </svg>
    </div>
  );
};

// Modal
interface ModalProps {
  isOpen: boolean;
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, title, children, onClose, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl max-w-md w-full">
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
            <h2 className="text-base font-semibold text-white">{title}</h2>
            <button onClick={onClose} className="text-slate-500 hover:text-white text-xl font-bold transition-colors">×</button>
          </div>
        )}
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-slate-800 flex gap-2 justify-end">{footer}</div>}
      </div>
    </div>
  );
};

// Table
interface TableProps {
  headers: string[];
  data: any[];
  loading?: boolean;
  renderRow: (row: any, index: number) => React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ headers, data, loading, renderRow }) => (
  <div className="overflow-x-auto rounded-xl border border-slate-800">
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-slate-800/60 border-b border-slate-800">
          {headers.map((header) => (
            <th key={header} className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-widest">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={headers.length} className="px-4 py-8 text-center">
              <Spinner />
            </td>
          </tr>
        ) : data.length === 0 ? (
          <tr>
            <td colSpan={headers.length} className="px-4 py-8 text-center text-slate-500 text-sm">Sin datos</td>
          </tr>
        ) : (
          data.map((row, idx) => (
            <tr key={idx} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
              {renderRow(row, idx)}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);
