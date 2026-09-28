import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Plus,
  ShieldCheck,
  Sparkles,
  MapPin,
  Share2,
  PackageCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { storageService } from '../services/storageService';
import {
  ClothingCategory,
  ClothingSize,
  ClothingCondition,
  ClothingGender,
  PickupMethod,
  ClothingListing
} from '../types';
import { TiltCard } from '../components/common/TiltCard';

// Stock sample photos for quick demo selection
const DEMO_PRESET_PHOTOS = [
  'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80'
];

export const GiveClothesPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, showToast, refreshListings } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ClothingCategory>('Shirts');
  const [size, setSize] = useState<ClothingSize>('M');
  const [condition, setCondition] = useState<ClothingCondition>('Like New');
  const [gender, setGender] = useState<ClothingGender>('Unisex');
  const [color, setColor] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [suitableFor, setSuitableFor] = useState('');
  const [donorNote, setDonorNote] = useState('');

  // Location & Handover
  const [city, setCity] = useState(currentUser.city || 'Pune');
  const [area, setArea] = useState(currentUser.area || 'Kothrud');
  const [pickupMethods, setPickupMethods] = useState<PickupMethod[]>([
    'Public Handover Point (Metro/Mall/Cafe)',
    'Community Drop-off Center'
  ]);

  const [createdListing, setCreatedListing] = useState<ClothingListing | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Trigger Confetti on completion
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // fallback
    }
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          if (images.length < 5) {
            setImages(prev => [...prev, reader.result as string]);
          }
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSelectPresetPhoto = (url: string) => {
    if (images.length < 5 && !images.includes(url)) {
      setImages(prev => [...prev, url]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Validation per step
  const validateStep1 = () => {
    // Images optional; fallback SVG used if empty
    return true;
  };

  const validateStep2 = () => {
    const err: Record<string, string> = {};
    if (!title.trim()) err.title = 'Title is required.';
    if (!description.trim()) err.description = 'Please provide a short description.';
    if (!color.trim()) err.color = 'Please specify the main garment color.';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const validateStep3 = () => {
    const err: Record<string, string> = {};
    if (!city.trim()) err.city = 'City is required.';
    if (!area.trim()) err.area = 'Locality/Area is required.';
    if (pickupMethods.length === 0) err.pickupMethods = 'Select at least one handover option.';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      setStep(4);
    }
  };

  const handlePublish = () => {
    try {
      const newListing = storageService.createListing({
        donorId: currentUser.id,
        donorName: currentUser.name,
        donorAvatar: currentUser.avatar,
        donorVerified: currentUser.verified,
        title: title.trim(),
        category,
        size,
        condition,
        gender,
        color: color.trim(),
        brand: brand.trim() || undefined,
        description: description.trim(),
        suitableFor: suitableFor.trim() || undefined,
        donorNote: donorNote.trim() || undefined,
        images: images.length > 0 ? images : [],
        city: city.trim(),
        area: area.trim(),
        pickupMethods
      });

      refreshListings();
      setCreatedListing(newListing);
      setStep(5);
      triggerConfetti();

      showToast({
        title: 'Listing Published Successfully!',
        message: `"${newListing.title}" is now available for neighbors in ${newListing.city}.`,
        type: 'success'
      });
    } catch {
      showToast({
        title: 'Error Publishing',
        message: 'Could not create listing. Please try again.',
        type: 'error'
      });
    }
  };

  const resetForm = () => {
    setImages([]);
    setTitle('');
    setDescription('');
    setColor('');
    setBrand('');
    setSuitableFor('');
    setDonorNote('');
    setStep(1);
    setCreatedListing(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Step Tracker */}
      {step < 5 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-leaf uppercase tracking-wider">
                Give Clothes Forward
              </span>
              <h1 className="font-display font-black text-2xl sm:text-3xl text-forest">
                Pass along clean pre-loved clothes
              </h1>
            </div>
            <span className="text-xs font-bold text-stone-500">Step {step} of 4</span>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { num: 1, label: 'Photos' },
              { num: 2, label: 'Details' },
              { num: 3, label: 'Handover' },
              { num: 4, label: 'Review' }
            ].map((s) => (
              <div key={s.num} className="space-y-1">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    step >= s.num ? 'bg-leaf' : 'bg-stone-200'
                  }`}
                />
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider block ${
                    step >= s.num ? 'text-forest' : 'text-stone-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 1: PHOTOS */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-soft space-y-6 animate-in fade-in">
          <div>
            <h2 className="font-display font-bold text-xl text-forest">Upload Photos of the Garment</h2>
            <p className="text-xs text-mutedDark mt-1">
              Upload clear photos or pick from sample clothing presets. (Max 5 photos)
            </p>
          </div>

          {/* Upload Drop Area */}
          <div className="border-2 border-dashed border-stone-300 hover:border-leaf rounded-3xl p-6 text-center bg-stone-50/70 transition-colors">
            <input
              type="file"
              accept="image/*"
              id="photo-upload"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="photo-upload"
              className="cursor-pointer flex flex-col items-center justify-center gap-2"
            >
              <div className="w-12 h-12 rounded-2xl bg-leaf/10 text-leaf flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-forest">Click to upload photo from your device</span>
              <span className="text-[11px] text-stone-400">Supports JPG, PNG, WEBP</span>
            </label>
          </div>

          {/* Selected photos list */}
          {images.length > 0 && (
            <div>
              <span className="text-xs font-bold text-forest block mb-2">
                Selected Photos ({images.length}/5)
              </span>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-stone-200 flex-shrink-0 group">
                    <img src={img} alt="Uploaded preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-forest/80 text-white hover:bg-rose-600 transition-colors"
                      title="Remove photo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stock Presets for instant testing */}
          <div>
            <span className="text-xs font-bold text-mutedDark uppercase tracking-wider block mb-2">
              Or Choose from Demo Wardrobe Presets (Click to add):
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {DEMO_PRESET_PHOTOS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPresetPhoto(preset)}
                  className="w-full aspect-square rounded-xl overflow-hidden border border-stone-200 hover:border-leaf hover:scale-105 transition-all"
                  title="Click to select"
                >
                  <img src={preset} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-forest hover:bg-forest/90 text-white text-xs font-bold shadow-soft transition-all"
            >
              <span>Continue to Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: DETAILS */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-soft space-y-6 animate-in fade-in">
          <div>
            <h2 className="font-display font-bold text-xl text-forest">Garment Details</h2>
            <p className="text-xs text-mutedDark mt-1">
              Accurate details help seekers find clothes that truly fit.
            </p>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                Item Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Olive Green Pure Cotton Oversized Shirt"
                className="w-full p-3 rounded-2xl border border-stone-200 text-xs text-neutralDark focus:outline-none focus:ring-2 focus:ring-leaf/40"
              />
              {errors.title && <p className="text-rose-600 text-[11px] mt-1">{errors.title}</p>}
            </div>

            {/* Category & Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full p-3 rounded-2xl border border-stone-200 bg-stone-50 text-xs text-neutralDark font-semibold focus:outline-none focus:ring-2 focus:ring-leaf/40"
                >
                  {[
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
                  ].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                  Size *
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value as any)}
                  className="w-full p-3 rounded-2xl border border-stone-200 bg-stone-50 text-xs text-neutralDark font-semibold focus:outline-none focus:ring-2 focus:ring-leaf/40"
                >
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Kids (0-2y)', 'Kids (3-6y)', 'Kids (7-12y)', 'Free Size'].map(
                    (s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            {/* Condition & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                  Condition *
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full p-3 rounded-2xl border border-stone-200 bg-stone-50 text-xs text-neutralDark font-semibold focus:outline-none focus:ring-2 focus:ring-leaf/40"
                >
                  <option value="Like New">Like New (Worn 1-2 times, flawless)</option>
                  <option value="Good">Good (Clean, well maintained)</option>
                  <option value="Gently Used">Gently Used (Minor normal wear)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                  Gender / Fit
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full p-3 rounded-2xl border border-stone-200 bg-stone-50 text-xs text-neutralDark font-semibold focus:outline-none focus:ring-2 focus:ring-leaf/40"
                >
                  {['Unisex', 'Women', 'Men', 'Kids'].map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Color & Brand */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                  Main Color *
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g. Olive Green, Navy Blue, Mustard"
                  className="w-full p-3 rounded-2xl border border-stone-200 text-xs text-neutralDark focus:outline-none focus:ring-2 focus:ring-leaf/40"
                />
                {errors.color && <p className="text-rose-600 text-[11px] mt-1">{errors.color}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                  Brand (Optional)
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. FabIndia, Zara, Marks & Spencer, Handloom"
                  className="w-full p-3 rounded-2xl border border-stone-200 text-xs text-neutralDark focus:outline-none focus:ring-2 focus:ring-leaf/40"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                Description *
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mention fabric, feel, fit, and cleanliness..."
                className="w-full p-3 rounded-2xl border border-stone-200 text-xs text-neutralDark focus:outline-none focus:ring-2 focus:ring-leaf/40 resize-none"
              />
              {errors.description && (
                <p className="text-rose-600 text-[11px] mt-1">{errors.description}</p>
              )}
            </div>

            {/* Suitable For & Why Giving */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                  Best Suited For (Optional)
                </label>
                <input
                  type="text"
                  value={suitableFor}
                  onChange={(e) => setSuitableFor(e.target.value)}
                  placeholder="e.g. College wear, Job interviews, Winter"
                  className="w-full p-3 rounded-2xl border border-stone-200 text-xs text-neutralDark focus:outline-none focus:ring-2 focus:ring-leaf/40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                  Why I'm Giving This (Optional)
                </label>
                <input
                  type="text"
                  value={donorNote}
                  onChange={(e) => setDonorNote(e.target.value)}
                  placeholder="e.g. Outgrew size, decluttering wardrobe"
                  className="w-full p-3 rounded-2xl border border-stone-200 text-xs text-neutralDark focus:outline-none focus:ring-2 focus:ring-leaf/40"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-forest"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-forest hover:bg-forest/90 text-white text-xs font-bold shadow-soft transition-all"
            >
              <span>Continue to Handover</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PICKUP & HANDOVER PREFERENCES */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-soft space-y-6 animate-in fade-in">
          <div>
            <h2 className="font-display font-bold text-xl text-forest">Handover & Location</h2>
            <p className="text-xs text-mutedDark mt-1">
              Your exact address is NEVER shared publicly. Only locality is shown.
            </p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                  City *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-stone-200 bg-stone-50 text-xs text-neutralDark font-semibold focus:outline-none focus:ring-2 focus:ring-leaf/40"
                >
                  {['Pune', 'Mumbai', 'Bengaluru', 'Delhi', 'Hyderabad', 'Chennai', 'Kolkata'].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-1.5">
                  Area / Locality *
                </label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Kothrud (Near Vanaz Metro)"
                  className="w-full p-3 rounded-2xl border border-stone-200 text-xs text-neutralDark focus:outline-none focus:ring-2 focus:ring-leaf/40"
                />
                {errors.area && <p className="text-rose-600 text-[11px] mt-1">{errors.area}</p>}
              </div>
            </div>

            {/* Pickup Methods */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-forest mb-2">
                Available Handover Methods *
              </label>
              <div className="space-y-2">
                {[
                  'Public Handover Point (Metro/Mall/Cafe)',
                  'Community Drop-off Center',
                  'Donor Pickup (Doorstep/Lobby)',
                  'Donor Willing to Deliver'
                ].map((method) => {
                  const isChecked = pickupMethods.includes(method as PickupMethod);
                  return (
                    <label
                      key={method}
                      className={`flex items-start gap-3 p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                        isChecked
                          ? 'border-leaf bg-leaf/5 text-forest font-semibold'
                          : 'border-stone-200 text-neutralDark hover:bg-stone-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPickupMethods(prev => [...prev, method as PickupMethod]);
                          } else {
                            setPickupMethods(prev => prev.filter(m => m !== method));
                          }
                        }}
                        className="rounded text-leaf focus:ring-leaf h-4 w-4 mt-0.5"
                      />
                      <span>{method}</span>
                    </label>
                  );
                })}
              </div>
              {errors.pickupMethods && (
                <p className="text-rose-600 text-[11px] mt-1">{errors.pickupMethods}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-forest"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-forest hover:bg-forest/90 text-white text-xs font-bold shadow-soft transition-all"
            >
              <span>Review Listing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: LIVE REVIEW & CONFIRMATION */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-soft space-y-6 animate-in fade-in">
          <div>
            <h2 className="font-display font-bold text-xl text-forest">Review Your Community Listing</h2>
            <p className="text-xs text-mutedDark mt-1">
              Verify how your garment will appear to neighbors in {city}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Live Preview Card */}
            <div className="md:col-span-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-mutedDark block mb-2">
                Card Preview:
              </span>
              <TiltCard className="bg-stone-50 rounded-3xl p-3 border border-stone-200 shadow-soft">
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-stone-200 mb-3">
                  {images[0] ? (
                    <img src={images[0]} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-stone-500 font-medium">
                      Illustrated Card Fallback
                    </div>
                  )}
                </div>
                <h4 className="font-display font-bold text-sm text-forest truncate">{title}</h4>
                <p className="text-xs text-mutedDark mt-0.5">{area}, {city}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-forest text-white">
                    {size}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-emerald-100 text-emerald-800">
                    {condition}
                  </span>
                </div>
              </TiltCard>
            </div>

            {/* Summary Details */}
            <div className="md:col-span-7 space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <div className="flex justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-mutedDark">Category:</span>
                  <span className="font-bold text-forest">{category}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-mutedDark">Color:</span>
                  <span className="font-bold text-forest">{color}</span>
                </div>
                {brand && (
                  <div className="flex justify-between border-b border-stone-200 pb-1.5">
                    <span className="text-mutedDark">Brand:</span>
                    <span className="font-bold text-forest">{brand}</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-mutedDark">Location:</span>
                  <span className="font-bold text-forest">{area}, {city}</span>
                </div>
                <div>
                  <span className="text-mutedDark block">Description:</span>
                  <p className="font-medium text-neutralDark mt-0.5">{description}</p>
                </div>
              </div>

              {/* Guidelines Confirmation Reminder */}
              <div className="p-3.5 rounded-2xl bg-leaf/10 border border-leaf/30 text-forest text-xs flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-leaf flex-shrink-0 mt-0.5" />
                <span>
                  By publishing, you confirm this garment is freshly cleaned, wearable, and ready for a respectful handover.
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-forest"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={handlePublish}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-leaf hover:bg-leaf/90 text-white text-xs font-bold shadow-soft transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish Listing Forward</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: PUBLISHED SUCCESS */}
      {step === 5 && createdListing && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-soft-xl text-center space-y-6 max-w-xl mx-auto animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-3xl bg-leaf/10 text-leaf flex items-center justify-center mx-auto">
            <PackageCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-leaf uppercase tracking-wider">
              Ready For Another Chapter
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-forest">
              Your clothes are ready to move forward.
            </h2>
            <p className="text-xs sm:text-sm text-mutedDark max-w-md mx-auto">
              "{createdListing.title}" has been listed in {createdListing.city}. You will receive a notification when someone nearby requests it.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={`/clothes/${createdListing.id}`}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-forest hover:bg-forest/90 text-white font-bold text-xs shadow-soft transition-all"
            >
              View Listing Live
            </Link>

            <button
              type="button"
              onClick={resetForm}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-forest font-bold text-xs transition-all"
            >
              Give Another Item
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
