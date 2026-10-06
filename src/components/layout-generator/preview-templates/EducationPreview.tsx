import React, { useState } from 'react';
import { GeneratedLayoutSystem } from '../../../types/colorforge';
import {
  GraduationCap,
  BookOpen,
  Award,
  Star,
  Users,
  Clock,
  ArrowRight,
  CheckCircle,
  Video,
} from 'lucide-react';

interface PreviewProps {
  system: GeneratedLayoutSystem;
  fontFamily: string;
}

export const EducationPreview: React.FC<PreviewProps> = ({ system, fontFamily }) => {
  const [enrolledCourse, setEnrolledCourse] = useState<string | null>(null);
  const c = system.colors;
  const d = system.analysis.derivedColors;
  const r = system.borderRadius;

  const courses = [
    {
      title: 'Full-Stack Design Systems Architecture',
      instructor: 'Dr. Evelyn Ward',
      rating: 4.95,
      students: '4,280 students',
      duration: '12 Weeks &middot; 48 Hours',
      level: 'Advanced',
      price: '$490',
    },
    {
      title: 'Generative AI & WebGPU Shaders',
      instructor: 'Alex Thorne',
      rating: 4.92,
      students: '2,940 students',
      duration: '8 Weeks &middot; 32 Hours',
      level: 'Intermediate',
      price: '$390',
    },
    {
      title: 'Accessible WCAG AAA Engineering for Web',
      instructor: 'Maya Lin',
      rating: 4.98,
      students: '6,100 students',
      duration: '6 Weeks &middot; 24 Hours',
      level: 'All Levels',
      price: '$290',
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
      {/* Top Banner */}
      <div
        style={{
          backgroundColor: c.primary,
          color: '#FFFFFF',
        }}
        className="px-6 py-2 text-xs font-semibold flex items-center justify-center gap-2"
      >
        <span>🎓 Fall Term Admissions Open: Apply for 50% Need-Based Diversity Scholarships</span>
        <span className="underline cursor-pointer font-bold">Apply Now</span>
      </div>

      {/* Main Nav */}
      <header
        style={{
          backgroundColor: c.surface,
          borderBottom: `1px solid ${d.cardBorder}`,
        }}
        className="sticky top-0 z-30 px-6 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3 font-bold text-lg">
          <div
            style={{ backgroundColor: c.primary, borderRadius: r }}
            className="w-8 h-8 flex items-center justify-center text-white"
          >
            <GraduationCap className="h-5 w-5" />
          </div>
          <span>{system.websiteName}</span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold" style={{ color: d.mutedText }}>
          <span style={{ color: c.text }} className="cursor-pointer">Programs</span>
          <span className="cursor-pointer">Faculty</span>
          <span className="cursor-pointer">Corporate Training</span>
          <span className="cursor-pointer">Career Outcomes</span>
        </nav>

        <button
          style={{
            backgroundColor: c.primary,
            borderRadius: r,
          }}
          className="px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all flex items-center gap-1.5"
        >
          <span>Student Portal</span>
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
          className="px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border mb-6 inline-block"
        >
          Accredited Professional Academy &middot; 94% Placement Rate
        </span>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight mb-6">
          Master Modern Engineering <br />
          <span style={{ color: c.primary }}>With World-Class Mentors.</span>
        </h1>

        <p style={{ color: d.mutedText }} className="text-sm sm:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
          Intensive cohorts, 1-on-1 code reviews with staff engineers, and real portfolio capstones that land senior roles.
        </p>

        <div className="flex items-center justify-center gap-4 mb-12">
          <button
            style={{
              backgroundColor: c.primary,
              borderRadius: r,
            }}
            className="px-6 py-3.5 text-xs font-bold text-white shadow-xl hover:opacity-90 transition-all"
          >
            Browse All Cohorts
          </button>
          <button
            style={{
              backgroundColor: c.surface,
              borderColor: d.cardBorder,
              borderRadius: r,
            }}
            className="px-6 py-3.5 text-xs font-semibold border hover:opacity-80 transition-all"
          >
            Download Syllabus PDF
          </button>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t" style={{ borderColor: d.cardBorder }}>
          <div>
            <div className="text-3xl font-black mb-1" style={{ color: c.primary }}>$142,000</div>
            <span style={{ color: d.mutedText }} className="text-xs">Average Graduate Starting Salary</span>
          </div>
          <div>
            <div className="text-3xl font-black mb-1" style={{ color: c.accent }}>94.2%</div>
            <span style={{ color: d.mutedText }} className="text-xs">Hired Within 120 Days</span>
          </div>
          <div>
            <div className="text-3xl font-black mb-1">1:8</div>
            <span style={{ color: d.mutedText }} className="text-xs">Staff Mentor to Student Ratio</span>
          </div>
        </div>
      </section>

      {/* Courses Catalog */}
      <section
        style={{
          backgroundColor: d.subtleBg,
          borderTop: `1px solid ${d.cardBorder}`,
          borderBottom: `1px solid ${d.cardBorder}`,
        }}
        className="px-6 py-16"
      >
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Upcoming Cohort Programs</h2>
              <p style={{ color: d.mutedText }} className="text-xs">Live interactive video sessions with real industry projects</p>
            </div>
            <span style={{ color: c.accent }} className="text-xs font-bold cursor-pointer">View All 16 Tracks &rarr;</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((course, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: c.surface,
                  borderColor: d.cardBorder,
                  borderRadius: r,
                }}
                className="p-6 border flex flex-col justify-between shadow-sm group hover:border-indigo-500/50 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span
                      style={{
                        backgroundColor: d.badgeBg,
                        color: d.badgeText,
                      }}
                      className="px-2 py-0.5 rounded text-[10px] font-bold"
                    >
                      {course.level}
                    </span>
                    <div className="flex items-center gap-1 font-bold text-[11px]" style={{ color: c.accent }}>
                      <Star className="h-3 w-3 fill-current" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  <h3 className="font-bold text-base mb-2 group-hover:text-indigo-400 transition-colors">
                    {course.title}
                  </h3>

                  <div className="text-xs mb-4" style={{ color: d.mutedText }}>
                    Led by <span className="font-semibold text-white">{course.instructor}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs mb-6" style={{ color: d.mutedText }}>
                    <div className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> <span>{course.duration}</span></div>
                  </div>
                </div>

                <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: d.cardBorder }}>
                  <span className="text-lg font-black">{course.price}</span>
                  <button
                    onClick={() => setEnrolledCourse(course.title)}
                    style={{
                      backgroundColor: enrolledCourse === course.title ? c.secondary : c.primary,
                      borderRadius: r,
                    }}
                    className="px-4 py-2 text-xs font-bold text-white shadow-md hover:opacity-90 transition-all"
                  >
                    {enrolledCourse === course.title ? 'Applied!' : 'Apply Now'}
                  </button>
                </div>
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
          &copy; {new Date().getFullYear()} {system.websiteName} Academy. Generated with ColorForge AI.
        </p>
      </footer>
    </div>
  );
};
