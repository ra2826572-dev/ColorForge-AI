import React, { useState } from 'react';
import { GeneratedLayoutSystem } from '../../../types/colorforge';
import {
  ShoppingBag,
  Search,
  Heart,
  Star,
  Check,
  ArrowRight,
  Filter,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  X,
} from 'lucide-react';

interface PreviewProps {
  system: GeneratedLayoutSystem;
  fontFamily: string;
}

export const EcommercePreview: React.FC<PreviewProps> = ({ system, fontFamily }) => {
  const [cartCount, setCartCount] = useState(2);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Products');

  const c = system.colors;
  const d = system.analysis.derivedColors;
  const r = system.borderRadius;

  const categories = ['All Products', 'Apparel', 'Accessories', 'Footwear', 'Limited Drops'];

  const products = [
    {
      id: 1,
      name: 'Monolith Architectural Coat',
      category: 'Apparel',
      price: '$280',
      origPrice: '$340',
      badge: 'SALE 20%',
      rating: 4.9,
      reviews: 128,
    },
    {
      id: 2,
      name: 'Prism Aerospace Backpack',
      category: 'Accessories',
      price: '$165',
      badge: 'POPULAR',
      rating: 4.8,
      reviews: 94,
    },
    {
      id: 3,
      name: 'Vanguard Zero-Drop Trainers',
      category: 'Footwear',
      price: '$195',
      badge: 'NEW',
      rating: 5.0,
      reviews: 42,
    },
    {
      id: 4,
      name: 'Titanium Ceramic Chrono',
      category: 'Accessories',
      price: '$390',
      origPrice: '$450',
      badge: 'LIMITED',
      rating: 4.9,
      reviews: 67,
    },
  ];

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div
      style={{
        backgroundColor: c.background,
        color: c.text,
        fontFamily,
      }}
      className="w-full flex flex-col transition-colors duration-200 relative"
    >
      {/* Announcement Bar */}
      <div
        style={{
          backgroundColor: c.primary,
          color: '#FFFFFF',
        }}
        className="px-4 py-2 text-center text-xs font-semibold flex items-center justify-center gap-2"
      >
        <span>⚡ FLASH DROP: Free worldwide priority shipping on all orders over $150</span>
        <span className="underline cursor-pointer font-bold">Shop Collection</span>
      </div>

      {/* Main Navbar */}
      <header
        style={{
          backgroundColor: c.surface,
          borderBottom: `1px solid ${d.cardBorder}`,
        }}
        className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-6">
          <div className="font-black text-lg tracking-tight flex items-center gap-2">
            <div
              style={{ backgroundColor: c.primary, borderRadius: r }}
              className="w-7 h-7 flex items-center justify-center text-white text-xs font-bold"
            >
              {system.websiteName.charAt(0)}
            </div>
            <span>{system.websiteName}</span>
          </div>

          <div className="hidden lg:flex items-center gap-5 text-xs font-semibold" style={{ color: d.mutedText }}>
            {categories.map(cat => (
              <span
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="cursor-pointer transition-colors"
                style={{ color: selectedCategory === cat ? c.primary : undefined }}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Search & Cart Actions */}
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="h-3.5 w-3.5 absolute left-3 top-2.5" style={{ color: d.mutedText }} />
            <input
              type="text"
              placeholder="Search products..."
              style={{
                backgroundColor: d.inputBg,
                borderColor: d.inputBorder,
                color: c.text,
                borderRadius: r,
              }}
              className="pl-8 pr-3 py-1.5 text-xs border w-44 focus:outline-none"
            />
          </div>

          <button
            onClick={() => setCartDrawerOpen(true)}
            style={{
              backgroundColor: d.badgeBg,
              color: d.badgeText,
              borderRadius: r,
            }}
            className="p-2 relative flex items-center gap-1.5 text-xs font-bold transition-all hover:opacity-80"
          >
            <ShoppingBag className="h-4 w-4" />
            <span
              style={{ backgroundColor: c.accent, color: c.background }}
              className="w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
            >
              {cartCount}
            </span>
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <section
        style={{
          backgroundColor: d.subtleBg,
          borderBottom: `1px solid ${d.cardBorder}`,
        }}
        className="px-6 py-16 text-center sm:text-left max-w-6xl mx-auto w-full"
      >
        <div className="max-w-2xl">
          <span
            style={{
              backgroundColor: d.badgeBg,
              color: d.badgeText,
            }}
            className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider mb-4 inline-block"
          >
            Autumn/Winter 2026 Capsule
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight mb-4">
            Form Meets Function. <br />
            <span style={{ color: c.primary }}>Tailored For The Modern Era.</span>
          </h1>
          <p style={{ color: d.mutedText }} className="text-sm sm:text-base mb-8 max-w-lg leading-relaxed">
            Constructed with ultra-resilient weatherproof textiles and modular storage ergonomics.
          </p>
          <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
            <button
              style={{
                backgroundColor: c.primary,
                borderRadius: r,
              }}
              className="px-6 py-3 text-xs font-bold text-white shadow-lg hover:opacity-95 transition-all flex items-center gap-2"
            >
              <span>Explore Collection</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              style={{
                backgroundColor: c.surface,
                borderColor: d.cardBorder,
                borderRadius: r,
              }}
              className="px-6 py-3 text-xs font-semibold border hover:opacity-90 transition-all"
            >
              Lookbook 2026
            </button>
          </div>
        </div>
      </section>

      {/* Category Pills Bar */}
      <section className="px-6 py-8 max-w-6xl mx-auto w-full flex items-center justify-between border-b" style={{ borderColor: d.cardBorder }}>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                backgroundColor: selectedCategory === cat ? c.primary : c.surface,
                color: selectedCategory === cat ? '#FFFFFF' : c.text,
                borderColor: selectedCategory === cat ? c.primary : d.cardBorder,
                borderRadius: r,
              }}
              className="px-4 py-1.5 text-xs font-semibold border whitespace-nowrap transition-all shadow-sm"
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold" style={{ color: d.mutedText }}>
          <Filter className="h-3.5 w-3.5" />
          <span>Filters & Sort</span>
        </div>
      </section>

      {/* Product Grid */}
      <section className="px-6 py-12 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <div
              key={p.id}
              style={{
                backgroundColor: c.surface,
                borderColor: d.cardBorder,
                borderRadius: r,
              }}
              className="border p-4 flex flex-col justify-between group hover:border-indigo-500/50 transition-all shadow-sm"
            >
              {/* Product Mock Visual Box */}
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
                  className="w-16 h-16 rounded-full opacity-20 blur-xl absolute"
                />
                <span
                  style={{
                    backgroundColor: c.accent,
                    color: c.background,
                  }}
                  className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider"
                >
                  {p.badge}
                </span>
                <span className="text-xs font-bold opacity-60">Mock Asset #{p.id}</span>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span style={{ color: d.mutedText }} className="text-[11px] font-semibold">{p.category}</span>
                  <div className="flex items-center gap-1 font-bold text-[11px]" style={{ color: c.accent }}>
                    <Star className="h-3 w-3 fill-current" />
                    <span>{p.rating}</span>
                  </div>
                </div>

                <h3 className="font-bold text-sm mb-2 group-hover:text-indigo-400 transition-colors">
                  {p.name}
                </h3>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-black">{p.price}</span>
                  {p.origPrice && (
                    <span style={{ color: d.mutedText }} className="text-xs line-through">
                      {p.origPrice}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                style={{
                  backgroundColor: c.primary,
                  borderRadius: r,
                }}
                className="w-full py-2 text-xs font-bold text-white shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Add to Cart</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Store Features / Trust Bar */}
      <section
        style={{
          backgroundColor: d.subtleBg,
          borderTop: `1px solid ${d.cardBorder}`,
          borderBottom: `1px solid ${d.cardBorder}`,
        }}
        className="px-6 py-12"
      >
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <Truck className="h-6 w-6 mb-2" style={{ color: c.primary }} />
            <h4 className="font-bold text-sm mb-1">Complimentary Courier</h4>
            <p style={{ color: d.mutedText }} className="text-xs">Express doorstep tracking on orders over $150</p>
          </div>
          <div className="flex flex-col items-center">
            <ShieldCheck className="h-6 w-6 mb-2" style={{ color: c.secondary }} />
            <h4 className="font-bold text-sm mb-1">Lifetime Craft Warranty</h4>
            <p style={{ color: d.mutedText }} className="text-xs">Guaranteed waterproof seam and zipper endurance</p>
          </div>
          <div className="flex flex-col items-center">
            <RotateCcw className="h-6 w-6 mb-2" style={{ color: c.accent }} />
            <h4 className="font-bold text-sm mb-1">Hassle-Free 30-Day Returns</h4>
            <p style={{ color: d.mutedText }} className="text-xs">Pre-paid shipping labels included with every carton</p>
          </div>
        </div>
      </section>

      {/* Cart Drawer Mock */}
      {cartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
          <div
            style={{
              backgroundColor: c.surface,
              borderColor: d.cardBorder,
              color: c.text,
            }}
            className="w-full max-w-sm h-full p-6 flex flex-col justify-between border-l shadow-2xl"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: d.cardBorder }}>
                <div className="font-bold text-sm flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" style={{ color: c.primary }} />
                  <span>Cart ({cartCount} items)</span>
                </div>
                <button onClick={() => setCartDrawerOpen(false)} className="p-1 hover:opacity-70">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="py-6 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold">Monolith Architectural Coat</div>
                    <span style={{ color: d.mutedText }}>Size: Large &middot; Black</span>
                  </div>
                  <span className="font-bold">$280</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold">Prism Aerospace Backpack</div>
                    <span style={{ color: d.mutedText }}>One Size &middot; Slate</span>
                  </div>
                  <span className="font-bold">$165</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t" style={{ borderColor: d.cardBorder }}>
              <div className="flex items-center justify-between text-sm font-bold mb-4">
                <span>Subtotal</span>
                <span>$445.00</span>
              </div>
              <button
                style={{
                  backgroundColor: c.primary,
                  borderRadius: r,
                }}
                className="w-full py-3 text-xs font-bold text-white shadow-lg hover:opacity-95 transition-all"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        style={{
          borderTop: `1px solid ${d.cardBorder}`,
          backgroundColor: c.surface,
        }}
        className="px-6 py-8 text-center text-xs"
      >
        <p style={{ color: d.mutedText }}>
          &copy; {new Date().getFullYear()} {system.websiteName}. Generated with ColorForge AI.
        </p>
      </footer>
    </div>
  );
};
