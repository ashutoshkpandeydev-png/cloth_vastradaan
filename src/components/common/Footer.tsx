import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, Shield, Recycle, MapPin, Mail, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { impactStats } = useApp();

  return (
    <footer className="bg-forest text-parchment pt-16 pb-12 border-t border-forest-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Callout Banner */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-leaf/20 text-sage text-xs font-semibold uppercase tracking-wider mb-2">
              <Recycle className="w-3.5 h-3.5" />
              Circular Community Impact
            </span>
            <h3 className="font-display font-bold text-2xl text-white">
              {impactStats.itemsReused.toLocaleString()} clothes given a second chapter.
            </h3>
            <p className="text-sm text-stone-300 mt-1 max-w-xl">
              From Pune to Kolkata, connecting unused wardrobes directly to people who need them with dignity.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/give"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-leaf hover:bg-leaf/90 text-white font-bold text-sm shadow-soft transition-all active:scale-95"
            >
              <span>Give Clothes</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              to="/discover"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 transition-all"
            >
              <span>Find Clothes</span>
            </Link>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-leaf flex items-center justify-center text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
                  <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
                </svg>
              </div>
              <span className="font-display font-black text-xl tracking-tight text-white">
                CLOTH<span className="text-leaf">FORWARD</span>
              </span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Give pre-loved clothes a second life by connecting unused wardrobes directly to people who need them most.
            </p>
            <div className="text-xs text-sage font-medium flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" />
              <span>Built for reuse, dignity & community trust.</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <Link to="/discover" className="hover:text-white transition-colors">
                  Discover Available Clothes
                </Link>
              </li>
              <li>
                <Link to="/give" className="hover:text-white transition-colors">
                  Give Pre-Loved Clothes
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How Cloth Forward Works
                </Link>
              </li>
              <li>
                <Link to="/impact" className="hover:text-white transition-colors">
                  Transparent Impact Metrics
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Community & Trust */}
          <div>
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-3">
              Trust & Guidelines
            </h4>
            <ul className="space-y-2 text-xs text-stone-300">
              <li>
                <Link to="/guidelines" className="hover:text-white transition-colors">
                  Community Cleanliness Rules
                </Link>
              </li>
              <li>
                <Link to="/guidelines#safety" className="hover:text-white transition-colors">
                  Safe Public Handover Points
                </Link>
              </li>
              <li>
                <Link to="/guidelines#privacy" className="hover:text-white transition-colors">
                  Privacy & Address Protection
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  Community Moderation Console
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Active Cities */}
          <div>
            <h4 className="font-display font-bold text-sm text-white uppercase tracking-wider mb-3">
              Community Hubs
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {['Pune', 'Mumbai', 'Bengaluru', 'Delhi', 'Hyderabad', 'Chennai', 'Kolkata'].map((city) => (
                <span
                  key={city}
                  className="px-2.5 py-1 rounded-lg bg-white/10 text-stone-200 text-xs font-medium"
                >
                  {city}
                </span>
              ))}
            </div>
            <p className="text-[11px] text-stone-400 mt-3 leading-tight">
              Community seed demo platform. Fictional demo accounts for demonstration.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} Cloth Forward. Non-commercial community reuse initiative.</p>
          <div className="flex items-center gap-4">
            <Link to="/guidelines" className="hover:text-stone-200">
              Terms & Safety
            </Link>
            <span>•</span>
            <Link to="/guidelines" className="hover:text-stone-200">
              Privacy Policy
            </Link>
            <span>•</span>
            <span className="flex items-center gap-1 text-sage">
              Made with <Heart className="w-3 h-3 text-terracotta fill-terracotta" /> for sustainable wardrobes
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
