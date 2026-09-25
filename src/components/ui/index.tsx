import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

/* ============================================
   SKELETON
   ============================================ */
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export function Skeleton({ className = '', variant = 'rectangular' }: SkeletonProps) {
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };
  return <div className={`skeleton ${variants[variant]} ${className}`} aria-hidden="true" />;
}

/* ============================================
   EMPTY STATE
   ============================================ */
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  illustration?: 'box' | 'search' | 'users' | 'home' | 'chart';
}

const illustrations: Record<string, ReactNode> = {
  box: (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
      <rect x="20" y="40" width="80" height="60" rx="4" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
      <path d="M20 40L60 20L100 40" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
      <circle cx="60" cy="70" r="8" stroke="currentColor" strokeWidth="2" />
      <path d="M56 70L59 73L64 67" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
      <circle cx="52" cy="52" r="24" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
      <path d="M70 70L88 88" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M44 52H60M52 44V60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
      <circle cx="45" cy="45" r="12" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
      <path d="M25 85c0-11 9-20 20-20s20 9 20 20" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
      <circle cx="78" cy="50" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
      <path d="M65 90c0-9 6-16 13-16s13 7 13 16" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" opacity="0.6" />
    </svg>
  ),
  home: (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
      <path d="M20 55L60 25L100 55V95H20V55Z" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
      <rect x="50" y="70" width="20" height="25" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
      <circle cx="60" cy="50" r="3" fill="currentColor" opacity="0.3" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 120 120" className="w-full h-full" fill="none">
      <path d="M20 90H100" stroke="currentColor" strokeWidth="2" />
      <path d="M20 90V30" stroke="currentColor" strokeWidth="2" />
      <path d="M30 70L50 55L70 65L90 40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4" />
      <circle cx="30" cy="70" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="50" cy="55" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="70" cy="65" r="3" fill="currentColor" opacity="0.5" />
      <circle cx="90" cy="40" r="3" fill="currentColor" opacity="0.5" />
    </svg>
  ),
};

