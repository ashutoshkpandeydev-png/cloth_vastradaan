import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Clock, ArrowUpRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { ClothingListing } from '../../types';
import { useApp } from '../../context/AppContext';
import { IllustratedGarment } from '../../utils/illustrationFallbacks';
import { TiltCard } from './TiltCard';

interface ClothingCardProps {
  listing: ClothingListing;
  onRequestClick?: (listing: ClothingListing) => void;
}

export const ClothingCard: React.FC<ClothingCardProps> = ({ listing, onRequestClick }) => {
  const { isFavorite, toggleFavorite } = useApp();
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const fav = isFavorite(listing.id);

  // Time format helper
  const formatTime = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return `${Math.floor(diffDays / 7)}w ago`;
  };

  // Condition styling badge
  const getConditionBadge = (cond: string) => {
    switch (cond) {
      case 'Like New':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Good':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <TiltCard
      className="group bg-white rounded-3xl p-3 border border-stone-200/80 shadow-soft hover:shadow-soft-xl hover:border-leaf/30 transition-all duration-300 flex flex-col h-full"
      tiltDegree={6}
    >
      {/* Image / Fallback Container */}
      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 mb-3">
        {listing.images && listing.images.length > 0 && !imageError ? (
          <>
            <img
              src={listing.images[0]}
              alt={`${listing.title} - ${listing.category}`}
              loading="eager"
              onLoad={() => setIsLoaded(true)}
              onError={() => setImageError(true)}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            {!isLoaded && (
              <div className="absolute inset-0 skeleton-shimmer" />
            )}
          </>
        ) : (
          <IllustratedGarment
            category={listing.category}
            color={listing.color}
            className="w-full h-full"
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          <span className="glass-tag px-2.5 py-1 text-xs font-semibold text-forest rounded-full shadow-sm">
            {listing.category}
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(listing.id);
            }}
            aria-label={fav ? 'Remove from favorites' : 'Save to favorites'}
            className="pointer-events-auto p-2 rounded-full glass-tag text-stone-700 hover:text-terracotta hover:scale-110 active:scale-95 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-terracotta/50"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                fav ? 'fill-terracotta text-terracotta' : 'text-stone-600'
              }`}
            />
          </button>
        </div>

        {/* Status / Availability badge overlay */}
        {listing.status !== 'available' && (
          <div className="absolute inset-0 bg-forest/40 backdrop-blur-xs flex items-center justify-center p-3 z-10">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white text-forest shadow-md">
              {listing.status === 'requested' ? 'Request In Review' : listing.status === 'reserved' ? 'Handover Arranged' : 'Handed Over'}
            </span>
          </div>
        )}

        {/* Bottom Size / Condition Pill on Image */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1.5 z-10">
          <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-forest text-white shadow-xs">
            {listing.size}
          </span>
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-md border ${getConditionBadge(
              listing.condition
            )}`}
          >
            {listing.condition}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-grow px-1.5 pb-1">
        {/* Title */}
        <Link to={`/clothes/${listing.id}`} className="group-hover:text-forest transition-colors">
          <h3 className="font-display font-bold text-base text-neutralDark line-clamp-1 group-hover:text-leaf transition-colors" title={listing.title}>
            {listing.title}
          </h3>
        </Link>

        {/* Location & Time posted */}
        <div className="flex items-center justify-between text-xs text-mutedDark mt-1 mb-2">
          <div className="flex items-center gap-1 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-leaf flex-shrink-0" />
            <span className="truncate">{listing.area}, {listing.city}</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Clock className="w-3 h-3 text-stone-400" />
            <span>{formatTime(listing.createdAt)}</span>
          </div>
        </div>

        {/* Donor snippet */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-100 mt-auto">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={listing.donorAvatar}
              alt={listing.donorName}
              className="w-5 h-5 rounded-full object-cover border border-stone-200 flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="text-xs font-medium text-neutralDark truncate">{listing.donorName}</span>
            {listing.donorVerified && (
              <span title="Verified Community Member" className="flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-leaf flex-shrink-0" />
              </span>
            )}
          </div>

          {/* Action CTA */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Link
              to={`/clothes/${listing.id}`}
              className="inline-flex items-center justify-center p-1.5 text-stone-500 hover:text-forest rounded-full hover:bg-stone-100 transition-colors"
              title="View details"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => onRequestClick ? onRequestClick(listing) : undefined}
              disabled={listing.status !== 'available'}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                listing.status === 'available'
                  ? 'bg-forest hover:bg-forest/90 text-white hover:shadow-sm active:scale-95'
                  : 'bg-stone-100 text-stone-400 cursor-not-allowed'
              }`}
            >
              {listing.status === 'available' ? 'Request' : 'Unavailable'}
            </button>
          </div>
        </div>
      </div>
    </TiltCard>
  );
};
