import React, { useState } from 'react';
import { GeneratedLayoutSystem } from '../../../types/colorforge';
import {
  Utensils,
  Clock,
  MapPin,
  Calendar,
  Star,
  CheckCircle,
  Wine,
  Coffee,
  Sparkles,
} from 'lucide-react';

interface PreviewProps {
  system: GeneratedLayoutSystem;
  fontFamily: string;
}

export const RestaurantPreview: React.FC<PreviewProps> = ({ system, fontFamily }) => {
  const [activeMenuTab, setActiveMenuTab] = useState<'tasting' | 'mains' | 'desserts' | 'cellar'>('tasting');
  const [bookingStep, setBookingStep] = useState(false);

  const c = system.colors;
  const d = system.analysis.derivedColors;
  const r = system.borderRadius;

  const menuItems = {
    tasting: [
      { name: 'Smoked Heirloom Tomato Tartare', desc: 'Fermented black garlic emulsion, crispy caper leaves, cold-pressed olive drizzle', price: '$26', tag: 'Chef Signature' },
      { name: 'Wild Foraged Morel Consommé', desc: 'Woodland mushrooms, pine needle infusion, gold leaf crisps', price: '$24', tag: 'Seasonal' },
      { name: 'Pan-Roasted Atlantic Halibut', desc: 'Parsnip mousseline, sea fennel, saffron beurre blanc', price: '$44', tag: 'Seafood' },
    ],
    mains: [
      { name: 'Dry-Aged Wagyu Striploin A5', desc: 'Charred baby leeks, bone marrow jus, truffle pomme purée', price: '$82', tag: 'Prime Cut' },
      { name: 'Heritage Duck Breast', desc: 'Blood orange reduction, caramelized chicory, spiced juniper crunch', price: '$48', tag: 'Farm To Table' },
      { name: 'Hand-Rolled Ricotta Cavatelli', desc: 'Black winter truffles, aged 36-month Parmigiano Reggiano broth', price: '$38', tag: 'Vegetarian' },
    ],
    desserts: [
      { name: 'Dark Valrhona Chocolate Crémeux', desc: 'Smoked sea salt caramel, roasted hazelnut feuilletine, espresso foam', price: '$19', tag: 'House Favorite' },
      { name: 'Meyer Lemon Verbena Soufflé', desc: 'Bourbon vanilla bean ice cream, candied citrus peel', price: '$18', tag: 'Seasonal' },
    ],
    cellar: [
      { name: 'Domaine de la Romanée-Conti 2018', desc: 'Grand Cru Burgundy, velvet tannins, black cherry notes', price: '$340', tag: 'Sommelier Choice' },
      { name: 'Château d’Yquem Sauternes 2015', desc: 'Honeyed apricot, candied citrus, crystalline finish', price: '$190', tag: 'Dessert Pairing' },
    ],
  };

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
        <div className="flex items-center gap-3">
          <Utensils className="h-5 w-5" style={{ color: c.primary }} />
          <span className="font-serif font-bold text-lg tracking-wide">{system.websiteName}</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold tracking-wider uppercase" style={{ color: d.mutedText }}>
          <span className="hover:text-white cursor-pointer" style={{ color: c.text }}>Menu</span>
          <span className="hover:text-white cursor-pointer">The Cellar</span>
          <span className="hover:text-white cursor-pointer">Private Dining</span>
          <span className="hover:text-white cursor-pointer">Story</span>
        </nav>

        <button
          onClick={() => setBookingStep(!bookingStep)}
          style={{
            backgroundColor: c.primary,
            borderRadius: r,
          }}
          className="px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all flex items-center gap-1.5"
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>Reserve Table</span>
        </button>
      </header>

      {/* Hero Atmosphere Banner */}
      <section className="px-6 py-20 max-w-5xl mx-auto w-full text-center">
        <span
          style={{
            backgroundColor: d.badgeBg,
            color: d.badgeText,
            borderColor: d.cardBorder,
          }}
          className="px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border mb-6 inline-block"
        >
          Michelin Recommended &middot; Season XXIV
        </span>

        <h1 className="text-4xl sm:text-6xl font-serif font-black tracking-tight leading-tight mb-6">
          Artisanal Gastronomy <br />
          <span style={{ color: c.primary }}>Rooted in Heritage.</span>
        </h1>

        <p style={{ color: d.mutedText }} className="text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-serif italic">
          &ldquo;Where seasonal terrestrial ingredients meet classical fire techniques and cellar craft.&rdquo;
        </p>

        <div className="flex items-center justify-center gap-4">
          <button
            style={{
              backgroundColor: c.primary,
              borderRadius: r,
            }}
            className="px-6 py-3 text-xs font-bold text-white shadow-xl hover:opacity-90 transition-all"
          >
            Explore Dinner Menu
          </button>
          <button
            style={{
              backgroundColor: c.surface,
              borderColor: d.cardBorder,
              borderRadius: r,
            }}
            className="px-6 py-3 text-xs font-semibold border hover:opacity-80 transition-all"
          >
            View Wine Portfolio
          </button>
        </div>
      </section>

      {/* Interactive Menu Section */}
      <section
        style={{
          backgroundColor: d.subtleBg,
          borderTop: `1px solid ${d.cardBorder}`,
          borderBottom: `1px solid ${d.cardBorder}`,
        }}
        className="px-6 py-16"
      >
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold tracking-tight mb-2">Curated Selections</h2>
            <p style={{ color: d.mutedText }} className="text-xs">Prepared daily with sustainable biodynamic farms</p>
          </div>

          {/* Menu Category Tabs */}
          <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
            {(['tasting', 'mains', 'desserts', 'cellar'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveMenuTab(tab)}
                style={{
                  backgroundColor: activeMenuTab === tab ? c.primary : c.surface,
                  color: activeMenuTab === tab ? '#FFFFFF' : c.text,
                  borderColor: activeMenuTab === tab ? c.primary : d.cardBorder,
                  borderRadius: r,
                }}
                className="px-4 py-1.5 text-xs font-bold capitalize border shadow-sm transition-all"
              >
                {tab === 'tasting' ? 'Tasting Menu' : tab}
              </button>
            ))}
          </div>

          {/* Menu Items List */}
          <div className="space-y-6">
            {menuItems[activeMenuTab].map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: c.surface,
                  borderColor: d.cardBorder,
                  borderRadius: r,
                }}
                className="p-5 border flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-base">{item.name}</h3>
                    <span
                      style={{
                        backgroundColor: d.badgeBg,
                        color: d.badgeText,
                      }}
                      className="px-2 py-0.5 rounded text-[10px] font-bold"
                    >
                      {item.tag}
                    </span>
                  </div>
                  <p style={{ color: d.mutedText }} className="text-xs mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
                <div className="font-serif font-bold text-base shrink-0" style={{ color: c.primary }}>
                  {item.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Opening Hours & Location Info */}
      <section className="px-6 py-16 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            style={{
              backgroundColor: c.surface,
              borderColor: d.cardBorder,
              borderRadius: r,
            }}
            className="p-8 border shadow-sm"
          >
            <Clock className="h-6 w-6 mb-3" style={{ color: c.primary }} />
            <h3 className="text-lg font-serif font-bold mb-4">Hours of Service</h3>
            <div className="space-y-2 text-xs" style={{ color: d.mutedText }}>
              <div className="flex justify-between"><span>Wednesday — Friday</span> <span className="font-bold text-white">5:30 PM — 11:00 PM</span></div>
              <div className="flex justify-between"><span>Saturday & Sunday</span> <span className="font-bold text-white">12:00 PM — 11:30 PM</span></div>
              <div className="flex justify-between"><span>Monday & Tuesday</span> <span className="italic">Closed for Cellar Sourcing</span></div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: c.surface,
              borderColor: d.cardBorder,
              borderRadius: r,
            }}
            className="p-8 border shadow-sm"
          >
            <MapPin className="h-6 w-6 mb-3" style={{ color: c.accent }} />
            <h3 className="text-lg font-serif font-bold mb-4">Location & Valet</h3>
            <p style={{ color: d.mutedText }} className="text-xs leading-relaxed mb-4">
              440 Hudson Street, West Village, New York, NY 10014 <br />
              Complimentary curbside valet service beginning at 5:00 PM daily.
            </p>
            <span style={{ color: c.primary }} className="text-xs font-bold underline cursor-pointer">
              Get Directions & Map &rarr;
            </span>
          </div>
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
          &copy; {new Date().getFullYear()} {system.websiteName}. Crafted with ColorForge AI.
        </p>
      </footer>
    </div>
  );
};