export function EmptyState({ icon, title, description, action, illustration = 'box' }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      <div className="w-32 h-32 text-neutral-300 mb-6">
        {icon || illustrations[illustration]}
      </div>
      <h3 className="text-lg font-semibold text-neutral-900 mb-2 font-display">{title}</h3>
      {description && (
        <p className="text-sm text-neutral-500 max-w-sm mb-6">{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}

/* ============================================
   BUTTON
   ============================================ */
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm hover:shadow-md',
    secondary: 'bg-neutral-900 text-white hover:bg-neutral-800 active:bg-neutral-950',
    outline: 'bg-white text-neutral-700 border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 active:bg-neutral-100',
    ghost: 'text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm',
  };
  const sizes: Record<ButtonSize, string> = {
    xs: 'px-2.5 py-1 text-xs gap-1',
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  return (
    <button
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={size === 'xs' ? 12 : size === 'sm' ? 14 : 16} className="animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
      {iconRight && <span className="flex-shrink-0">{iconRight}</span>}
    </button>
  );
}

/* ============================================
   INPUT
   ============================================ */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, iconRight, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-neutral-700">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`w-full bg-white px-3 py-2 text-sm rounded-lg border transition-all focus:outline-none focus:ring-2 focus:border-transparent ${
              error
                ? 'border-red-300 focus:ring-red-500/20'
                : 'border-neutral-200 focus:ring-brand-500/20 focus:border-brand-500'
            } ${icon ? 'pl-10' : ''} ${iconRight ? 'pr-10' : ''} ${className}`}
            {...props}
          />
          {iconRight && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
              {iconRight}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-600 flex items-center gap-1">⚠ {error}</p>}
        {hint && !error && <p className="text-xs text-neutral-500">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

/* ============================================
   SELECT
   ============================================ */
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
  icon?: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-neutral-700">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
              {icon}
            </span>
          )}
          <select
            ref={ref}
            className={`w-full bg-white px-3 py-2 text-sm rounded-lg border transition-all focus:outline-none focus:ring-2 focus:border-transparent appearance-none cursor-pointer ${
              error ? 'border-red-300' : 'border-neutral-200 focus:ring-brand-500/20 focus:border-brand-500'
            } ${icon ? 'pl-10' : ''} pr-9 ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {error && <p className="text-xs text-red-600">⚠ {error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

/* ============================================
   TEXTAREA
   ============================================ */
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-neutral-700">
            {label}
            {props.required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`w-full bg-white px-3 py-2 text-sm rounded-lg border transition-all focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
            error ? 'border-red-300' : 'border-neutral-200 focus:ring-brand-500/20 focus:border-brand-500'
          } ${className}`}
          rows={4}
          {...props}
        />
        {error && <p className="text-xs text-red-600">⚠ {error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

/* ============================================
   BADGE
   ============================================ */
interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', dot = false, className = '' }: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'bg-brand-50 text-brand-700 ring-brand-600/10',
    success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
    warning: 'bg-amber-50 text-amber-700 ring-amber-600/10',
    danger: 'bg-red-50 text-red-700 ring-red-600/10',
    info: 'bg-sky-50 text-sky-700 ring-sky-600/10',
    neutral: 'bg-neutral-100 text-neutral-700 ring-neutral-500/10',
  };
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };
  const dotColors: Record<string, string> = {
    default: 'bg-brand-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-sky-500',
    neutral: 'bg-neutral-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md ring-1 ring-inset ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} animate-pulse-soft`} style={{ animation: 'pulse-soft 2s ease-in-out infinite' }} />}
      {children}
    </span>
  );
}

/* ============================================
   CARD
   ============================================ */
interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
}

export function Card({ children, className = '', onClick, padding = 'md', hoverable = false }: CardProps) {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  };
  return (
    <div
      className={`bg-white rounded-xl border border-neutral-200/70 shadow-[var(--shadow-xs)] ${
        (onClick || hoverable) ? 'cursor-pointer hover:shadow-[var(--shadow-md)] hover:border-neutral-300 transition-all hover:-translate-y-0.5' : ''
      } ${paddings[padding]} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

/* ============================================
   DIALOG (Modal aprimorado)
   ============================================ */
interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function Dialog({ open, onClose, title, description, children, footer, size = 'md' }: DialogProps) {
  if (!open) return null;
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-6xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] overflow-hidden flex flex-col animate-scale-in`}
        role="dialog"
        aria-modal="true"
      >
        {(title || description) && (
          <div className="px-6 pt-6 pb-4 border-b border-neutral-100">
            {title && <h2 className="text-xl font-bold text-neutral-900 font-display">{title}</h2>}
            {description && <p className="text-sm text-neutral-500 mt-1">{description}</p>}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
              aria-label="Fechar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors z-10"
            aria-label="Fechar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================
   TABS
   ============================================ */
interface TabsProps {
  tabs: { id: string; label: string; icon?: ReactNode; count?: number }[];
  activeTab: string;
  onChange: (id: string) => void;
  variant?: 'underline' | 'pills';
}

export function Tabs({ tabs, activeTab, onChange, variant = 'underline' }: TabsProps) {
  if (variant === 'pills') {
    return (
      <div className="inline-flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === tab.id
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-brand-100 text-brand-700' : 'bg-neutral-200 text-neutral-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 border-b border-neutral-200 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap -mb-px ${
            activeTab === tab.id
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
          }`}
        >
          {tab.icon}
          {tab.label}
          {tab.count !== undefined && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === tab.id ? 'bg-brand-100 text-brand-700' : 'bg-neutral-100 text-neutral-600'
            }`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// Alias para compatibilidade
export const Modal = Dialog;

/* ============================================
   TOAST (feedback visual)
   ============================================ */
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, type = 'info', onClose }: ToastProps) {
  const styles = {
    success: 'bg-emerald-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-neutral-900 text-white',
  };
  return (
    <div className={`fixed bottom-6 right-6 z-[100] ${styles[type]} px-4 py-3 rounded-lg shadow-lg animate-slide-in-right flex items-center gap-3`}>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100">✕</button>
    </div>
  );
}
