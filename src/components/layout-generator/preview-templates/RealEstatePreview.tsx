import React, { useState } from 'react';
import { GeneratedLayoutSystem } from '../../../types/colorforge';
import {
  Home,
  Search,
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Heart,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface PreviewProps {
  system: GeneratedLayoutSystem;
  fontFamily: string;
}

export const RealEstatePreview: React.FC<PreviewProps> = ({ system, fontFamily }) => {
  const [favoriteId, setFavoriteId] = useState<number | null>(1);
  const c = system.colors;
  const d = system.analysis.derivedColors;
  const r = system.borderRadius;

  const listings = [
    {
      id: 1,
      title: 'The Glass Pavilion Penthouse',
      location: 'TriBeCa, New York',
      price: '$8,450,000',
      beds: 4,
      baths: 4.5,
      sqft: '4,820 sqft',
      tag: 'EXCLUSIVE',
    },
    {
      id: 2,
      title: 'Bel Air Architectural Oasis',
      location: 'Los Angeles, California',
      price: '$12,900,000',
      beds: 6,
      baths: 8,
      sqft: '8,400 sqft',
      tag: 'NEW LISTING',
    },
    {
      id: 3,
      title: 'Biscayne Bay Waterfront Villa',
      location: 'Miami Beach, Florida',
      price: '$6,750,000',
      beds: 5,
      baths: 5,
      sqft: '5,200 sqft',
      tag: 'FEATURED',
    },
  ];

  return (
    <div
      style={{
        backgroundColor: c.background,
        color: c.text,
        fontFamily,
      }}
      className="w-full flex flex-col transition-colors duration-200"
    >
      {/* Top Header */}
      <header
        style={{
          backgroundColor: c.surface,
          borderBottom: `1px solid ${d.cardBorder}`,
        }}
        className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3 font-serif font-black text-lg">
          <div
            style={{ backgroundColor: c.primary, borderRadius: r }}
            className="w-8 h-8 flex items-center justify-center text-white"
          >
            <Home className="h-4 w-4" />
          </div>
          <span>{system.websiteName}</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold" style={{ color: d.mutedText }}>
          <span style={{ color: c.text }} className="cursor-pointer">Portfolio</span>
          <span className="cursor-pointer">Neighborhoods</span>
          <span className="cursor-pointer">Private Estates</span>
          <span className="cursor-pointer">Advisory</span>
        </nav>

        <button
          style={{
            backgroundColor: c.primary,
            borderRadius: r,
          }}
          className="px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all flex items-center gap-1.5"
        >
          <span>Schedule Private Tour</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </header>

      {/* Hero Section */}
      <section className="px-6 pt-16 pb-12 max-w-5xl mx-auto w-full text-center">
        <span
          style={{
            backgroundColor: d.badgeBg,
            color: d.badgeText,
            borderColor: d.cardBorder,
          }}
          className="px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border mb-6 inline-block"
        >
          Prime Architectural Residences &middot; Global Portfolio
        </span>

        <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight leading-tight mb-6">
          Exceptional Living <br />
          <span style={{ color: c.primary }}>Curated for the Discerning.</span>
        </h1>

        <p style={{ color: d.mutedText }} className="text-base max-w-xl mx-auto mb-10 leading-relaxed font-serif">
          Representing landmark residential estates, historic penthouses, and private coastal sanctuaries.
        </p>

        {/* Property Search Filter Card */}
        <div
          style={{
            backgroundColor: c.surface,
            borderColor: d.cardBorder,
            borderRadius: r,
            boxShadow: `0 16px 40px ${d.shadowRgba}`,
          }}
          className="p-4 border shadow-xl flex flex-col sm:flex-row items-center gap-3 text-left"
        >
          <div className="flex-1 w-full">
            <span className="text-[10px] font-bold uppercase block mb-1" style={{ color: d.mutedText }}>Location</span>
            <input
              type="text"
              defaultValue="TriBeCa, New York, NY"
              style={{ backgroundColor: d.inputBg, borderColor: d.inputBorder, color: c.text, borderRadius: r }}
              className="w-full px-3 py-1.5 text-xs border focus:outline-none"
            />
          </div>

          <div className="w-full sm:w-44">
            <span className="text-[10px] font-bold uppercase block mb-1" style={{ color: d.mutedText }}>Property Type</span>
            <select
              style={{ backgroundColor: d.inputBg, borderColor: d.inputBorder, color: c.text, borderRadius: r }}
              className="w-full px-3 py-1.5 text-xs border focus:outline-none"
            >
              <option>Penthouse</option>
              <option>Historic Brownstone</option>
              <option>Coastal Villa</option>
            </select>
          </div>

          <div className="w-full sm:w-44">
            <span className="text-[10px] font-bold uppercase block mb-1" style={{ color: d.mutedText }}>Price Range</span>
            <select
              style={{ backgroundColor: d.inputBg, borderColor: d.inputBorder, color: c.text, borderRadius: r }}
              className="w-full px-3 py-1.5 text-xs border focus:outline-none"
            >
              <option>$5M — $10M</option>
              <option>$10M — $25M</option>
              <option>$25M+</option>
            </select>
          </div>

          <button
            style={{
              backgroundColor: c.primary,
              borderRadius: r,
            }}
            className="w-full sm:w-auto px-5 py-3 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shrink-0 mt-3 sm:mt-4"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search Estates</span>
          </button>
        </div>
      </section>

      {/* Featured Properties Showcase */}
      <section className="px-6 py-12 max-w-6xl mx-auto w-full">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-serif font-bold tracking-tight">Curated Showcase</h2>
            <p style={{ color: d.mutedText }} className="text-xs">Hand-selected by our senior private wealth broker network</p>
          </div>
          <span style={{ color: c.accent }} className="text-xs font-bold cursor-pointer">View All 18 Listings &rarr;</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {listings.map(item => (
            <div
              key={item.id}
              style={{
                backgroundColor: c.surface,
                borderColor: d.cardBorder,
                borderRadius: r,
              }}
              className="border p-4 flex flex-col justify-between group hover:border-indigo-500/50 transition-all shadow-sm"
            >
              {/* Photo Box Placeholder */}
              <div
                style={{
                  backgroundColor: d.subtleBg,
                  borderRadius: r,
                  border: `1px solid ${d.cardBorder}`,
                }}
                className="h-48 w-full flex items-center justify-center relative overflow-hidden mb-4"
              >
                <div
                  style={{ backgroundColor: c.primary }}
                  className="w-20 h-20 rounded-full opacity-20 blur-xl absolute"
                />
                <span
                  style={{ backgroundColor: c.accent, color: c.background }}
                  className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold"
                >
                  {item.tag}
                </span>
                <button
                  onClick={() => setFavoriteId(favoriteId === item.id ? null : item.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-black/40 text-white hover:scale-110 transition-transform"
                >
                  <Heart className={`h-3.5 w-3.5 ${favoriteId === item.id ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
                <span className="text-xs font-serif font-bold opacity-60">Estate Canvas #{item.id}</span>
              </div>

              <div>
                <div className="font-serif font-black text-xl mb-1" style={{ color: c.primary }}>
                  {item.price}
                </div>
                <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                <div className="flex items-center gap-1 text-xs mb-4" style={{ color: d.mutedText }}>
                  <MapPin className="h-3 w-3" />
                  <span>{item.location}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-t text-[11px]" style={{ borderColor: d.cardBorder, color: d.mutedText }}>
                  <div className="flex items-center gap-1"><Bed className="h-3.5 w-3.5" /> <span>{item.beds} Beds</span></div>
                  <div className="flex items-center gap-1"><Bath className="h-3.5 w-3.5" /> <span>{item.baths} Baths</span></div>
                  <div className="flex items-center gap-1"><Maximize2 className="h-3.5 w-3.5" /> <span>{item.sqft}</span></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: `1px solid ${d.cardBorder}`,
          backgroundColor: c.surface,
        }}
        className="px-6 py-8 text-center text-xs"
      >
        <p style={{ color: d.mutedText }}>
          &copy; {new Date().getFullYear()} {system.websiteName} Real Estate International. Generated with ColorForge AI.
        </p>
      </footer>
    </div>
  );
};
