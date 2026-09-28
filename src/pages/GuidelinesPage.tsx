import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  Heart,
  Flag,
  MapPin,
  ArrowRight
} from 'lucide-react';

export const GuidelinesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-leaf uppercase tracking-wider">
          Community Standards & Trust
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-forest tracking-tight">
          Cloth Forward Guidelines
        </h1>
        <p className="text-xs sm:text-sm text-mutedDark max-w-xl mx-auto">
          Our community thrives on respect, safety, cleanliness, and honest sharing. Here are the core rules every member pledges to follow.
        </p>
      </div>

      {/* Do's and Don'ts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What to Give */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-200/80 shadow-soft space-y-4">
          <div className="flex items-center gap-2.5 text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h2 className="font-display font-bold text-lg">What to Donate</h2>
          </div>
          <ul className="space-y-2.5 text-xs text-neutralDark leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>Clean & Freshly Washed:</strong> Garments should be freshly laundered and odor-free.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>Wearable & Intact:</strong> Buttons, zippers, and seams should be functioning properly.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>Accurate Sizing:</strong> State the genuine tag size or fit notes (e.g. relaxed, oversized).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>Honest Condition:</strong> Mark "Like New" only if worn 1-2 times without flaws.</span>
            </li>
          </ul>
        </div>

        {/* What NOT to Give */}
        <div className="bg-white rounded-3xl p-6 border border-rose-200/80 shadow-soft space-y-4">
          <div className="flex items-center gap-2.5 text-rose-800">
            <XCircle className="w-5 h-5 text-rose-600" />
            <h2 className="font-display font-bold text-lg">What NOT to Donate</h2>
          </div>
          <ul className="space-y-2.5 text-xs text-neutralDark leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">•</span>
              <span><strong>Heavily Damaged Items:</strong> Clothes with big tears, moth holes, or worn-out elastic.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">•</span>
              <span><strong>Undergarments:</strong> For hygiene reasons, intimate wear is strictly prohibited.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">•</span>
              <span><strong>Moldy or Stained:</strong> Clothes with food oil, color run, or chemical staining.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-600 font-bold">•</span>
              <span><strong>Commercial / Resale:</strong> No bulk inventory dumping or asking for money.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Safety & Privacy */}
      <div id="safety" className="bg-stone-50 rounded-3xl p-6 sm:p-8 border border-stone-200 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-forest text-white flex items-center justify-center font-bold">
            <Lock className="w-5 h-5 text-leaf" />
          </div>
          <div>
            <h2 className="font-display font-bold text-xl text-forest">Safety & Privacy Protocols</h2>
            <p className="text-xs text-mutedDark">How we protect members during coordination</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutralDark">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-1.5">
            <MapPin className="w-4 h-4 text-leaf" />
            <h4 className="font-bold text-forest">Public Handover Points</h4>
            <p className="text-mutedDark">
              We strongly recommend meeting at visible public locations like Metro station gates, shopping mall entrances, or community centers.
            </p>
          </div>

          <div id="privacy" className="bg-white p-4 rounded-2xl border border-stone-200 space-y-1.5">
            <ShieldCheck className="w-4 h-4 text-leaf" />
            <h4 className="font-bold text-forest">Zero Address Exposure</h4>
            <p className="text-mutedDark">
              Your exact home address or phone number is never shown publicly on the platform. Keep all initial arrangements in-app.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-1.5">
            <Flag className="w-4 h-4 text-rose-600" />
            <h4 className="font-bold text-forest">Prompt Moderation</h4>
            <p className="text-mutedDark">
              If an item violates guidelines or a user behaves inappropriately, use the "Report Listing" button for immediate admin review.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <Link
          to="/give"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-forest hover:bg-forest/90 text-white font-bold text-xs shadow-soft transition-all"
        >
          <span>Ready to Give? Post a Listing</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
