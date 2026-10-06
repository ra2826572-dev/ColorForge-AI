import React, { useState } from 'react';
import { GeneratedLayoutSystem } from '../../../types/colorforge';
import {
  Heart,
  Phone,
  Calendar,
  ShieldCheck,
  Award,
  Clock,
  CheckCircle2,
  Activity,
  UserCheck,
} from 'lucide-react';

interface PreviewProps {
  system: GeneratedLayoutSystem;
  fontFamily: string;
}

export const HealthcarePreview: React.FC<PreviewProps> = ({ system, fontFamily }) => {
  const [appointmentBooked, setAppointmentBooked] = useState(false);
  const c = system.colors;
  const d = system.analysis.derivedColors;
  const r = system.borderRadius;

  return (
    <div
      style={{
        backgroundColor: c.background,
        color: c.text,
        fontFamily,
      }}
      className="w-full flex flex-col transition-colors duration-200"
    >
      {/* Emergency & Patient Hotline Top Bar */}
      <div
        style={{
          backgroundColor: c.primary,
          color: '#FFFFFF',
        }}
        className="px-6 py-2 text-xs font-semibold flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex items-center gap-2">
          <Phone className="h-3.5 w-3.5" />
          <span>24/7 Clinical Emergency Line: (800) 425-9920</span>
        </div>
        <div className="flex items-center gap-6">
          <span>Patient Portal Sign In</span>
          <span>Find an Urgent Care Clinic</span>
        </div>
      </div>

      {/* Main Nav */}
      <header
        style={{
          backgroundColor: c.surface,
          borderBottom: `1px solid ${d.cardBorder}`,
        }}
        className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div
            style={{ backgroundColor: c.primary, borderRadius: r }}
            className="w-8 h-8 flex items-center justify-center text-white"
          >
            <Activity className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg">{system.websiteName}</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold" style={{ color: d.mutedText }}>
          <span style={{ color: c.text }} className="cursor-pointer">Specialties</span>
          <span className="cursor-pointer">Physicians</span>
          <span className="cursor-pointer">Patient Care</span>
          <span className="cursor-pointer">Telehealth</span>
        </nav>

        <button
          style={{
            backgroundColor: c.primary,
            borderRadius: r,
          }}
          className="px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all flex items-center gap-1.5"
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>Book Consultation</span>
        </button>
      </header>

      {/* Hero Section */}
      <section className="px-6 pt-16 pb-12 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div
            style={{
              backgroundColor: d.badgeBg,
              color: d.badgeText,
              borderColor: d.cardBorder,
            }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold mb-6"
          >
            <ShieldCheck className="h-3.5 w-3.5" style={{ color: c.accent }} />
            <span>Joint Commission Accredited &middot; Top 1% Ranked</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
            Compassionate, Evidence-Based Medicine for Your Loved Ones.
          </h1>

          <p style={{ color: d.mutedText }} className="text-sm sm:text-base leading-relaxed mb-8">
            Access board-certified specialists, state-of-the-art diagnostic screening, and round-the-clock telehealth consultations with seamless electronic health records.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              style={{
                backgroundColor: c.primary,
                borderRadius: r,
              }}
              className="px-6 py-3.5 text-xs font-bold text-white shadow-xl hover:opacity-90 transition-all flex items-center gap-2"
            >
              <span>Schedule Initial Visit</span>
              <Calendar className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: d.mutedText }}>
              <UserCheck className="h-4 w-4" style={{ color: c.accent }} />
              <span>Accepting 98% of major insurance plans</span>
            </div>
          </div>
        </div>

        {/* Appointment Card */}
        <div
          style={{
            backgroundColor: c.surface,
            borderColor: d.cardBorder,
            borderRadius: r,
            boxShadow: `0 16px 40px ${d.shadowRgba}`,
          }}
          className="p-6 border shadow-xl"
        >
          <h3 className="text-lg font-bold mb-1">Instant Appointment Reservation</h3>
          <p style={{ color: d.mutedText }} className="text-xs mb-6">Select clinical specialty and preferred time slot</p>

          {appointmentBooked ? (
            <div
              style={{
                backgroundColor: d.badgeBg,
                color: d.badgeText,
                borderColor: d.cardBorder,
                borderRadius: r,
              }}
              className="p-6 border text-center space-y-2"
            >
              <CheckCircle2 className="h-8 w-8 mx-auto" style={{ color: c.primary }} />
              <div className="font-bold text-sm">Consultation Reserved!</div>
              <p className="text-xs">Confirmation dispatched to your registered SMS and email address.</p>
            </div>
          ) : (
            <form
              onSubmit={e => {
                e.preventDefault();
                setAppointmentBooked(true);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1" style={{ color: d.mutedText }}>Clinical Department</label>
                <select
                  style={{ backgroundColor: d.inputBg, borderColor: d.inputBorder, color: c.text, borderRadius: r }}
                  className="w-full px-3 py-2 border focus:outline-none"
                >
                  <option>Cardiovascular & Heart Health</option>
                  <option>Neurology & Brain Sciences</option>
                  <option>Pediatric & Family Medicine</option>
                  <option>Orthopedics & Sports Medicine</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1" style={{ color: d.mutedText }}>Preferred Date</label>
                  <input
                    type="date"
                    defaultValue="2026-10-15"
                    style={{ backgroundColor: d.inputBg, borderColor: d.inputBorder, color: c.text, borderRadius: r }}
                    className="w-full px-3 py-2 border focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1" style={{ color: d.mutedText }}>Preferred Time</label>
                  <select
                    style={{ backgroundColor: d.inputBg, borderColor: d.inputBorder, color: c.text, borderRadius: r }}
                    className="w-full px-3 py-2 border focus:outline-none"
                  >
                    <option>09:30 AM (Morning)</option>
                    <option>01:15 PM (Afternoon)</option>
                    <option>04:45 PM (Evening)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: c.primary,
                  borderRadius: r,
                }}
                className="w-full py-3 font-bold text-white shadow-md hover:opacity-90 transition-all mt-4"
              >
                Confirm Booking Request
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Clinical Specialties Grid */}
      <section
        style={{
          backgroundColor: d.subtleBg,
          borderTop: `1px solid ${d.cardBorder}`,
          borderBottom: `1px solid ${d.cardBorder}`,
        }}
        className="px-6 py-16"
      >
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">Center of Clinical Excellence</h2>
            <p style={{ color: d.mutedText }} className="text-xs">Equipped with robotic surgical suites and precision imaging</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Cardiology & Vascular', desc: 'Minimally invasive valve replacement, electrophysiology, and preventative care.', doctors: '14 Specialists' },
              { name: 'Neurological Sciences', desc: 'Comprehensive stroke center, neuro-oncology, and advanced cognitive therapy.', doctors: '9 Specialists' },
              { name: 'Pediatrics & Neonatal', desc: 'Dedicated pediatric ICU, family-centered suites, and genetic screening.', doctors: '18 Specialists' },
            ].map((spec, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: c.surface,
                  borderColor: d.cardBorder,
                  borderRadius: r,
                }}
                className="p-6 border shadow-sm"
              >
                <div
                  style={{ backgroundColor: d.badgeBg, color: c.primary }}
                  className="w-10 h-10 rounded-lg flex items-center justify-center font-bold mb-4"
                >
                  <Heart className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-base mb-2">{spec.name}</h3>
                <p style={{ color: d.mutedText }} className="text-xs leading-relaxed mb-4">{spec.desc}</p>
                <span style={{ color: c.accent }} className="text-[11px] font-bold">{spec.doctors} &rarr;</span>
              </div>
            ))}
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
          &copy; {new Date().getFullYear()} {system.websiteName} Health Systems. Generated with ColorForge AI.
        </p>
      </footer>
    </div>
  );
};
