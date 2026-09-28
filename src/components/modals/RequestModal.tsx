import React, { useState, useEffect } from 'react';
import { X, Send, ShieldCheck, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { ClothingListing, PickupMethod } from '../../types';
import { useApp } from '../../context/AppContext';
import { storageService } from '../../services/storageService';

interface RequestModalProps {
  listing: ClothingListing | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const RequestModal: React.FC<RequestModalProps> = ({
  listing,
  isOpen,
  onClose,
  onSuccess
}) => {
  const { currentUser, showToast, refreshListings, refreshRequests } = useApp();

  const [message, setMessage] = useState('');
  const [pickupMethod, setPickupMethod] = useState<PickupMethod>(
    listing?.pickupMethods[0] || 'Public Handover Point (Metro/Mall/Cafe)'
  );
  const [pledgeChecked, setPledgeChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync selected pickup method when listing changes
  useEffect(() => {
    if (listing?.pickupMethods?.length) {
      setPickupMethod(listing.pickupMethods[0]);
    }
    setMessage('');
    setPledgeChecked(false);
    setError(null);
  }, [listing]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !listing) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledgeChecked) {
      setError('Please agree to the Community Guidelines & respectful handover pledge.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      storageService.createRequest({
        listingId: listing.id,
        requesterId: currentUser.id,
        message: message.trim() || undefined,
        pickupMethod: pickupMethod,
      });

      refreshListings();
      refreshRequests();

      showToast({
        title: 'Request Sent Successfully!',
        message: `Your request for "${listing.title}" has been sent to ${listing.donorName}. You can track it under My Activity.`,
        type: 'success'
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-forest/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-soft-xl border border-stone-200 relative overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-modal-title"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-forest hover:bg-stone-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-leaf/10 flex items-center justify-center text-leaf">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h2 id="request-modal-title" className="font-display font-bold text-xl text-forest">
              Request this Item
            </h2>
            <p className="text-xs text-mutedDark">
              Connecting with donor: <span className="font-semibold text-neutralDark">{listing.donorName}</span>
            </p>
          </div>
        </div>

        {/* Listing preview banner */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50 border border-stone-200/80 mb-5">
          <img
            src={listing.images[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=200&q=80'}
            alt={listing.title}
            className="w-14 h-14 rounded-xl object-cover border border-stone-200 flex-shrink-0"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-forest truncate">{listing.title}</h3>
            <p className="text-xs text-mutedDark">
              Size: <span className="font-semibold text-neutralDark">{listing.size}</span> • {listing.condition}
            </p>
            <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-leaf flex-shrink-0" />
              <span className="truncate">{listing.area}, {listing.city}</span>
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pickup Method Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
              Preferred Handover Method
            </label>
            <div className="space-y-2">
              {listing.pickupMethods.map((method) => (
                <label
                  key={method}
                  className={`flex items-start gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                    pickupMethod === method
                      ? 'border-leaf bg-leaf/5 text-forest font-semibold'
                      : 'border-stone-200 hover:bg-stone-50 text-neutralDark'
                  }`}
                >
                  <input
                    type="radio"
                    name="pickupMethod"
                    checked={pickupMethod === method}
                    onChange={() => setPickupMethod(method)}
                    className="mt-0.5 text-leaf focus:ring-leaf"
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Optional Note / Why */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
              Short note to donor (Optional)
            </label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Hi! I need this for college classes and can meet at the metro station..."
              className="w-full rounded-2xl border border-stone-200 p-3 text-xs text-neutralDark placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-leaf/40 focus:border-leaf resize-none"
            />
          </div>

          {/* Community Pledge Checkbox */}
          <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/80">
            <label className="flex items-start gap-2.5 text-xs text-amber-950 cursor-pointer">
              <input
                type="checkbox"
                checked={pledgeChecked}
                onChange={(e) => setPledgeChecked(e.target.checked)}
                className="mt-0.5 rounded text-leaf focus:ring-leaf h-4 w-4"
                required
              />
              <span className="leading-relaxed">
                I promise to communicate respectfully, arrive punctually for handover, and treat the pre-loved garment with care.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-2xl border border-stone-200 text-stone-600 font-semibold text-xs hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-2xl bg-forest hover:bg-forest/90 text-white font-bold text-xs shadow-soft transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Sending Request...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
