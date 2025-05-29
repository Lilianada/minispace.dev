'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

// Toast Context and Provider
export type ToastType = 'success' | 'destructive' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  title?: string;
  description?: string;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue>({
  toasts: [],
  addToast: () => {},
  dismissToast: () => {},
});

export function ToastProvider({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, dismissToast }}>
      {children}
      <ToastViewport />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Toast Components
interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  toast: Toast;
  onDismiss: (id: string) => void;
}

export function Toast({ 
  toast, 
  onDismiss, 
  className, 
  ...props 
}: ToastProps) {
  // Auto-dismiss after 3 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  // Define styles based on toast type
  const getBorderStyle = (): string => {
    switch (toast.type) {
      case 'success':
        return 'border-l-4 border-green-500 bg-green-50 shadow-[0_0_15px_rgba(34,197,94,0.3)]';
      case 'destructive':
        return 'border-l-4 border-red-500 bg-red-50 shadow-[0_0_15px_rgba(239,68,68,0.3)]';
      case 'warning':
        return 'border-l-4 border-orange-400 bg-orange-50 shadow-[0_0_15px_rgba(251,146,60,0.3)]';
      default:
        return 'border-l-4 border-blue-500 bg-blue-50';
    }
  };
  
  const getTextStyle = (): string => {
    switch (toast.type) {
      case 'success':
        return 'text-green-800';
      case 'destructive':
        return 'text-red-800';
      case 'warning':
        return 'text-orange-800';
      default:
        return 'text-blue-800';
    }
  };

  return (
    <div
      className={cn(
        `p-4 rounded-md ${getBorderStyle()} transition-all duration-300 ease-in-out transform`,
        className
      )}
      {...props}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {toast.title && (
            <ToastTitle className={getTextStyle()}>
              {toast.title}
            </ToastTitle>
          )}
          {toast.description && (
            <ToastDescription>
              {toast.description}
            </ToastDescription>
          )}
          {toast.message && (
            <div className={`text-sm font-medium ${getTextStyle()}`}>
              {toast.message}
            </div>
          )}
        </div>
        <ToastClose onClick={() => onDismiss(toast.id)} className={getTextStyle()} />
      </div>
    </div>
  );
}

export function ToastTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  );
}

export function ToastDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("text-sm opacity-90", className)}
      {...props}
    />
  );
}

export function ToastClose({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn("ml-4 focus:outline-none", className)}
      {...props}
    >
      <X size={16} />
    </button>
  );
}

export function ToastViewport() {
  const { toasts, dismissToast } = useToast();
  
  return (
    <div className="fixed top-4 right-4 flex flex-col gap-2 max-w-md z-50">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onDismiss={dismissToast}
        />
      ))}
    </div>
  );
}