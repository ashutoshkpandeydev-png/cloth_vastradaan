import React, { useState, useRef, useEffect } from 'react';
import { UserCheck, ChevronDown, RotateCcw, ShieldCheck, HeartHandshake, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

export const DemoSwitcher: React.FC = () => {
  const { currentUser, allUsers, switchUser, resetAllDemoData } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'donor':
        return <HeartHandshake className="w-4 h-4 text-leaf" />;
      case 'seeker':
        return <Search className="w-4 h-4 text-terracotta" />;
      case 'admin':
        return <ShieldCheck className="w-4 h-4 text-gold" />;
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'donor':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'seeker':
        return 'bg-terracotta-100 text-terracotta-700 border-terracotta-200';
      case 'admin':
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white border border-stone-200 shadow-soft text-xs font-medium text-neutralDark transition-all focus:outline-none focus:ring-2 focus:ring-leaf/40"
        aria-label="Switch Demo User"
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-5 h-5 rounded-full object-cover border border-stone-300"
        />
        <span className="font-semibold text-forest truncate max-w-[90px] sm:max-w-none">
          {currentUser.name.split(' ')[0]} ({currentUser.role})
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-72 rounded-2xl shadow-soft-xl bg-white border border-stone-200 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 p-2 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-stone-100">
            <p className="text-[11px] font-bold tracking-wider uppercase text-mutedDark">
              Demo Persona Switcher
            </p>
            <p className="text-xs text-stone-500 mt-0.5">
              Switch roles to test Donor, Seeker, or Admin flows seamlessly.
            </p>
          </div>

          <div className="py-1 space-y-1">
            {allUsers.slice(0, 3).map((user) => {
              const isSelected = user.id === currentUser.id;
              return (
                <button
                  key={user.id}
                  onClick={() => {
                    switchUser(user.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                    isSelected
                      ? 'bg-leaf/10 border border-leaf/30 text-forest'
                      : 'hover:bg-stone-50 text-neutralDark'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-stone-200 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate flex items-center gap-1.5">
                        {user.name}
                        {isSelected && <UserCheck className="w-3.5 h-3.5 text-leaf" />}
                      </p>
                      <p className="text-[10px] text-mutedDark truncate">
                        {user.city} • {user.area}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md border uppercase tracking-wider ${getRoleBadge(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all demo listings, requests, and activity to fresh seed data?')) {
                  resetAllDemoData();
                  setIsOpen(false);
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo Seed Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
