import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  PlusCircle,
  Compass,
  Activity,
  BarChart3,
  HelpCircle,
  Shield,
  User as UserIcon,
  Menu,
  X,
  Heart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DemoSwitcher } from './DemoSwitcher';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, requests, favorites } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Pending requests badge
  const pendingRequestsCount = requests.filter(
    r => (r.donorId === currentUser.id && r.status === 'pending') ||
         (r.requesterId === currentUser.id && (r.status === 'approved' || r.status === 'pending'))
  ).length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Discover', path: '/discover', icon: Compass },
    { name: 'How It Works', path: '/how-it-works', icon: HelpCircle },
    { name: 'Impact', path: '/impact', icon: BarChart3 },
    {
      name: 'My Activity',
      path: '/activity',
      icon: Activity,
      badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined
    },
    { name: 'Guidelines', path: '/guidelines', icon: Shield },
  ];

  if (currentUser.role === 'admin') {
    navLinks.push({ name: 'Admin Console', path: '/admin', icon: Sparkles });
  }

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#F7F5EF]/90 backdrop-blur-md border-b border-stone-200/80 shadow-soft-sm py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-forest flex items-center justify-center text-white shadow-soft group-hover:bg-leaf transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-parchment">
                <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
              </svg>
            </div>
            <div>
              <span className="font-display font-black text-xl tracking-tight text-forest block leading-none">
                CLOTH<span className="text-leaf">FORWARD</span>
              </span>
              <span className="text-[10px] font-medium tracking-wider text-mutedDark uppercase block">
                Give Clothes Forward
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-200/80 shadow-soft-sm">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-forest text-white shadow-xs'
                      : 'text-neutralDark hover:text-forest hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                  {link.badge && (
                    <span className="ml-1 px-1.5 py-0.2 bg-terracotta text-white rounded-full text-[10px] font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5">
            {/* Demo User Switcher */}
            <DemoSwitcher />

            {/* Profile Avatar link */}
            <Link
              to="/profile"
              className={`p-2 rounded-full border transition-all ${
                location.pathname === '/profile'
                  ? 'bg-forest text-white border-forest'
                  : 'bg-white/80 text-neutralDark border-stone-200 hover:border-leaf/50 hover:bg-white shadow-soft'
              }`}
              title="Profile & Settings"
            >
              <UserIcon className="w-4 h-4" />
            </Link>

            {/* Primary CTA: Give Clothes */}
            <Link
              to="/give"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-leaf hover:bg-leaf/90 text-white text-xs font-bold shadow-soft hover:shadow-soft-lg active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Give Clothes</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-2xl bg-white border border-stone-200 text-neutralDark shadow-soft"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[73px] bg-[#F7F5EF] border-b border-stone-200 p-4 shadow-soft-xl max-h-[calc(100vh-80px)] overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-2">
            <Link
              to="/give"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-leaf text-white font-bold text-sm shadow-soft mb-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Give Clothes Now</span>
            </Link>

            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center justify-between p-3 rounded-2xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-forest text-white'
                      : 'bg-white text-neutralDark border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                  </div>
                  {link.badge && (
                    <span className="px-2 py-0.5 bg-terracotta text-white rounded-full text-xs font-bold">
                      {link.badge} pending
                    </span>
                  )}
                </Link>
              );
            })}

            <Link
              to="/profile"
              className={`flex items-center gap-3 p-3 rounded-2xl text-sm font-semibold transition-colors ${
                location.pathname === '/profile'
                  ? 'bg-forest text-white'
                  : 'bg-white text-neutralDark border border-stone-200'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>My Profile & Settings</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
