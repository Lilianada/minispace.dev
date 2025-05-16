import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Toast } from '@/components/ui/toast';

type ToastType = 'success' | 'destructive' | 'warning' | 'info';

interface ToastContextProps {
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showToast = (message: string, type: ToastType = 'info') => {
    // Hide any existing toast first to reset timers
    if (isVisible) {
      setIsVisible(false);
      // Small delay to ensure animation completes before showing the new toast
      setTimeout(() => {
        setToast({ message, type });
        setIsVisible(true);
      }, 300);
    } else {
      setToast({ message, type });
      setIsVisible(true);
    }
  };

  const hideToast = () => {
    setIsVisible(false);
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && isVisible && (
        <div className="fixed top-4 right-4 z-50">
          <Toast 
            toast={{
              id: "singleton",
              message: toast.message,
              type: toast.type,
            }}
            onDismiss={() => hideToast()}
          />
        </div>
      )}
    </ToastContext.Provider>
  );
};

// Custom hook to use the toast context
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};