import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  PlusCircle,
  Search,
  ArrowRight,
  Heart,
  ShieldCheck,
  Recycle,
  Users,
  MapPin,
  CheckCircle2,
  Package,
  Layers,
  Sparkle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClothingCard } from '../components/common/ClothingCard';
import { TiltCard } from '../components/common/TiltCard';
import { RequestModal } from '../components/modals/RequestModal';
import { ClothingListing } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { listings, impactStats } = useApp();
  const [selectedListingForRequest, setSelectedListingForRequest] = useState<ClothingListing | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const freshListings = listings.filter(l => l.status === 'available').slice(0, 8);

  const handleRequestClick = (listing: ClothingListing) => {
    setSelectedListingForRequest(listing);
    setIsRequestModalOpen(true);
  };

  return (
    <div className="space-y-20 sm:space-y-28 pb-16 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12">
        {/* Background ambient glow shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-leaf/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-0 -ml-20 w-80 h-80 bg-terracotta/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Column */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-leaf/10 border border-leaf/20 text-forest text-xs font-bold tracking-wide">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-leaf opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-leaf"></span>
                </span>
                <span>Community-Driven Wardrobe Circularity</span>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-forest tracking-tight leading-[1.1]">
                Your wardrobe can <br className="hidden sm:inline" />
                <span className="text-leaf italic font-editorial font-normal">move someone</span> forward.
              </h1>

              <p className="text-base sm:text-lg text-neutralDark/80 max-w-xl leading-relaxed font-normal">
                Give pre-loved clothes a second life. Connect what you no longer wear directly with people nearby who need it—with simplicity, dignity, and zero waste.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <Link
                  to="/give"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-forest hover:bg-forest/90 text-white font-bold text-sm shadow-soft-lg hover:shadow-soft-xl active:scale-95 transition-all group"
                >
                  <PlusCircle className="w-5 h-5 text-leaf transition-transform group-hover:rotate-90 duration-300" />
                  <span>Give Clothes</span>
                  <ArrowRight className="w-4 h-4 ml-1 opacity-70 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/discover"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-stone-50 text-forest font-bold text-sm border border-stone-200 shadow-soft hover:shadow-soft-lg transition-all"
                >
                  <Search className="w-4 h-4 text-stone-500" />
                  <span>Find Clothes</span>
                </Link>
              </div>

              {/* Micro trust indicators */}
              <div className="flex items-center gap-6 pt-4 border-t border-stone-200/80 text-xs text-mutedDark font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-leaf" />
                  <span>Verified Community</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-terracotta" />
                  <span>100% Non-Profit Giving</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gold" />
                  <span>7 Indian Metros</span>
                </div>
              </div>
            </motion.div>

            {/* Right Hero Column: 3D Interactive Layered Collage */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative w-full aspect-square max-w-[480px] mx-auto">
                {/* Main floating 3D Card 1 */}
                <TiltCard
                  className="absolute top-4 left-4 right-12 bottom-12 bg-white rounded-3xl p-3 shadow-soft-xl border border-stone-200/80 z-20"
                  tiltDegree={12}
                >
                  <div className="relative w-full h-full rounded-2xl overflow-hidden bg-stone-100">
                    <img
                      src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"
                      alt="Organic Cotton Shirt"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl glass-panel-dark text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-parchment">Pure Cotton Overshirt</p>
                          <p className="text-[10px] text-sage">Aarav S. • Kothrud, Pune</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-leaf text-[10px] font-bold">
                          Ready for Handover
                        </span>
                      </div>
                    </div>
                  </div>
                </TiltCard>

                {/* Layered Card 2 Behind */}
                <div className="absolute top-12 right-2 w-48 h-60 bg-white/90 rounded-3xl p-2.5 shadow-soft-lg border border-stone-200/80 rotate-6 z-10 hidden sm:block">
                  <img
                    src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=400&q=80"
                    alt="Handloom Silk Kurti"
                    className="w-full h-36 rounded-2xl object-cover"
                  />
                  <div className="p-2">
                    <p className="text-[11px] font-bold text-forest truncate">Handloom Silk Saree</p>
                    <p className="text-[9px] text-mutedDark">Kolkata • Like New</p>
                  </div>
                </div>

                {/* Floating Impact Badge pill */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                  className="absolute -bottom-4 -left-2 sm:left-4 z-30 p-3.5 rounded-2xl glass-panel shadow-soft-xl border border-white/80 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-leaf flex items-center justify-center text-white font-bold">
                    <Recycle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-forest">840+ Garments Circulated</p>
                    <p className="text-[10px] text-mutedDark">2.2 Million Liters Water Conserved</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. TRUST & IMPACT METRIC STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest rounded-3xl p-6 sm:p-8 text-white shadow-soft-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-bold text-sage uppercase tracking-wider">
                Real Community Movement
              </span>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-parchment">
                Small actions create real wardrobe transformations.
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/10 text-stone-300 text-xs font-medium border border-white/10">
              Demo platform metrics
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 text-center sm:text-left">
            <div>
              <p className="font-display font-black text-3xl sm:text-4xl text-parchment">
                {impactStats.itemsReused.toLocaleString()}
              </p>
              <p className="text-xs text-stone-300 mt-1">Clothes given forward</p>
            </div>
            <div>
              <p className="font-display font-black text-3xl sm:text-4xl text-sage">
                {impactStats.peopleSupported.toLocaleString()}
              </p>
              <p className="text-xs text-stone-300 mt-1">People supported</p>
            </div>
            <div>
              <p className="font-display font-black text-3xl sm:text-4xl text-gold">
                {impactStats.donationsCompleted.toLocaleString()}
              </p>
              <p className="text-xs text-stone-300 mt-1">Successful handovers</p>
            </div>
            <div>
              <p className="font-display font-black text-3xl sm:text-4xl text-terracotta">
                {impactStats.citiesCount}
              </p>
              <p className="text-xs text-stone-300 mt-1">Active Indian cities</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold text-leaf uppercase tracking-wider">
            Simple, Transparent, Dignified
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-forest">
            How Cloth Forward works
          </h2>
          <p className="text-sm text-neutralDark/70">
            No endless haggling, no commercial resellers. Just safe community handovers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'List what you no longer wear',
              desc: 'Take 2-3 photos of clean, wearable clothes. Add size, category, and preferred pickup point.',
              icon: Package,
              accent: 'border-leaf/30 bg-leaf/5'
            },
            {
              step: '02',
              title: 'Someone nearby discovers it',
              desc: 'Seekers browse by city, size, and category to find garments that genuinely fit their needs.',
              icon: Search,
              accent: 'border-gold/30 bg-gold/5'
            },
            {
              step: '03',
              title: 'They send a polite request',
              desc: 'Donor reviews the request, chooses approval, and shares safe handover details.',
              icon: Heart,
              accent: 'border-terracotta/30 bg-terracotta/5'
            },
            {
              step: '04',
              title: 'Safe respectful handover',
              desc: 'Meet at a public spot (metro station, cafe, drop-off) and pass the clothes forward.',
              icon: CheckCircle2,
              accent: 'border-forest/30 bg-forest/5'
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft hover:shadow-soft-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display font-black text-2xl text-stone-300">
                      {item.step}
                    </span>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${item.accent}`}>
                      <Icon className="w-5 h-5 text-forest" />
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-base text-forest mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-mutedDark leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. FRESH FROM THE COMMUNITY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-leaf uppercase tracking-wider">
              Fresh Wardrobe Additions
            </span>
            <h2 className="font-display font-bold text-3xl text-forest">
              Fresh from the community
            </h2>
            <p className="text-xs text-mutedDark mt-1">
              Clean, pre-loved garments ready for their next chapter.
            </p>
          </div>

          <Link
            to="/discover"
            className="inline-flex items-center gap-2 text-xs font-bold text-leaf hover:text-forest transition-colors"
          >
            <span>Browse All {listings.length} Listings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {freshListings.map((listing) => (
            <ClothingCard
              key={listing.id}
              listing={listing}
              onRequestClick={handleRequestClick}
            />
          ))}
        </div>
      </section>

      {/* 5. DIGNITY & PHILOSOPHY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-soft-xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              Dignity First Platform
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-forest leading-tight">
              Giving with dignity, <br />
              receiving with respect.
            </h2>
            <p className="text-sm text-neutralDark/80 leading-relaxed">
              We believe giving away clothes shouldn't feel like dumping unwanted scrap into a bin, and receiving clothes shouldn't feel compromising.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-leaf/10 text-leaf flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-forest">Genuine Choice</h4>
                  <p className="text-xs text-mutedDark">Seekers pick exact sizes, styles, and garments that match their daily lives.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-leaf/10 text-leaf flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-forest">Address Privacy Protection</h4>
                  <p className="text-xs text-mutedDark">Private addresses and phone numbers are never broadcasted publicly.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-stone-100 shadow-soft-lg">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
                alt="Community member smiling"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 p-4 rounded-2xl glass-panel shadow-soft-xl max-w-xs border border-white">
              <p className="text-xs font-semibold text-forest italic font-editorial">
                "That shirt you stopped wearing could be exactly what someone else needs for their first interview."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BOTTOM BANNER CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-leaf rounded-3xl p-8 sm:p-12 text-center text-white shadow-soft-xl space-y-6 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="font-display font-black text-3xl sm:text-4xl text-parchment">
              Have clothes sitting unused in your wardrobe?
            </h2>
            <p className="text-sm sm:text-base text-parchment/90 leading-relaxed">
              Join thousands of neighbors across India who pass clothes forward with care and dignity.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/give"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-forest hover:bg-forest/90 text-white font-bold text-sm shadow-soft-lg transition-all active:scale-95"
              >
                Give Them a Second Life
              </Link>
              <Link
                to="/discover"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm border border-white/30 transition-all"
              >
                Explore Available Items
              </Link>
            </div>
          </div>
        </div>
      </section>

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
