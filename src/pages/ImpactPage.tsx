import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Recycle,
  Droplets,
  Cloud,
  Users,
  Building,
  CheckCircle2,
  HelpCircle,
  Calculator,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ImpactPage: React.FC = () => {
  const { impactStats } = useApp();
  const [sliderVal, setSliderVal] = useState<number>(5);

  // Transparent calculations based on textile circularity benchmarks:
  // 1 cotton garment reused = ~2,700 liters water saved
  // 1 garment reused = ~8 kg CO2 avoided
  // 1 garment reused = ~0.4 kg landfill waste diverted
  const calcWater = (sliderVal * 2700).toLocaleString();
  const calcCo2 = (sliderVal * 8).toLocaleString();
  const calcWaste = (sliderVal * 0.4).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Hero */}
      <div className="bg-forest text-parchment rounded-3xl p-8 sm:p-14 shadow-soft-xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-leaf/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-leaf/20 text-sage text-xs font-bold uppercase tracking-wider">
            <Recycle className="w-4 h-4" />
            Transparent Wardrobe Circularity
          </span>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            Every item reused is one less garment sitting unused.
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
            Cloth Forward extends the useful life of clothing by helping it move directly from unused wardrobes to people who can wear it.
          </p>
        </div>

        {/* Live Seed Data Badge */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-400">
          <span className="flex items-center gap-2">
            <Info className="w-4 h-4 text-sage" />
            <span>Community metrics ground truth based on demo seed database</span>
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 text-stone-300 font-semibold">
            {impactStats.citiesCount} Active Indian Hubs
          </span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-leaf/10 text-leaf flex items-center justify-center font-bold">
            <Recycle className="w-5 h-5" />
          </div>
          <p className="font-display font-black text-3xl text-forest">
            {impactStats.itemsReused.toLocaleString()}
          </p>
          <h3 className="font-bold text-xs text-forest uppercase tracking-wider">Garments Reused</h3>
          <p className="text-xs text-mutedDark">Passed forward directly between community members.</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Droplets className="w-5 h-5" />
          </div>
          <p className="font-display font-black text-3xl text-blue-900">
            {(impactStats.estWaterSavedLiters / 1000000).toFixed(2)}M L
          </p>
          <h3 className="font-bold text-xs text-blue-900 uppercase tracking-wider">Water Conserved</h3>
          <p className="text-xs text-mutedDark">Avoided water consumption from new garment manufacturing.</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
            <Cloud className="w-5 h-5" />
          </div>
          <p className="font-display font-black text-3xl text-amber-900">
            {impactStats.estCo2AvoidedKg.toLocaleString()} kg
          </p>
          <h3 className="font-bold text-xs text-amber-900 uppercase tracking-wider">CO2 Emissions Avoided</h3>
          <p className="text-xs text-mutedDark">Based on average lifecycle carbon footprint of new textiles.</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-soft space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-terracotta/10 text-terracotta flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <p className="font-display font-black text-3xl text-forest">
            {impactStats.peopleSupported.toLocaleString()}
          </p>
          <h3 className="font-bold text-xs text-forest uppercase tracking-wider">People Supported</h3>
          <p className="text-xs text-mutedDark">Students, teachers, job seekers, and families connected.</p>
        </div>
      </div>

      {/* INTERACTIVE CIRCULARITY CALCULATOR */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-soft-xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-leaf/10 text-leaf text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-4 h-4" />
              Interactive Impact Calculator
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-forest mt-2">
              Calculate your wardrobe's potential impact
            </h2>
          </div>
          <p className="text-xs text-mutedDark max-w-sm">
            Drag the slider to see how many garments you can give forward and their environmental savings.
          </p>
        </div>

        {/* Slider */}
        <div className="space-y-4 max-w-2xl bg-stone-50 p-6 rounded-3xl border border-stone-200/80">
          <div className="flex items-center justify-between text-sm font-bold text-forest">
            <span>Garments to Give:</span>
            <span className="text-2xl font-black text-leaf">{sliderVal} Clothes</span>
          </div>

          <input
            type="range"
            min="1"
            max="30"
            value={sliderVal}
            onChange={(e) => setSliderVal(Number(e.target.value))}
            className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-leaf"
          />

          <div className="flex justify-between text-[11px] text-stone-400 font-semibold">
            <span>1 item</span>
            <span>15 items</span>
            <span>30 items</span>
          </div>
        </div>

        {/* Dynamic Calculator Output Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-200 text-blue-950 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
              Water Conserved
            </span>
            <p className="font-display font-black text-2xl text-blue-900">{calcWater} Liters</p>
            <p className="text-[11px] text-blue-800">Equivalent to drinking water for over 3.5 years!</p>
          </div>

          <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
              CO2 Emissions Avoided
            </span>
            <p className="font-display font-black text-2xl text-amber-900">{calcCo2} kg CO2</p>
            <p className="text-[11px] text-amber-800">Equivalent to driving over 32 km in a petrol car.</p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
              Landfill Waste Diverted
            </span>
            <p className="font-display font-black text-2xl text-emerald-900">{calcWaste} kg</p>
            <p className="text-[11px] text-emerald-800">Keeps synthetic & cotton fibers out of local landfills.</p>
          </div>
        </div>
      </div>

      {/* METHODOLOGY TRANSPARENCY SECTION */}
      <div className="bg-stone-50 rounded-3xl p-8 border border-stone-200 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-forest text-white flex items-center justify-center font-bold">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-forest">How the numbers are calculated</h3>
            <p className="text-xs text-mutedDark">Transparent calculations based on published environmental benchmarks.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-neutralDark leading-relaxed">
          <div className="bg-white p-4 rounded-2xl border border-stone-200">
            <h4 className="font-bold text-forest mb-1">Water Footprint Source</h4>
            <p className="text-mutedDark">
              Calculated using the Water Footprint Network average benchmark of ~2,700 liters of water required to cultivate raw cotton and process one standard shirt.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200">
            <h4 className="font-bold text-forest mb-1">Carbon Emissions Source</h4>
            <p className="text-mutedDark">
              Based on WRAP (Waste & Resources Action Programme) data indicating ~8 kg of CO2 equivalent emissions avoided per kilogram of garment reused rather than manufactured fresh.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200">
            <h4 className="font-bold text-forest mb-1">Community Verification</h4>
            <p className="text-mutedDark">
              Impact counts increment automatically only when both the donor and requester confirm successful handover completion.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-leaf text-white rounded-3xl p-8 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-parchment">
          Be part of the next 1,000 garments reused.
        </h2>
        <Link
          to="/give"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-forest hover:bg-forest/90 text-white font-bold text-xs shadow-soft transition-all"
        >
          <span>Give Clothes Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
