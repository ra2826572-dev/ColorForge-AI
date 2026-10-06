import React, { useState } from 'react';
import { GeneratedLayoutSystem } from '../../../types/colorforge';
import {
  BookOpen,
  Search,
  Bookmark,
  Clock,
  ArrowRight,
  TrendingUp,
  Share2,
  Check,
} from 'lucide-react';

interface PreviewProps {
  system: GeneratedLayoutSystem;
  fontFamily: string;
}

export const BlogPreview: React.FC<PreviewProps> = ({ system, fontFamily }) => {
  const [subscribed, setSubscribed] = useState(false);
  const [bookmarkedId, setBookmarkedId] = useState<number | null>(null);

  const c = system.colors;
  const d = system.analysis.derivedColors;
  const r = system.borderRadius;

  const posts = [
    {
      id: 1,
      title: 'The Mathematics of Visual Balance: How Luminance Dictates UI Legibility',
      category: 'Design Systems',
      readTime: '6 min read',
      date: 'May 14, 2026',
      author: 'Elena Rostova',
      summary: 'Exploring how non-linear human eye perception shifts across dark canvases and how color spaces like OKLCH fix legacy RGB skew.',
    },
    {
      id: 2,
      title: 'Zero-Runtime Token Pipelines in Enterprise Monorepos',
      category: 'Architecture',
      readTime: '8 min read',
      date: 'May 11, 2026',
      author: 'Marcus Vance',
      summary: 'A deep dive into compiling design tokens straight to AST transforms without client-side CSS-in-JS overhead.',
    },
    {
      id: 3,
      title: 'Accessibility Debt: The Hidden Cost of Low-Contrast Dark Modes',
      category: 'Accessibility',
      readTime: '5 min read',
      date: 'May 08, 2026',
      author: 'Sophia Chen',
      summary: 'Why 42% of modern dark interfaces fail basic WCAG AA guidelines and automated formulas to remediate contrast.',
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
      {/* Editorial Header */}
      <header
        style={{
          backgroundColor: c.surface,
          borderBottom: `1px solid ${d.cardBorder}`,
        }}
        className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <BookOpen className="h-5 w-5" style={{ color: c.primary }} />
          <span className="font-serif font-black text-xl tracking-tight">{system.websiteName}</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold" style={{ color: d.mutedText }}>
          <span className="hover:text-white cursor-pointer" style={{ color: c.text }}>All Articles</span>
          <span className="hover:text-white cursor-pointer">Engineering</span>
          <span className="hover:text-white cursor-pointer">Design Systems</span>
          <span className="hover:text-white cursor-pointer">Case Studies</span>
        </nav>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="h-3.5 w-3.5 absolute left-3 top-2.5" style={{ color: d.mutedText }} />
            <input
              type="text"
              placeholder="Search journals..."
              style={{
                backgroundColor: d.inputBg,
                borderColor: d.inputBorder,
                color: c.text,
                borderRadius: r,
              }}
              className="pl-8 pr-3 py-1.5 text-xs border w-40 focus:outline-none"
            />
          </div>
          <button
            style={{
              backgroundColor: c.primary,
              borderRadius: r,
            }}
            className="px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:opacity-90 transition-all"
          >
            Subscribe
          </button>
        </div>
      </header>

      {/* Featured Headline Hero */}
      <section className="px-6 py-14 max-w-5xl mx-auto w-full">
        <div
          style={{
            backgroundColor: c.surface,
            borderColor: d.cardBorder,
            borderRadius: r,
          }}
          className="p-8 sm:p-12 border shadow-sm relative overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-4">
            <span
              style={{
                backgroundColor: c.primary,
                color: '#FFFFFF',
              }}
              className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider"
            >
              Featured Dispatch
            </span>
            <span style={{ color: d.mutedText }} className="text-xs">May 16, 2026 &middot; 7 min read</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight leading-tight mb-4">
            The Algorithmic Future of Chromatic Design Systems
          </h1>

          <p style={{ color: d.mutedText }} className="text-sm sm:text-base max-w-2xl mb-8 leading-relaxed">
            How artificial neural generators and mathematical perceptual models are transforming UI palette creation from subjective trial-and-error into provably accessible engineering science.
          </p>

          <div className="flex items-center justify-between pt-6 border-t" style={{ borderColor: d.cardBorder }}>
            <div className="flex items-center gap-3 text-xs">
              <div
                style={{ backgroundColor: c.accent, color: c.background }}
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
              >
                DR
              </div>
              <div>
                <div className="font-bold">Dr. David Reynolds</div>
                <span style={{ color: d.mutedText }} className="text-[11px]">Director of Interface Intelligence</span>
              </div>
            </div>

            <button
              style={{
                backgroundColor: c.primary,
                borderRadius: r,
              }}
              className="px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all flex items-center gap-1.5"
            >
              <span>Read Journal</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="px-6 py-10 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-serif font-bold tracking-tight">Recent Dispatches</h2>
          <span style={{ color: c.accent }} className="text-xs font-bold cursor-pointer">Browse Archive &rarr;</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map(post => (
            <div
              key={post.id}
              style={{
                backgroundColor: c.surface,
                borderColor: d.cardBorder,
                borderRadius: r,
              }}
              className="p-6 border flex flex-col justify-between group hover:border-indigo-500/50 transition-all shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span
                    style={{
                      backgroundColor: d.badgeBg,
                      color: d.badgeText,
                    }}
                    className="px-2 py-0.5 rounded text-[10px] font-bold"
                  >
                    {post.category}
                  </span>
                  <button
                    onClick={() => setBookmarkedId(bookmarkedId === post.id ? null : post.id)}
                    className="p-1 hover:opacity-70 transition-opacity"
                  >
                    <Bookmark
                      className="h-3.5 w-3.5"
                      style={{
                        fill: bookmarkedId === post.id ? c.primary : 'none',
                        color: bookmarkedId === post.id ? c.primary : d.mutedText,
                      }}
                    />
                  </button>
                </div>

                <h3 className="font-serif font-bold text-base mb-2 group-hover:text-indigo-400 transition-colors">
                  {post.title}
                </h3>

                <p style={{ color: d.mutedText }} className="text-xs leading-relaxed mb-6">
                  {post.summary}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-4 border-t" style={{ borderColor: d.cardBorder, color: d.mutedText }}>
                <span>{post.author}</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter Signup Box */}
      <section
        style={{
          backgroundColor: d.subtleBg,
          borderTop: `1px solid ${d.cardBorder}`,
          borderBottom: `1px solid ${d.cardBorder}`,
        }}
        className="px-6 py-16"
      >
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-serif font-bold mb-2">Join 28,000+ Design Engineers</h2>
          <p style={{ color: d.mutedText }} className="text-xs mb-6">
            Get our weekly deep dives into design token automation and visual accessibility delivered to your inbox.
          </p>

          {subscribed ? (
            <div
              style={{
                backgroundColor: d.badgeBg,
                color: d.badgeText,
                borderColor: d.cardBorder,
                borderRadius: r,
              }}
              className="p-4 border text-xs font-bold flex items-center justify-center gap-2"
            >
              <Check className="h-4 w-4" style={{ color: c.primary }} />
              <span>You're subscribed! Next dispatch arrives Tuesday morning.</span>
            </div>
          ) : (
            <form
              onSubmit={e => {
                e.preventDefault();
                setSubscribed(true);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="email"
                required
                placeholder="developer@company.com"
                style={{
                  backgroundColor: d.inputBg,
                  borderColor: d.inputBorder,
                  color: c.text,
                  borderRadius: r,
                }}
                className="flex-1 px-3.5 py-2.5 text-xs border focus:outline-none"
              />
              <button
                type="submit"
                style={{
                  backgroundColor: c.primary,
                  borderRadius: r,
                }}
                className="px-5 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
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
          &copy; {new Date().getFullYear()} {system.websiteName} Journal. Generated with ColorForge AI.
        </p>
      </footer>
    </div>
  );
};
