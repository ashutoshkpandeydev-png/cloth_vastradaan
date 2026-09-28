import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  Layers,
  MapPin,
  CheckCircle2,
  PackageOpen,
  ArrowUpDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClothingCard } from '../components/common/ClothingCard';
import { SkeletonCard } from '../components/common/SkeletonCard';
import { RequestModal } from '../components/modals/RequestModal';
import {
  ClothingCategory,
  ClothingSize,
  ClothingCondition,
  ClothingGender,
  ClothingListing
} from '../types';

const CATEGORIES: (ClothingCategory | 'All')[] = [
  'All',
  'T-shirts',
  'Shirts',
  'Jeans',
  'Trousers',
  'Dresses',
  'Kurtis',
  'Sarees',
  'Jackets',
  'Sweaters',
  'Kidswear',
  'Footwear',
  'Other'
];

const SIZES: (ClothingSize | 'All')[] = [
  'All',
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'Kids (0-2y)',
  'Kids (3-6y)',
  'Kids (7-12y)',
  'Free Size'
];

const CONDITIONS: (ClothingCondition | 'All')[] = ['All', 'Like New', 'Good', 'Gently Used'];

const GENDERS: (ClothingGender | 'All')[] = ['All', 'Women', 'Men', 'Kids', 'Unisex'];

const CITIES = ['All', 'Pune', 'Mumbai', 'Bengaluru', 'Delhi', 'Hyderabad', 'Chennai', 'Kolkata'];

