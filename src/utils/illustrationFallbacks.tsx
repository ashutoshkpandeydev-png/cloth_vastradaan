import React from 'react';
import { ClothingCategory } from '../types';

interface IllustratedGarmentProps {
  category: ClothingCategory;
  color?: string;
  className?: string;
}

export const IllustratedGarment: React.FC<IllustratedGarmentProps> = ({
  category,
  color = '#5C8D63',
  className = 'w-full h-full'
}) => {
  // Map color names to safe hex or subtle themes
  const getGarmentColor = () => {
    const c = (color || '').toLowerCase();
    if (c.includes('blue') || c.includes('denim')) return { fill: '#3B82F6', stroke: '#1E40AF', bg: '#EFF6FF' };
    if (c.includes('olive') || c.includes('green') || c.includes('sage')) return { fill: '#5C8D63', stroke: '#233E26', bg: '#F2F8F3' };
    if (c.includes('cream') || c.includes('beige') || c.includes('white') || c.includes('khaki')) return { fill: '#D8B56A', stroke: '#926F28', bg: '#FAF6ED' };
    if (c.includes('black') || c.includes('charcoal') || c.includes('dark')) return { fill: '#334155', stroke: '#0F172A', bg: '#F1F5F9' };
    if (c.includes('maroon') || c.includes('red') || c.includes('terracotta') || c.includes('pink') || c.includes('rust')) return { fill: '#D9785B', stroke: '#9C442B', bg: '#FCF4F1' };
    if (c.includes('navy')) return { fill: '#1E3A8A', stroke: '#0F172A', bg: '#EEF2FF' };
    if (c.includes('yellow') || c.includes('mustard') || c.includes('gold')) return { fill: '#EAB308', stroke: '#854D0E', bg: '#FEFCE8' };
    if (c.includes('purple') || c.includes('violet') || c.includes('lavender')) return { fill: '#8B5CF6', stroke: '#5B21B6', bg: '#F5F3FF' };
    return { fill: '#5C8D63', stroke: '#233E26', bg: '#F2F8F3' };
  };

  const theme = getGarmentColor();

  const renderIcon = () => {
    switch (category) {
      case 'T-shirts':
        return (
          <svg viewBox="0 0 100 100" className="w-2/3 h-2/3 drop-shadow-md transition-transform duration-300 group-hover:scale-105">
            <path
              d="M30 20 L40 28 Q50 32 60 28 L70 20 L92 34 L82 48 L74 42 L74 82 Q74 85 70 85 L30 85 Q26 85 26 82 L26 42 L18 48 L8 34 Z"
              fill={theme.fill}
              stroke={theme.stroke}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path d="M40 28 Q50 34 60 28" fill="none" stroke={theme.stroke} strokeWidth="2" />
            <line x1="26" y1="42" x2="74" y2="42" stroke="#ffffff" strokeOpacity="0.25" strokeWidth="1.5" />
          </svg>
        );

      case 'Shirts':
        return (
          <svg viewBox="0 0 100 100" className="w-2/3 h-2/3 drop-shadow-md transition-transform duration-300 group-hover:scale-105">
            <path
              d="M30 18 L44 26 L50 20 L56 26 L70 18 L92 32 L82 46 L74 40 L74 84 L26 84 L26 40 L18 46 L8 32 Z"
              fill={theme.fill}
              stroke={theme.stroke}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Collar & Buttons */}
            <path d="M44 26 L50 36 L56 26" fill="#ffffff" fillOpacity="0.3" stroke={theme.stroke} strokeWidth="2" />
            <line x1="50" y1="36" x2="50" y2="84" stroke={theme.stroke} strokeWidth="2" strokeDasharray="1 5" />
            <circle cx="50" cy="45" r="1.5" fill="#ffffff" />
            <circle cx="50" cy="55" r="1.5" fill="#ffffff" />
            <circle cx="50" cy="65" r="1.5" fill="#ffffff" />
            <circle cx="50" cy="75" r="1.5" fill="#ffffff" />
            {/* Pocket */}
            <rect x="32" y="44" width="10" height="12" rx="2" fill="none" stroke={theme.stroke} strokeWidth="1.5" />
          </svg>
        );

      case 'Jeans':
      case 'Trousers':
        return (
          <svg viewBox="0 0 100 100" className="w-2/3 h-2/3 drop-shadow-md transition-transform duration-300 group-hover:scale-105">
            <path
              d="M26 20 L74 20 L72 86 L53 86 L50 44 L47 86 L28 86 Z"
              fill={theme.fill}
              stroke={theme.stroke}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Belt loops & Pockets */}
            <line x1="26" y1="26" x2="74" y2="26" stroke={theme.stroke} strokeWidth="2" />
            <path d="M30 26 C36 34 38 40 40 40" fill="none" stroke={theme.stroke} strokeWidth="1.5" />
            <path d="M70 26 C64 34 62 40 60 40" fill="none" stroke={theme.stroke} strokeWidth="1.5" />
            <line x1="50" y1="26" x2="50" y2="44" stroke={theme.stroke} strokeWidth="2" />
          </svg>
        );

      case 'Kurtis':
        return (
          <svg viewBox="0 0 100 100" className="w-2/3 h-2/3 drop-shadow-md transition-transform duration-300 group-hover:scale-105">
            <path
              d="M34 16 L44 24 Q50 26 56 24 L66 16 L84 28 L78 40 L72 36 L76 86 L54 86 L54 62 L46 62 L46 86 L24 86 L28 36 L22 40 L16 28 Z"
              fill={theme.fill}
              stroke={theme.stroke}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Neckline embroidery detail */}
            <path d="M44 24 C44 38 56 38 56 24" fill="none" stroke="#D8B56A" strokeWidth="2" />
            <line x1="50" y1="36" x2="50" y2="52" stroke="#D8B56A" strokeWidth="2" />
            <circle cx="50" cy="42" r="1.5" fill="#D8B56A" />
            <circle cx="50" cy="48" r="1.5" fill="#D8B56A" />
          </svg>
        );

      case 'Sarees':
        return (
          <svg viewBox="0 0 100 100" className="w-2/3 h-2/3 drop-shadow-md transition-transform duration-300 group-hover:scale-105">
            {/* Flowing Pallu & Pleats */}
            <path
              d="M30 24 Q50 18 70 24 L78 86 Q50 82 22 86 Z"
              fill={theme.fill}
              stroke={theme.stroke}
              strokeWidth="2.5"
            />
            {/* Zari border */}
            <path d="M22 80 Q50 76 78 80 L78 86 Q50 82 22 86 Z" fill="#D8B56A" />
            {/* Diagonal Pallu drape */}
            <path
              d="M26 28 Q44 42 74 32 L68 18 Q40 26 26 28 Z"
              fill="#D8B56A"
              fillOpacity="0.85"
              stroke={theme.stroke}
              strokeWidth="1.5"
            />
            {/* Pleat lines */}
            <line x1="42" y1="46" x2="42" y2="80" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.5" />
            <line x1="50" y1="42" x2="50" y2="80" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.5" />
            <line x1="58" y1="48" x2="58" y2="80" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="1.5" />
          </svg>
        );

      case 'Dresses':
        return (
          <svg viewBox="0 0 100 100" className="w-2/3 h-2/3 drop-shadow-md transition-transform duration-300 group-hover:scale-105">
            <path
              d="M36 18 Q50 24 64 18 L60 38 Q50 42 40 38 Z"
              fill={theme.fill}
              stroke={theme.stroke}
              strokeWidth="2.5"
            />
            <path
              d="M40 38 Q50 42 60 38 L82 86 Q50 82 18 86 Z"
              fill={theme.fill}
              stroke={theme.stroke}
              strokeWidth="2.5"
            />
            {/* Belt */}
            <path d="M38 38 Q50 42 62 38" fill="none" stroke="#D8B56A" strokeWidth="3" />
            <circle cx="50" cy="40" r="3" fill="#D8B56A" />
          </svg>
        );

      case 'Jackets':
      case 'Sweaters':
        return (
          <svg viewBox="0 0 100 100" className="w-2/3 h-2/3 drop-shadow-md transition-transform duration-300 group-hover:scale-105">
            <path
              d="M32 18 L50 26 L68 18 L92 34 L82 50 L74 44 L74 84 L26 84 L26 44 L18 50 L8 34 Z"
              fill={theme.fill}
              stroke={theme.stroke}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Zipper / Cardigan line */}
            <line x1="50" y1="26" x2="50" y2="84" stroke="#D8B56A" strokeWidth="2.5" />
            <path d="M34 20 L50 26 L66 20" fill="none" stroke={theme.stroke} strokeWidth="3" />
            {/* Pockets */}
            <rect x="30" y="58" width="12" height="14" rx="2" fill="none" stroke={theme.stroke} strokeWidth="1.5" />
            <rect x="58" y="58" width="12" height="14" rx="2" fill="none" stroke={theme.stroke} strokeWidth="1.5" />
          </svg>
        );

      case 'Kidswear':
        return (
          <svg viewBox="0 0 100 100" className="w-2/3 h-2/3 drop-shadow-md transition-transform duration-300 group-hover:scale-105">
            {/* Cute Dungarees/Romper */}
            <path
              d="M34 26 L42 26 L42 40 L58 40 L58 26 L66 26 L66 42 L72 42 L68 78 L54 78 L50 56 L46 78 L32 78 L28 42 L34 42 Z"
              fill={theme.fill}
              stroke={theme.stroke}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Buttons & Pocket */}
            <circle cx="38" cy="30" r="2" fill="#D8B56A" />
            <circle cx="62" cy="30" r="2" fill="#D8B56A" />
            <rect x="44" y="44" width="12" height="10" rx="2" fill="none" stroke={theme.stroke} strokeWidth="1.5" />
            {/* Star/Heart accent */}
            <path d="M50 48 L51 51 L54 51 L51.5 53 L52.5 56 L50 54 L47.5 56 L48.5 53 L46 51 L49 51 Z" fill="#D8B56A" />
          </svg>
        );

      case 'Footwear':
        return (
          <svg viewBox="0 0 100 100" className="w-2/3 h-2/3 drop-shadow-md transition-transform duration-300 group-hover:scale-105">
            <path
              d="M18 58 Q22 46 36 44 L54 44 Q62 50 78 52 L84 64 L16 64 Z"
              fill={theme.fill}
              stroke={theme.stroke}
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Sole */}
            <rect x="14" y="64" width="72" height="8" rx="3" fill="#ffffff" stroke={theme.stroke} strokeWidth="2" />
            {/* Laces */}
            <line x1="42" y1="46" x2="52" y2="46" stroke="#ffffff" strokeWidth="2" />
            <line x1="44" y1="50" x2="54" y2="50" stroke="#ffffff" strokeWidth="2" />
            <line x1="46" y1="54" x2="56" y2="54" stroke="#ffffff" strokeWidth="2" />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 100 100" className="w-2/3 h-2/3 drop-shadow-md transition-transform duration-300 group-hover:scale-105">
            {/* Cloth parcel / folded garment */}
            <rect x="24" y="28" width="52" height="44" rx="6" fill={theme.fill} stroke={theme.stroke} strokeWidth="2.5" />
            <line x1="24" y1="46" x2="76" y2="46" stroke="#D8B56A" strokeWidth="3" />
            <line x1="50" y1="28" x2="50" y2="72" stroke="#D8B56A" strokeWidth="3" />
            <circle cx="50" cy="46" r="5" fill="#D8B56A" stroke={theme.stroke} strokeWidth="1.5" />
          </svg>
        );
    }
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden rounded-2xl select-none ${className}`}
      style={{ backgroundColor: theme.bg }}
    >
      {/* Background subtle geometric texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: `radial-gradient(${theme.stroke} 1px, transparent 1px)`,
        backgroundSize: '16px 16px'
      }} />

      {/* Illustrated Garment Vector */}
      <div className="relative z-10 flex items-center justify-center w-full h-full p-4">
        {renderIcon()}
      </div>

      {/* Category Pill Tag */}
      <div className="absolute bottom-3 px-3 py-1 text-xs font-semibold rounded-full glass-tag text-forest shadow-sm z-10">
        {category} • {color || 'Community Wardrobe'}
      </div>
    </div>
  );
};
