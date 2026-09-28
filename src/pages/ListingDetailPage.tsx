import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  Share2,
  ShieldCheck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Flag,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Truck,
  Building
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { IllustratedGarment } from '../utils/illustrationFallbacks';
import { RequestModal } from '../components/modals/RequestModal';
import { ReportModal } from '../components/modals/ReportModal';
import { ClothingCard } from '../components/common/ClothingCard';

export const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { listings, isFavorite, toggleFavorite, showToast } = useApp();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const listing = listings.find(l => l.id === id);

  if (!listing) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-forest">Garment Not Found</h2>
        <p className="text-xs text-mutedDark">
          This listing might have been completed or removed by the community donor.
        </p>
        <Link
          to="/discover"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-forest text-white text-xs font-bold shadow-soft"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discover</span>
        </Link>
      </div>
    );
  }

  const fav = isFavorite(listing.id);
  const relatedListings = listings
    .filter(l => l.id !== listing.id && (l.category === listing.category || l.city === listing.city))
    .slice(0, 4);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast({
        title: 'Link Copied to Clipboard!',
        message: 'Share this listing with friends or community groups.',
        type: 'info'
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Top Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-forest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to listings</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-forest shadow-soft transition-all"
            title="Share listing"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleFavorite(listing.id)}
            className="p-2.5 rounded-full bg-white border border-stone-200 text-stone-600 hover:text-terracotta shadow-soft transition-all"
            title={fav ? 'Remove from favorites' : 'Save to favorites'}
          >
            <Heart className={`w-4 h-4 ${fav ? 'fill-terracotta text-terracotta' : ''}`} />
          </button>
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="p-2.5 rounded-full bg-white border border-stone-200 text-stone-400 hover:text-rose-600 shadow-soft transition-all"
            title="Report inappropriate listing"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left: Image Gallery (Col 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-soft-lg">
            {listing.images && listing.images.length > 0 && !imageError ? (
              <img
                src={listing.images[activeImageIndex] || listing.images[0]}
                alt={listing.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <IllustratedGarment
                category={listing.category}
                color={listing.color}
                className="w-full h-full"
              />
            )}

            {/* Badges on image */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="glass-tag px-3 py-1 rounded-full text-xs font-bold text-forest shadow-sm">
                {listing.category}
              </span>
              <span className="glass-tag px-3 py-1 rounded-full text-xs font-bold text-forest shadow-sm">
                Size {listing.size}
              </span>
            </div>

            {/* Status overlay if not available */}
            {listing.status !== 'available' && (
              <div className="absolute inset-0 bg-forest/50 backdrop-blur-xs flex items-center justify-center p-4">
                <span className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-forest shadow-lg">
                  {listing.status === 'requested'
                    ? 'Request in review with donor'
                    : listing.status === 'reserved'
                    ? 'Handover in progress'
                    : 'Handed over to community member'}
                </span>
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {listing.images && listing.images.length > 1 && !imageError && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {listing.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-leaf shadow-soft scale-105'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Garment Specs, Donor Info & CTA (Col 5) */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-mutedDark mb-2">
              <span className="font-semibold text-leaf uppercase tracking-wider">
                {listing.gender} • {listing.category}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {new Date(listing.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-forest tracking-tight">
              {listing.title}
            </h1>
          </div>

          {/* Key Attributes Pills */}
          <div className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl bg-white border border-stone-200/80 shadow-soft-sm text-center">
            <div className="border-r border-stone-100">
              <p className="text-[10px] uppercase font-bold text-mutedDark">Size</p>
              <p className="text-sm font-black text-forest mt-0.5">{listing.size}</p>
            </div>
            <div className="border-r border-stone-100">
              <p className="text-[10px] uppercase font-bold text-mutedDark">Condition</p>
              <p className="text-sm font-bold text-leaf mt-0.5">{listing.condition}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-mutedDark">Color</p>
              <p className="text-sm font-semibold text-neutralDark truncate mt-0.5">
                {listing.color}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-forest">
              About this garment
            </h3>
            <p className="text-xs sm:text-sm text-neutralDark leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Suitable For & Donor Note */}
          {(listing.suitableFor || listing.donorNote) && (
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2.5 text-xs">
              {listing.suitableFor && (
                <div>
                  <span className="font-bold text-forest block">Best suited for:</span>
                  <p className="text-mutedDark mt-0.5">{listing.suitableFor}</p>
                </div>
              )}
              {listing.donorNote && (
                <div className="pt-2 border-t border-stone-200">
                  <span className="font-bold text-forest block">Donor's Note:</span>
                  <p className="text-mutedDark italic mt-0.5">"{listing.donorNote}"</p>
                </div>
              )}
            </div>
          )}

          {/* Pickup & Approximate Location Privacy */}
          <div className="space-y-3 p-4 rounded-2xl bg-white border border-stone-200/80 shadow-soft-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-forest">
                Handover Location
              </span>
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Address Protected
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-neutralDark font-semibold">
              <MapPin className="w-4 h-4 text-leaf flex-shrink-0" />
              <span>{listing.area}, {listing.city}</span>
            </div>

            <p className="text-[11px] text-mutedDark">
              Exact meeting point coordinates are shared securely in My Activity once the request is approved by the donor.
            </p>

            {/* Allowed pickup methods */}
            <div className="pt-2 border-t border-stone-100">
              <span className="text-[11px] font-bold text-stone-500 block mb-1.5">
                Available Handover Options:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {listing.pickupMethods.map((m) => (
                  <span
                    key={m}
                    className="px-2.5 py-1 rounded-xl bg-stone-100 text-neutralDark text-[11px] font-medium"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Donor Profile Card */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-soft-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={listing.donorAvatar}
                alt={listing.donorName}
                className="w-11 h-11 rounded-full object-cover border border-stone-200"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-forest">{listing.donorName}</h4>
                  {listing.donorVerified && (
                    <span title="Verified Member" className="flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-leaf" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-mutedDark">Community Giver • {listing.city}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-leaf">Verified Donor</span>
              <p className="text-[10px] text-stone-400">Punctual Handover</p>
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2 space-y-2">
            <button
              type="button"
              onClick={() => setIsRequestModalOpen(true)}
              disabled={listing.status !== 'available'}
              className={`w-full py-4 rounded-2xl font-bold text-sm shadow-soft-lg transition-all ${
                listing.status === 'available'
                  ? 'bg-forest hover:bg-forest/90 text-white active:scale-98'
                  : 'bg-stone-200 text-stone-500 cursor-not-allowed'
              }`}
            >
              {listing.status === 'available'
                ? 'Request This Item Forward'
                : 'Item Currently Unavailable'}
            </button>
            <p className="text-[10px] text-center text-stone-400">
              Free community reuse • No monetary charges or hidden fees
            </p>
          </div>
        </div>
      </div>

      {/* Related listings */}
      {relatedListings.length > 0 && (
        <div className="pt-12 border-t border-stone-200 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-xl text-forest">
              More clothes in {listing.city} & {listing.category}
            </h3>
            <Link to="/discover" className="text-xs font-bold text-leaf hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {relatedListings.map((rel) => (
              <ClothingCard
                key={rel.id}
                listing={rel}
                onRequestClick={(l) => {
                  navigate(`/clothes/${l.id}`);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <RequestModal
        listing={listing}
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
      />

      <ReportModal
        listingId={listing.id}
        listingTitle={listing.title}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};
