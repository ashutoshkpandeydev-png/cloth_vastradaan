import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User as UserIcon,
  CheckCircle2,
  ShieldCheck,
  Heart,
  Package,
  Activity,
  Bell,
  Lock,
  RotateCcw,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfilePage: React.FC = () => {
  const { currentUser, allUsers, switchUser, resetAllDemoData, listings, requests, favorites, showToast } = useApp();

  const [notificationsEmail, setNotificationsEmail] = useState(true);
  const [notificationsInApp, setNotificationsInApp] = useState(true);
  const [privacyApproxOnly, setPrivacyApproxOnly] = useState(true);

  const userListings = listings.filter(l => l.donorId === currentUser.id);
  const userRequests = requests.filter(r => r.requesterId === currentUser.id || r.donorId === currentUser.id);

  const handleSaveSettings = () => {
    showToast({
      title: 'Preferences Saved',
      message: 'Your notification and privacy preferences have been updated.',
      type: 'success'
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-soft space-y-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-24 h-24 rounded-3xl object-cover border-2 border-leaf shadow-soft"
            />
            {currentUser.verified && (
              <span className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-leaf text-white shadow-soft" title="Verified Member">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="font-display font-black text-2xl text-forest flex items-center justify-center sm:justify-start gap-2">
                  <span>{currentUser.name}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-leaf/10 text-leaf border border-leaf/20">
                    {currentUser.role}
                  </span>
                </h1>
                <p className="text-xs text-mutedDark flex items-center justify-center sm:justify-start gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{currentUser.area}, {currentUser.city}</span>
                  <span className="mx-1">•</span>
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>Member since {new Date(currentUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </p>
              </div>
            </div>

            {currentUser.bio && (
              <p className="text-xs text-neutralDark leading-relaxed">
                "{currentUser.bio}"
              </p>
            )}

            {/* Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
              {currentUser.badges.map((b) => (
                <span
                  key={b}
                  className="px-2.5 py-1 rounded-xl bg-stone-100 text-stone-700 text-[11px] font-semibold flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-gold" />
                  <span>{b}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-stone-100 text-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-mutedDark">Wardrobe Listings</p>
            <p className="font-display font-black text-xl text-forest mt-0.5">{userListings.length}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-mutedDark">Activity Items</p>
            <p className="font-display font-black text-xl text-forest mt-0.5">{userRequests.length}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-mutedDark">Saved Items</p>
            <p className="font-display font-black text-xl text-forest mt-0.5">{favorites.length}</p>
          </div>
        </div>
      </div>

      {/* Switch Persona Section */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-soft space-y-4">
        <div>
          <h2 className="font-display font-bold text-lg text-forest">Demo Persona Selector</h2>
          <p className="text-xs text-mutedDark">
            Switch between user profiles to test Donor, Seeker, and Admin perspectives instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {allUsers.slice(0, 3).map((u) => {
            const isSelected = u.id === currentUser.id;
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => switchUser(u.id)}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                  isSelected
                    ? 'border-leaf bg-leaf/10 ring-2 ring-leaf/30'
                    : 'border-stone-200 hover:bg-stone-50'
                }`}
              >
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-10 h-10 rounded-2xl object-cover border border-stone-200 flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-forest truncate">{u.name}</p>
                  <p className="text-[10px] text-mutedDark uppercase font-semibold">{u.role} • {u.city}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preferences & Privacy */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-soft space-y-6">
        <h2 className="font-display font-bold text-lg text-forest">Preferences & Privacy</h2>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/80 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-forest">In-App Notification Alerts</p>
              <p className="text-[11px] text-mutedDark">Receive alerts on incoming garment requests or approval updates</p>
            </div>
            <input
              type="checkbox"
              checked={notificationsInApp}
              onChange={(e) => setNotificationsInApp(e.target.checked)}
              className="rounded text-leaf focus:ring-leaf h-4 w-4"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-stone-50 border border-stone-200/80 cursor-pointer">
            <div>
              <p className="text-xs font-bold text-forest">Approximate Location Privacy</p>
              <p className="text-[11px] text-mutedDark">Never display exact street address on public listings</p>
            </div>
            <input
              type="checkbox"
              checked={privacyApproxOnly}
              onChange={(e) => setPrivacyApproxOnly(e.target.checked)}
              className="rounded text-leaf focus:ring-leaf h-4 w-4"
            />
          </label>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
          <button
            type="button"
            onClick={handleSaveSettings}
            className="px-5 py-2 rounded-xl bg-forest hover:bg-forest/90 text-white font-bold text-xs shadow-soft transition-all"
          >
            Save Preferences
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all demo data back to seed state?')) {
                resetAllDemoData();
              }
            }}
            className="flex items-center gap-1.5 text-xs text-rose-700 font-bold hover:underline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Database</span>
          </button>
        </div>
      </div>
    </div>
  );
};
