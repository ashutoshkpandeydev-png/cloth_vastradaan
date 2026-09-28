import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { storageService } from '../../services/storageService';

interface ReportModalProps {
  listingId?: string;
  listingTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  listingId,
  listingTitle,
  isOpen,
  onClose
}) => {
  const { currentUser, showToast, refreshReports } = useApp();
  const [reason, setReason] = useState('Prohibited item or unwearable condition');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      storageService.createReport({
        listingId,
        listingTitle,
        reportedBy: currentUser.id,
        reportedByName: currentUser.name,
        reason,
        details: details.trim() || undefined
      });

      refreshReports();

      showToast({
        title: 'Report Submitted',
        message: 'Thank you for keeping our community safe. Our moderators will review this listing promptly.',
        type: 'info'
      });

      onClose();
    } catch {
      showToast({
        title: 'Error',
        message: 'Could not submit report. Please try again.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-forest/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-soft-xl border border-stone-200 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-forest hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-700">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-forest">Report Listing</h2>
            <p className="text-xs text-mutedDark truncate max-w-[240px]">
              {listingTitle || 'Community content'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
              Reason for Report
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full rounded-2xl border border-stone-200 p-2.5 text-xs text-neutralDark bg-stone-50 focus:outline-none focus:ring-2 focus:ring-leaf/40"
            >
              <option value="Prohibited item or unwearable condition">Damaged / Moldy / Unwearable condition</option>
              <option value="Incorrect location tag">Misleading location or details</option>
              <option value="Commercial / Selling for money">Commercial sales / Charging money</option>
              <option value="Inappropriate / Harassment">Inappropriate photos or text</option>
              <option value="Other">Other community violation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
              Additional Details (Optional)
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe what is wrong with this listing..."
              className="w-full rounded-2xl border border-stone-200 p-3 text-xs text-neutralDark placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-leaf/40 resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-2xl border border-stone-200 text-stone-600 font-semibold text-xs hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-2xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-soft transition-all"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
