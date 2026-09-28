import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Search,
  Heart,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  PlusCircle,
  MapPin,
  Sparkles,
  Lock
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What can I donate on Cloth Forward?',
      a: 'You can donate clean, wearable clothing in good condition — including shirts, t-shirts, jeans, trousers, dresses, kurtis, sarees, jackets, sweaters, kidswear, and footwear. Items must be clean and free of heavy stains, mold, or tears.'
    },
    {
      q: 'Do I need to pay any fee to donate or request clothes?',
      a: 'No. Cloth Forward is a 100% free community platform. There are no listing fees, requester charges, or monetary transactions permitted.'
    },
    {
      q: 'How does the pickup or handover work?',
      a: 'During listing, donors select preferred handover options (e.g. Public Metro/Mall handover points, Community drop-off center, or Doorstep pickup). Exact meeting coordinates are shared privately only after request approval.'
    },
    {
      q: 'Can I request more than one item?',
      a: 'Yes, but to ensure fair distribution across the community, we encourage requesting items you genuinely intend to wear.'
    },
    {
      q: 'How is my privacy protected?',
      a: 'Your exact home address and private phone number are NEVER exposed publicly on listings. Only your general area and city (e.g. Kothrud, Pune) are visible.'
    },
    {
      q: 'What happens after my request is approved?',
      a: 'Once approved, the donor reveals specific handover instructions in My Activity (such as meeting near Vanaz Metro station between 5 PM - 6 PM). You coordinate the exchange and mark it completed when received.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-leaf uppercase tracking-wider">
          Simple & Dignified Process
        </span>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-forest tracking-tight">
          How Cloth Forward works
        </h1>
        <p className="text-sm sm:text-base text-mutedDark leading-relaxed">
          Designed to make giving and receiving pre-loved clothes feel warm, dignified, and modern.
        </p>
      </div>

      {/* Donor vs Seeker Interactive Process Stepper */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FOR DONORS */}
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-soft space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <div className="w-10 h-10 rounded-2xl bg-leaf text-white flex items-center justify-center font-bold">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-forest">For Donors</h2>
              <p className="text-xs text-mutedDark">Give your unused clothes a second life</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                step: '1',
                title: 'Snap & List in 2 Minutes',
                desc: 'Upload 2-3 photos, choose category, size, condition, and preferred handover points.'
              },
              {
                step: '2',
                title: 'Receive Community Requests',
                desc: 'Review requests from neighbors explaining why they need the garment.'
              },
              {
                step: '3',
                title: 'Approve & Coordinate',
                desc: 'Approve the request and share safe meeting spot details (e.g. Metro station, lobby).'
              },
              {
                step: '4',
                title: 'Handover & See Impact',
                desc: 'Pass the item forward and see your contribution to circularity!'
              }
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-4 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="w-7 h-7 rounded-xl bg-forest text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {s.step}
                </span>
                <div>
                  <h4 className="font-bold text-xs text-forest">{s.title}</h4>
                  <p className="text-xs text-mutedDark mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/give"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-forest hover:bg-forest/90 text-white font-bold text-xs shadow-soft"
          >
            <span>Start Giving Clothes</span>
          </Link>
        </div>

        {/* FOR SEEKERS */}
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-soft space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-100">
            <div className="w-10 h-10 rounded-2xl bg-terracotta text-white flex items-center justify-center font-bold">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-forest">For Seekers</h2>
              <p className="text-xs text-mutedDark">Find pre-loved clothes that fit your life</p>
            </div>
          </div>

          <div className="space-y-4">
            {[
              {
                step: '1',
                title: 'Discover Available Clothes',
                desc: 'Filter by city, category, size, and condition to find garments you like.'
              },
              {
                step: '2',
                title: 'Send a Respectful Request',
                desc: 'Select preferred pickup method and add a short polite message.'
              },
              {
                step: '3',
                title: 'Get Handover Details',
                desc: 'Once approved, view exact pickup instructions and timing in My Activity.'
              },
              {
                step: '4',
                title: 'Receive & Wear',
                desc: 'Meet at the agreed public point, receive your garment, and mark completed!'
              }
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-4 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
                <span className="w-7 h-7 rounded-xl bg-terracotta text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {s.step}
                </span>
                <div>
                  <h4 className="font-bold text-xs text-forest">{s.title}</h4>
                  <p className="text-xs text-mutedDark mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            to="/discover"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-terracotta hover:bg-terracotta/90 text-white font-bold text-xs shadow-soft"
          >
            <span>Discover Available Items</span>
          </Link>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-soft max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-display font-bold text-2xl text-forest">Frequently Asked Questions</h2>
          <p className="text-xs text-mutedDark">Everything you need to know about Cloth Forward.</p>
        </div>

        <div className="space-y-3 pt-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-stone-200/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs text-forest bg-stone-50/50 hover:bg-stone-50"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-500 transition-transform ${
                      isOpen ? 'rotate-180 text-leaf' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="p-4 bg-white text-xs text-neutralDark leading-relaxed border-t border-stone-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