export const DiscoverPage: React.FC = () => {
  const { listings, searchFilter, setSearchFilter, clearFilters } = useApp();
  const [selectedListingForRequest, setSelectedListingForRequest] = useState<ClothingListing | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Filter listings based on current search and multi-facet filters
  const filteredListings = useMemo(() => {
    let result = [...listings];

    // Search query
    if (searchFilter.searchQuery.trim()) {
      const q = searchFilter.searchQuery.toLowerCase().trim();
      result = result.filter(
        item =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.brand && item.brand.toLowerCase().includes(q)) ||
          item.city.toLowerCase().includes(q) ||
          item.area.toLowerCase().includes(q) ||
          item.color.toLowerCase().includes(q)
      );
    }

    // Category
    if (searchFilter.category !== 'All') {
      result = result.filter(item => item.category === searchFilter.category);
    }

    // Size
    if (searchFilter.size !== 'All') {
      result = result.filter(item => item.size === searchFilter.size);
    }

    // Condition
    if (searchFilter.condition !== 'All') {
      result = result.filter(item => item.condition === searchFilter.condition);
    }

    // Gender
    if (searchFilter.gender !== 'All') {
      result = result.filter(
        item => item.gender === searchFilter.gender || item.gender === 'Unisex'
      );
    }

    // City
    if (searchFilter.city !== 'All') {
      result = result.filter(item => item.city.toLowerCase() === searchFilter.city.toLowerCase());
    }

    // Only Available
    if (searchFilter.onlyAvailable) {
      result = result.filter(item => item.status === 'available');
    }

    // Sorting
    if (searchFilter.sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (searchFilter.sortBy === 'most_requested') {
      result.sort((a, b) => b.requestCount - a.requestCount);
    }

    return result;
  }, [listings, searchFilter]);

  // Check if any filters are active
  const hasActiveFilters =
    searchFilter.searchQuery !== '' ||
    searchFilter.category !== 'All' ||
    searchFilter.size !== 'All' ||
    searchFilter.condition !== 'All' ||
    searchFilter.gender !== 'All' ||
    searchFilter.city !== 'All' ||
    searchFilter.onlyAvailable;

  const handleRequestClick = (listing: ClothingListing) => {
    setSelectedListingForRequest(listing);
    setIsRequestModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-leaf uppercase tracking-wider">
            Wardrobe Discovery
          </span>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-forest tracking-tight">
            Find something that fits your needs.
          </h1>
          <p className="text-xs sm:text-sm text-mutedDark mt-1">
            Browse genuine pre-loved clothing ready for respectful community handover.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-xs font-bold text-forest shadow-soft"
          >
            <SlidersHorizontal className="w-4 h-4 text-leaf" />
            <span>Filters {hasActiveFilters && '• Active'}</span>
          </button>

          <Link
            to="/give"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-forest hover:bg-forest/90 text-white text-xs font-bold shadow-soft transition-all"
          >
            <span>Have clothes to give?</span>
          </Link>
        </div>
      </div>

      {/* Search Bar & City Selector */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 border border-stone-200/80 shadow-soft grid grid-cols-1 sm:grid-cols-12 gap-3">
        {/* Main search input */}
        <div className="sm:col-span-8 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter.searchQuery}
            onChange={(e) => setSearchFilter(prev => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Search by title, style, brand (e.g. Kurti, Zara, Winter jacket, Cotton shirt)..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-neutralDark placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-leaf/40 focus:border-leaf"
          />
          {searchFilter.searchQuery && (
            <button
              onClick={() => setSearchFilter(prev => ({ ...prev, searchQuery: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* City Filter */}
        <div className="sm:col-span-2 relative">
          <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={searchFilter.city}
            onChange={(e) => setSearchFilter(prev => ({ ...prev, city: e.target.value }))}
            className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-neutralDark font-semibold focus:outline-none focus:ring-2 focus:ring-leaf/40"
          >
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Cities' : c}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="sm:col-span-2 relative">
          <ArrowUpDown className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={searchFilter.sortBy}
            onChange={(e) => setSearchFilter(prev => ({ ...prev, sortBy: e.target.value as any }))}
            className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-stone-50 border border-stone-200/80 text-xs text-neutralDark font-semibold focus:outline-none focus:ring-2 focus:ring-leaf/40"
          >
            <option value="newest">Newest First</option>
            <option value="most_requested">Most Requested</option>
          </select>
        </div>
      </div>

      {/* Horizontal Category Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = searchFilter.category === cat;
          return (
            <button
              key={cat}
              onClick={() => setSearchFilter(prev => ({ ...prev, category: cat }))}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-forest text-white shadow-soft-sm scale-105'
                  : 'bg-white hover:bg-stone-50 text-neutralDark border border-stone-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Desktop / Collapsible Detailed Filters (Size, Condition, Gender, Only Available) */}
      <div className={`${showMobileFilters ? 'block' : 'hidden md:block'} bg-white rounded-3xl p-5 border border-stone-200/80 shadow-soft`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Size Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-2">
              Size
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SIZES.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSearchFilter(prev => ({ ...prev, size: sz }))}
                  className={`px-2.5 py-1 text-xs rounded-xl font-medium transition-all ${
                    searchFilter.size === sz
                      ? 'bg-leaf text-white font-bold'
                      : 'bg-stone-50 hover:bg-stone-100 text-neutralDark border border-stone-200'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Condition Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-2">
              Condition
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CONDITIONS.map((cond) => (
                <button
                  key={cond}
                  onClick={() => setSearchFilter(prev => ({ ...prev, condition: cond }))}
                  className={`px-3 py-1 text-xs rounded-xl font-medium transition-all ${
                    searchFilter.condition === cond
                      ? 'bg-leaf text-white font-bold'
                      : 'bg-stone-50 hover:bg-stone-100 text-neutralDark border border-stone-200'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          {/* Gender Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-2">
              Gender / Fit
            </label>
            <div className="flex flex-wrap gap-1.5">
              {GENDERS.map((g) => (
                <button
                  key={g}
                  onClick={() => setSearchFilter(prev => ({ ...prev, gender: g }))}
                  className={`px-3 py-1 text-xs rounded-xl font-medium transition-all ${
                    searchFilter.gender === g
                      ? 'bg-leaf text-white font-bold'
                      : 'bg-stone-50 hover:bg-stone-100 text-neutralDark border border-stone-200'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Availability Toggle & Reset */}
          <div className="flex flex-col justify-between">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-2">
                Availability
              </label>
              <label className="flex items-center gap-2.5 text-xs text-neutralDark font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={searchFilter.onlyAvailable}
                  onChange={(e) => setSearchFilter(prev => ({ ...prev, onlyAvailable: e.target.checked }))}
                  className="rounded text-leaf focus:ring-leaf h-4 w-4"
                />
                <span>Only show items available for immediate request</span>
              </label>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-3 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar & Results count */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-mutedDark">
          <span className="font-bold text-forest">{filteredListings.length}</span> items found
          {hasActiveFilters && <span className="text-stone-400">• Filtering applied</span>}
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5">
            {searchFilter.searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-200 text-forest text-xs font-medium">
                "{searchFilter.searchQuery}"
                <button onClick={() => setSearchFilter(prev => ({ ...prev, searchQuery: '' }))}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchFilter.category !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-leaf/15 text-forest text-xs font-bold">
                {searchFilter.category}
                <button onClick={() => setSearchFilter(prev => ({ ...prev, category: 'All' }))}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchFilter.city !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-200 text-forest text-xs font-medium">
                City: {searchFilter.city}
                <button onClick={() => setSearchFilter(prev => ({ ...prev, city: 'All' }))}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchFilter.size !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-200 text-forest text-xs font-medium">
                Size: {searchFilter.size}
                <button onClick={() => setSearchFilter(prev => ({ ...prev, size: 'All' }))}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchFilter.condition !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-200 text-forest text-xs font-medium">
                Condition: {searchFilter.condition}
                <button onClick={() => setSearchFilter(prev => ({ ...prev, condition: 'All' }))}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearFilters}
              className="text-xs text-rose-700 hover:underline font-semibold ml-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Main Listings Grid or Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredListings.map((listing) => (
            <ClothingCard
              key={listing.id}
              listing={listing}
              onRequestClick={handleRequestClick}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 shadow-soft max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mx-auto">
            <PackageOpen className="w-8 h-8" />
          </div>
          <h3 className="font-display font-bold text-xl text-forest">
            Nothing matching that yet.
          </h3>
          <p className="text-xs text-mutedDark leading-relaxed">
            Looks like this shelf is empty for your selected filters. Try clearing a filter or list your own clothes for neighbors!
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 rounded-2xl bg-forest hover:bg-forest/90 text-white text-xs font-bold shadow-soft transition-all"
            >
              Clear Filters
            </button>
            <Link
              to="/give"
              className="px-5 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-forest text-xs font-bold transition-all"
            >
              Give Clothes Instead
            </Link>
          </div>
        </div>
      )}

      {/* Request Modal */}
      <RequestModal
        listing={selectedListingForRequest}
        isOpen={isRequestModalOpen}
        onClose={() => {
          setIsRequestModalOpen(false);
          setSelectedListingForRequest(null);
        }}
      />
    </div>
  );
};
