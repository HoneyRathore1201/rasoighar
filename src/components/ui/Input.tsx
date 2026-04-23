'use client';
import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, icon, className = '', ...props }, ref) => (
  <div>
    {label && <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">{label}</label>}
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">{icon}</span>}
      <input ref={ref} className={`w-full px-4 py-2.5 rounded-xl bg-bg-elevated border border-border text-text placeholder:text-text-muted
        focus:border-accent focus:ring-1 focus:ring-accent/30 focus:outline-none transition-all text-sm
        ${icon ? 'pl-10' : ''} ${error ? 'border-danger' : ''} ${className}`} {...props} />
    </div>
    {error && <p className="text-xs text-danger mt-1">{error}</p>}
  </div>
));
Input.displayName = 'Input';
export default Input;
