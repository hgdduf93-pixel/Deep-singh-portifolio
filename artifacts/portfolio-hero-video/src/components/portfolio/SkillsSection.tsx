import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Code2,
  Layout,
  FileCode2,
  Layers,
  Smartphone,
  GitBranch,
  SmartphoneNfc,
  Calculator,
  GraduationCap,
  Bot,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAutoPingPongCarousel } from '../../hooks/useAutoPingPongCarousel';

interface Skill {
  name: string;
  category: 'Web' | 'Design' | 'Mobile' | 'Tools' | 'Software';
  description: string;
  icon: typeof Code2;
}

export function SkillsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const sectionRef = useRef<HTMLDivElement>(null);

  // Subtle 3D tilt on scroll through Z-space (gentle, no scroll blocking)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const dockZ = useTransform(scrollYProgress, [0, 0.35, 0.8], [-20, 0, 0]);
  const dockRotateX = useTransform(scrollYProgress, [0, 0.35, 0.8], [3, 0, 0]);
  const dockOpacity = useTransform(scrollYProgress, [0, 0.25, 0.8], [0.8, 1, 1]);

  const skills: Skill[] = [
    {
      name: 'HTML',
      category: 'Web',
      description: 'Semantic structure, media embedding and accessible markup.',
      icon: Code2,
    },
    {
      name: 'CSS',
      category: 'Web',
      description: 'Modern layouts, responsive styling and 3D transforms.',
      icon: Layout,
    },
    {
      name: 'JavaScript',
      category: 'Web',
      description: 'Interactive interfaces, DOM scripting and application logic.',
      icon: FileCode2,
    },
    {
      name: 'Web Design',
      category: 'Design',
      description: 'Contemporary typography, negative space and minimalist glass layouts.',
      icon: Layers,
    },
    {
      name: 'Responsive Design',
      category: 'Design',
      description: 'Fluid viewport scaling, touch-first ergonomics and mobile optimization.',
      icon: Smartphone,
    },
    {
      name: 'GitHub',
      category: 'Tools',
      description: 'Version control, repository workflows and open-source project management.',
      icon: GitBranch,
    },
    {
      name: 'Android WebView',
      category: 'Mobile',
      description: 'Embedding web engines into native mobile shells with hardware acceleration.',
      icon: SmartphoneNfc,
    },
    {
      name: 'Tally',
      category: 'Software',
      description: 'Computerized accounting, financial ledger management and business reporting.',
      icon: Calculator,
    },
    {
      name: 'ADCA',
      category: 'Software',
      description: 'Advanced Diploma in Computer Applications covering core systems and software.',
      icon: GraduationCap,
    },
    {
      name: 'AI Tools',
      category: 'Tools',
      description: 'Intelligent development tooling for rapid code refactoring, styling, and prototyping.',
      icon: Bot,
    },
  ];

  const filteredSkills =
    activeCategory === 'All'
      ? skills
      : skills.filter((s) => s.category === activeCategory);

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
    deps: [filteredSkills.length, activeCategory],
  });

  const categories = ['All', 'Web', 'Mobile', 'Design', 'Tools', 'Software'];

  return (
    <div
      ref={sectionRef}
      className="relative py-12 md:py-20 px-4 md:px-8 overflow-hidden select-none bg-transparent"
      style={{ perspective: '1600px' }}
      aria-label="Skills & Capabilities"
    >
      <div className="relative z-10 mx-auto max-w-7xl w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0.3, x: -30, rotateY: -3, scale: 0.98 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.08, margin: '60px 0px 60px 0px' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 gap-4 will-change-[transform,opacity]"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full glass-pill px-3.5 py-1 text-[11px] font-mono tracking-widest text-white uppercase mb-2.5 drop-shadow">
              <Sparkles className="h-3 w-3 text-white/90" />
              <span>SKILLS</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              Skills & Technologies
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-neutral-300 max-w-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
              Verified skills, web engineering disciplines, and software tools.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={!canScrollPrev}
              aria-label="Previous skill"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 border border-white/20 text-white transition-all hover:bg-white/20 hover:border-white/40 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-md shadow-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={!canScrollNext}
              aria-label="Next skill"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 border border-white/20 text-white transition-all hover:bg-white/20 hover:border-white/40 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-md shadow-md"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all shrink-0 ${
                activeCategory === cat
                  ? 'bg-white text-black font-semibold shadow-md'
                  : 'bg-black/30 text-neutral-300 hover:text-white hover:bg-white/10 border border-white/10 backdrop-blur-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Horizontal Skills Gallery with Seamless Ping-Pong Auto Loop */}
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
              {filteredSkills.map((skill, idx) => {
                const Icon = skill.icon;
                const isHovered = hoveredIndex === idx;

                return (
                  <motion.div
                    key={skill.name}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="perspective-1000 relative shrink-0 w-[clamp(240px,70vw,280px)] min-h-[200px] snap-center select-none cursor-pointer group flex flex-col justify-between"
                    initial={{
                      opacity: 0,
                      x: -90,
                      rotateY: -6,
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
                        : { repeat: Infinity, duration: 4.5 + (idx % 3) * 0.6, ease: 'easeInOut' },
                      opacity: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: (idx % 6) * 0.09 },
                      x: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: (idx % 6) * 0.09 },
                      rotateY: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: (idx % 6) * 0.09 },
                      z: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: (idx % 6) * 0.09 },
                    }}
                    style={{
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <div className="glass-dock relative h-full rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white shadow-sm group-hover:scale-105 transition-transform">
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-300 px-2 py-0.5 rounded-full bg-white/10 border border-white/10">
                            {skill.category}
                          </span>
                        </div>

                        <h3 className="font-display text-base sm:text-lg font-bold text-white mb-1.5 drop-shadow">
                          {skill.name}
                        </h3>

                        <p className="text-xs text-neutral-200 leading-relaxed drop-shadow line-clamp-3">
                          {skill.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-2.5 border-t border-white/10 flex items-center justify-between font-mono text-[10px] text-neutral-400">
                        <span>Proficiency</span>
                        <span className="text-emerald-400 font-medium">Applied Knowledge</span>
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
          {filteredSkills.map((s, idx) => (
            <button
              key={s.name}
              onClick={() => scrollToCard(idx)}
              aria-label={`Go to ${s.name}`}
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
