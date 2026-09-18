import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, User, Code2, Compass, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAutoPingPongCarousel } from '../../hooks/useAutoPingPongCarousel';

interface AboutPanel {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  meta: { label: string; value: string }[];
  icon: typeof User;
}

export function AboutSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Subtle depth adjustment on scroll through Z-space (gentle, no jarring movement)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const dockZ = useTransform(scrollYProgress, [0, 0.35, 0.8], [-20, 0, 0]);
  const dockRotateX = useTransform(scrollYProgress, [0, 0.35, 0.8], [3, 0, 0]);
  const dockOpacity = useTransform(scrollYProgress, [0, 0.25, 0.8], [0.8, 1, 1]);

  // Strictly genuine creator profile information
  const panels: AboutPanel[] = [
    {
      id: 'about-me',
      badge: 'Identity',
      title: 'About Me',
      subtitle: 'Independent Creator & Builder',
      description:
        "Hi, I'm Deep Singh — an independent software builder based in India. I approach software from a hands-on perspective, experimenting directly with code to build responsive digital interfaces, games, and mobile tools.",
      details: [
        'Advanced Diploma in Computer Applications (ADCA)',
        'Certified computerized accounting systems with Tally',
        'Focused on interactive web interfaces & mobile applications',
      ],
      meta: [
        { label: 'Role', value: 'Developer & Creator' },
        { label: 'Status', value: 'Active Building' },
        { label: 'Location', value: 'India' },
      ],
      icon: User,
    },
    {
      id: 'what-i-build',
      badge: 'Creations',
      title: 'What I Build',
      subtitle: 'Interactive Web & Mobile Software',
      description:
        'My projects center around real-time interactive experiences, responsive user interfaces, and mobile wrappers. From high-speed Canvas games to native Android utility applications.',
      details: [
        'GSD CRASH: 60 FPS HTML5 Canvas trajectory browser game',
        'GSD CRASH Android: Hardware-accelerated mobile WebView bridge',
        'MUDRIX: Android personal expense organizer & financial tracker',
      ],
      meta: [
        { label: 'Core Builds', value: 'GSD CRASH • MUDRIX' },
        { label: 'Platforms', value: 'Web & Android' },
        { label: 'Graphics', value: 'HTML5 Canvas 60fps' },
      ],
      icon: Code2,
    },
    {
      id: 'my-approach',
      badge: 'Philosophy',
      title: 'My Approach',
      subtitle: 'Pragmatic & Performance-Driven',
      description:
        'I believe in learning by constructing functional systems rather than absorbing abstract theory. Every build focuses on clean semantic markup, tactile interactions, and zero-bloat performance.',
      details: [
        'Zero-mock commitment: Real code, authentic links, working loops',
        'Mobile-first design: Optimized touch targets for Android viewports',
        'Modular, maintainable code architectures',
      ],
      meta: [
        { label: 'Method', value: 'Learning by Building' },
        { label: 'Design', value: 'Modern UI' },
        { label: 'Tooling', value: 'HTML, JS, Kotlin, Git' },
      ],
      icon: Compass,
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
    baseSpeed: { mobile: 40, desktop: 48 },
    deps: [panels.length],
  });

  return (
    <div
      ref={sectionRef}
      className="relative py-12 md:py-20 px-4 md:px-8 overflow-hidden select-none bg-transparent"
      style={{ perspective: '1600px' }}
      aria-label="About Deep Singh"
    >
      <div className="relative z-10 mx-auto max-w-7xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT SIDE: Heading & Profile Introduction */}
          <motion.div
            initial={{ opacity: 0.3, x: 30, rotateY: 3, scale: 0.98 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.08, margin: '60px 0px 60px 0px' }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4 flex flex-col justify-between text-left will-change-[transform,opacity]"
          >
            <div>
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 rounded-full glass-pill px-3.5 py-1 text-[11px] font-mono tracking-widest text-white uppercase mb-3.5 drop-shadow">
                <Sparkles className="h-3 w-3 text-white/90" />
                <span>ABOUT</span>
              </div>

              {/* Headline */}
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
                WHO I AM
              </h2>

              {/* Short Professional Introduction */}
              <p className="mt-4 text-sm sm:text-base text-neutral-200 leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
                I'm Deep Singh — an independent creator focused on building modern digital experiences, websites, Android applications and interactive projects.
              </p>

              {/* Factual credential tags */}
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white font-mono text-xs shadow-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  ADCA Certified
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white font-mono text-xs shadow-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Tally Qualified
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-white font-mono text-xs shadow-sm">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Android Developer
                </span>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={handlePrev}
                disabled={!canScrollPrev}
                aria-label="Previous about card"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 border border-white/20 text-white transition-all hover:bg-white/20 hover:border-white/40 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-md shadow-md"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNext}
                disabled={!canScrollNext}
                aria-label="Next about card"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 border border-white/20 text-white transition-all hover:bg-white/20 hover:border-white/40 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-md shadow-md"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          {/* RIGHT SIDE: Responsive Horizontal Gallery with Ping-Pong Auto Loop */}
          <div className="lg:col-span-8 overflow-hidden w-full">
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
                className="w-full overflow-hidden dock-scroll-container py-4 md:py-6 px-1 sm:px-2 touch-pan-y select-none cursor-grab active:cursor-grabbing"
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
                  {panels.map((panel, idx) => {
                    const isHovered = hoveredIndex === idx;

                    return (
                      <motion.div
                        key={panel.id}
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        onClick={() => scrollToCard(idx)}
                        className="perspective-1000 relative shrink-0 w-[clamp(270px,78vw,320px)] min-h-[360px] snap-center select-none cursor-pointer group flex flex-col justify-between"
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
                            : { repeat: Infinity, duration: 4.8 + idx * 0.8, ease: 'easeInOut' },
                          opacity: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: idx * 0.11 },
                          x: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: idx * 0.11 },
                          rotateY: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: idx * 0.11 },
                          z: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: idx * 0.11 },
                        }}
                        style={{
                          transformStyle: 'preserve-3d',
                        }}
                      >
                        <div className="glass-dock relative h-full rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between">
                          <div>
                            {/* Top badge & Icon */}
                            <div className="flex items-center justify-between mb-3.5">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/15 text-white shadow-sm group-hover:scale-105 transition-transform">
                                <panel.icon className="h-5 w-5" />
                              </div>
                              <span className="font-mono text-[10px] tracking-wider text-neutral-300 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 uppercase">
                                {panel.badge}
                              </span>
                            </div>

                            {/* Title & Subtitle */}
                            <h3 className="font-display text-lg sm:text-xl font-bold text-white mb-0.5 drop-shadow">
                              {panel.title}
                            </h3>
                            <div className="font-mono text-xs text-red-300 mb-2.5 flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                              <span>{panel.subtitle}</span>
                            </div>

                            {/* Description */}
                            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed mb-4 drop-shadow">
                              {panel.description}
                            </p>

                            {/* Factual bullet details */}
                            <ul className="space-y-1.5 mb-4">
                              {panel.details.map((detail) => (
                                <li key={detail} className="flex items-start gap-2 text-xs text-neutral-300 drop-shadow">
                                  <span className="mt-1 h-1 w-1 rounded-full bg-red-400 shrink-0" />
                                  <span className="leading-snug">{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Metadata Footer */}
                          <div className="pt-3 border-t border-white/10 grid grid-cols-3 gap-2">
                            {panel.meta.map((m) => (
                              <div key={m.label} className="text-left">
                                <span className="block font-mono text-[9px] uppercase tracking-wider text-neutral-400">
                                  {m.label}
                                </span>
                                <span className="block font-mono text-[11px] font-medium text-white truncate">
                                  {m.value}
                                </span>
                              </div>
                            ))}
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
              {panels.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => scrollToCard(idx)}
                  aria-label={`Go to ${p.title}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
