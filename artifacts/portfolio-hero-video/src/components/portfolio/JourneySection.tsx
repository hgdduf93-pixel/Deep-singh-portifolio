import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { useAutoPingPongCarousel } from '../../hooks/useAutoPingPongCarousel';

interface Milestone {
  period: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
}

export function JourneySection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Subtle 3D tilt on scroll through Z-space (gentle, no scroll blocking)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const dockZ = useTransform(scrollYProgress, [0, 0.35, 0.8], [-20, 0, 0]);
  const dockRotateX = useTransform(scrollYProgress, [0, 0.35, 0.8], [3, 0, 0]);
  const dockOpacity = useTransform(scrollYProgress, [0, 0.25, 0.8], [0.8, 1, 1]);

  const milestones: Milestone[] = [
    {
      period: 'Foundation',
      title: 'COMPUTER & SOFTWARE FOUNDATIONS',
      subtitle: 'Computer & Software Basics',
      description: 'Exploration of computer systems, software utilities, operating systems, and computational principles.',
      tag: 'Computing Basics',
    },
    {
      period: 'Certification',
      title: 'TALLY & ADCA',
      subtitle: 'Formal Software Qualification',
      description: 'Completed the Advanced Diploma in Computer Applications (ADCA) alongside Tally accounting systems.',
      tag: 'Certified ADCA & Tally',
    },
    {
      period: 'Web Engineering',
      title: 'WEB DEVELOPMENT',
      subtitle: 'HTML5, CSS3 & JavaScript',
      description: 'Mastered semantic layouts, canvas rendering algorithms, responsive styling, and modern DOM programming.',
      tag: 'Web Engineering',
    },
    {
      period: 'Game Launch',
      title: 'GSD CRASH',
      subtitle: 'Interactive Odds Game',
      description: 'Engineered an interactive browser game featuring dynamic odds curve calculations and 60 FPS HTML5 Canvas animation.',
      tag: 'Independent Build',
    },
    {
      period: 'Mobile Bridge',
      title: 'GSD CRASH ANDROID WEBVIEW',
      subtitle: 'Web-to-Mobile Architecture',
      description: 'Ported the high-speed web engine into a hardware-accelerated native Android mobile shell.',
      tag: 'Mobile Port',
    },
    {
      period: 'Android Utility',
      title: 'MUDRIX BY GSD',
      subtitle: 'Personal Expense Tracker',
      description: 'Engineered an offline-first Android application in Kotlin to track personal expenses with glassmorphic visuals.',
      tag: 'Kotlin & Android',
    },
    {
      period: 'Present',
      title: 'CURRENT FOCUS',
      subtitle: 'Interactive Software & Web',
      description: 'Crafting motion-driven digital products, interactive systems, and continuous software development.',
      tag: 'Present',
    },
  ];

  const {
    viewportRef,
    trackRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
    handlePrev,
    handleNext,
    scrollToCard,
    canScrollPrev,
    canScrollNext,
    currentIndex,
  } = useAutoPingPongCarousel({
    deps: [milestones.length],
  });

  return (
    <div
      ref={sectionRef}
      className="relative py-12 md:py-20 px-4 md:px-8 overflow-hidden select-none bg-transparent"
      style={{ perspective: '1600px' }}
      aria-label="My Journey"
    >
      <div className="relative z-10 mx-auto max-w-7xl w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0.3, x: 30, rotateY: 3, scale: 0.98 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.08, margin: '60px 0px 60px 0px' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 gap-4 will-change-[transform,opacity]"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full glass-pill px-3.5 py-1 text-[11px] font-mono tracking-widest text-white uppercase mb-2.5 drop-shadow">
              <Sparkles className="h-3 w-3 text-white/90" />
              <span>MY JOURNEY</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              My Journey
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-neutral-300 max-w-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
              Chronological milestones from foundational certifications to independent software creation.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={!canScrollPrev}
              aria-label="Previous milestone"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 border border-white/20 text-white transition-all hover:bg-white/20 hover:border-white/40 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-md shadow-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={!canScrollNext}
              aria-label="Next milestone"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 border border-white/20 text-white transition-all hover:bg-white/20 hover:border-white/40 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-md shadow-md"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Horizontal Journey Gallery with Seamless Ping-Pong Auto Loop */}
        <motion.div
          style={{
            z: dockZ,
            rotateX: dockRotateX,
            opacity: dockOpacity,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full"
        >
          <div
            ref={viewportRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            className="w-full overflow-hidden dock-scroll-container py-4 md:py-6 px-1 sm:px-4 touch-pan-y select-none cursor-grab active:cursor-grabbing"
            style={{
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <div
              ref={trackRef}
              className="flex items-stretch gap-4 sm:gap-5 will-change-transform"
              style={{
                transformStyle: 'preserve-3d',
                willChange: 'transform',
              }}
            >
              {milestones.map((m, idx) => {
                const isHovered = hoveredIndex === idx;

                return (
                  <motion.div
                    key={m.title}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="perspective-1000 relative shrink-0 w-[clamp(260px,75vw,310px)] min-h-[250px] snap-center select-none cursor-pointer group flex flex-col justify-between"
                    initial={{
                      opacity: 0,
                      x: 90,
                      rotateY: 7,
                      z: -40,
                      scale: 0.94,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                      rotateY: 0,
                      z: 0,
                      scale: 1,
                    }}
                    viewport={{ once: true, amount: 0.1 }}
                    animate={{
                      scale: isHovered ? 1.025 : 1,
                      y: isHovered ? -5 : [0, -3, 0],
                    }}
                    transition={{
                      scale: { type: 'spring', damping: 24, stiffness: 260 },
                      y: isHovered
                        ? { duration: 0.25 }
                        : { repeat: Infinity, duration: 4.8 + (idx % 3) * 0.7, ease: 'easeInOut' },
                      opacity: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: (idx % 5) * 0.1 },
                      x: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: (idx % 5) * 0.1 },
                      rotateY: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: (idx % 5) * 0.1 },
                      z: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: (idx % 5) * 0.1 },
                    }}
                    style={{
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <div className="glass-dock relative h-full rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-1.5 font-mono text-xs text-neutral-300">
                            <Calendar className="h-3.5 w-3.5 text-white/80" />
                            <span>{m.period}</span>
                          </div>
                          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-mono text-white border border-white/15">
                            {m.tag}
                          </span>
                        </div>

                        <h3 className="font-display text-base sm:text-lg font-bold text-white mb-0.5 drop-shadow">
                          {m.title}
                        </h3>
                        <h4 className="font-mono text-xs text-neutral-300 mb-2">
                          {m.subtitle}
                        </h4>

                        <p className="text-xs text-neutral-200 leading-relaxed drop-shadow line-clamp-3">
                          {m.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-neutral-400">
                        <span>Step 0{idx + 1} of 0{milestones.length}</span>
                        <span className="text-emerald-400 font-medium">Completed</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Pagination Indicators */}
        <div className="mt-4 flex items-center justify-center gap-1.5">
          {milestones.map((m, idx) => (
            <button
              key={m.title}
              onClick={() => scrollToCard(idx)}
              aria-label={`Go to ${m.title}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentIndex === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
