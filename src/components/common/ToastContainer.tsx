import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  const getToastStyles = (type: string) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-900/90 text-white border-emerald-700',
          icon: <CheckCircle className="w-5 h-5 text-emerald-300 flex-shrink-0" />,
        };
      case 'warning':
        return {
          bg: 'bg-amber-900/90 text-white border-amber-700',
          icon: <AlertTriangle className="w-5 h-5 text-amber-300 flex-shrink-0" />,
        };
      case 'error':
        return {
          bg: 'bg-rose-950/90 text-white border-rose-800',
          icon: <AlertCircle className="w-5 h-5 text-rose-300 flex-shrink-0" />,
        };
      default:
        return {
          bg: 'bg-forest/95 text-white border-forest-700',
          icon: <Info className="w-5 h-5 text-sage flex-shrink-0" />,
        };
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => {
          const style = getToastStyles(toast.type);
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-soft-xl border backdrop-blur-md ${style.bg}`}
              role="alert"
            >
              <div className="mt-0.5">{style.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-snug">{toast.title}</p>
                {toast.message && (
                  <p className="text-xs text-stone-200 mt-1 leading-relaxed">{toast.message}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
