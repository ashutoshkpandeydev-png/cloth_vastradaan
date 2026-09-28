import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-forest/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-soft-xl border border-stone-200 relative">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-forest hover:bg-stone-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              isDestructive ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h2 className="font-display font-bold text-lg text-forest">{title}</h2>
        </div>

        <p className="text-xs text-mutedDark leading-relaxed mb-6">{message}</p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-2xl border border-stone-200 text-stone-600 font-semibold text-xs hover:bg-stone-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-2xl font-bold text-xs text-white shadow-soft transition-all active:scale-95 ${
              isDestructive
                ? 'bg-rose-700 hover:bg-rose-800'
                : 'bg-forest hover:bg-forest/90'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
