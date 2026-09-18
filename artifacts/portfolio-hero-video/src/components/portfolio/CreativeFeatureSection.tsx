import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Globe, Gamepad2, Smartphone, Layout, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface FloatingCard {
  id: string;
  title: string;
  tag: string;
  description: string;
  depthZ: number;
  icon: typeof Globe;
}

export function CreativeFeatureSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [scrollIndex, setScrollIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.98, 1.01, 0.98]);
  const opacity = useTransform(scrollYProgress, [0.05, 0.3, 0.75, 0.95], [0.75, 1, 1, 0.75]);
  const rotateX = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [3, 0, -3]);

  const cards: FloatingCard[] = [
    {
      id: 'web-projects',
      title: 'Web Projects',
      tag: 'Interactive Web',
      description: 'Semantic architectures, responsive state machines, and real-time canvas interfaces.',
      depthZ: 25,
      icon: Globe,
    },
    {
      id: 'games',
      title: 'Games',
      tag: 'HTML5 Canvas',
      description: '60 FPS browser animation loops with deterministic trajectory physics algorithms.',
      depthZ: 45,
      icon: Gamepad2,
    },
    {
      id: 'mobile-apps',
      title: 'Mobile Apps',
      tag: 'Android & Kotlin',
      description: 'Native mobile architectures and hardware-accelerated WebView bridge implementations.',
      depthZ: 35,
      icon: Smartphone,
    },
    {
      id: 'creative-ui',
      title: 'Creative UI',
      tag: 'Creative Interfaces',
      description: 'Tactile interaction systems, fluid motion, and editorial visual typography.',
      depthZ: 40,
      icon: Layout,
    },
  ];

  const scrollToIndex = (idx: number) => {
    const nextIdx = Math.max(0, Math.min(cards.length - 1, idx));
    setScrollIndex(nextIdx);
    if (galleryRef.current) {
      const container = galleryRef.current;
      const card = container.children[nextIdx] as HTMLElement | undefined;
      if (card) {
        const left = card.offsetLeft - (container.clientWidth - card.clientWidth) / 2;
        container.scrollTo({ left, behavior: 'smooth' });
      }
    }
  };

  const handlePrev = () => scrollToIndex(scrollIndex - 1);
  const handleNext = () => scrollToIndex(scrollIndex + 1);

  const handleScroll = () => {
    if (!galleryRef.current) return;
    const container = galleryRef.current;
    const scrollLeft = container.scrollLeft;
    const children = Array.from(container.children) as HTMLElement[];
    let closestIndex = 0;
    let minDiff = Infinity;
    children.forEach((child, i) => {
      const cardCenter = child.offsetLeft + child.clientWidth / 2;
      const viewCenter = scrollLeft + container.clientWidth / 2;
      const diff = Math.abs(cardCenter - viewCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    });
    setScrollIndex(closestIndex);
  };

  return (
    <div
      ref={containerRef}
      className="relative py-12 md:py-20 px-4 overflow-hidden flex flex-col items-center justify-center select-none bg-transparent"
      aria-label="Creative Philosophy Banner"
      style={{ perspective: '1600px' }}
    >
      <div
        className="relative mx-auto max-w-6xl w-full text-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <motion.div
          style={{
            scale,
            opacity,
            rotateX,
            transformStyle: 'preserve-3d',
          }}
          className="relative z-10"
        >
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 rounded-full glass-pill px-4 py-1.5 text-xs font-mono tracking-widest text-white uppercase mb-4 drop-shadow">
            <Sparkles className="h-3.5 w-3.5 text-white/90" />
            <span>CREATIVE DISCIPLINE</span>
          </div>

          {/* Main Title */}
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] max-w-4xl mx-auto">
            CRAFTED WITH PRECISION.
            <br />
            <span className="text-white/90">BUILT TO DELIGHT.</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-neutral-200 max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] px-4">
            Harmonizing software engineering with responsive ergonomics. Every digital interface is constructed with tactile feedback, zero-bloat performance, and spatial depth.
          </p>

          {/* Navigation Controls */}
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              onClick={handlePrev}
              disabled={scrollIndex === 0}
              aria-label="Previous card"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 border border-white/20 text-white transition-all hover:bg-white/20 hover:border-white/40 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-md shadow-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={scrollIndex === cards.length - 1}
              aria-label="Next card"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 border border-white/20 text-white transition-all hover:bg-white/20 hover:border-white/40 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-md shadow-md"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Responsive Horizontal Gallery */}
        <div className="mt-8 w-full">
          <div
            ref={galleryRef}
            onScroll={handleScroll}
            className="w-full overflow-x-auto dock-scroll-container py-4 px-1 sm:px-4 snap-x snap-mandatory flex items-stretch gap-4 sm:gap-5 justify-start md:justify-center scroll-smooth"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {cards.map((card, idx) => {
              const isHovered = hoveredIndex === idx;
              const Icon = card.icon;

              return (
                <motion.div
                  key={card.id}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="perspective-1000 relative shrink-0 w-[clamp(230px,68vw,260px)] min-h-[190px] snap-center select-none cursor-pointer group flex flex-col justify-between text-left"
                  initial={{
                    opacity: 0,
                    x: -90,
                    rotateY: -6,
                    z: -card.depthZ,
                    scale: 0.94,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                    rotateY: 0,
                    z: card.depthZ * 0.35,
                    scale: 1,
                  }}
                  viewport={{ once: false, amount: 0.15 }}
                  animate={{
                    scale: isHovered ? 1.03 : 1,
                    y: isHovered ? -5 : [0, -3.5, 0],
                  }}
                  transition={{
                    scale: { type: 'spring', damping: 24, stiffness: 260 },
                    y: isHovered
                      ? { duration: 0.25 }
                      : { repeat: Infinity, duration: 4.6 + idx * 0.6, ease: 'easeInOut' },
                    opacity: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: idx * 0.11 },
                    x: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: idx * 0.11 },
                    rotateY: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: idx * 0.11 },
                    z: { duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: idx * 0.11 },
                  }}
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div className="glass-dock relative h-full rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between">
                    <div>
                      {/* Top icon and tag */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 border border-white/15 text-white shadow-sm group-hover:scale-105 transition-transform">
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <span className="font-mono text-[9px] tracking-wider text-neutral-300 px-2 py-0.5 rounded-full bg-white/10 border border-white/10">
                          {card.tag}
                        </span>
                      </div>

                      {/* Card Title */}
                      <h3 className="font-display text-base font-bold text-white mb-1.5 drop-shadow">
                        {card.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-neutral-200 leading-relaxed line-clamp-2 drop-shadow">
                        {card.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between font-mono text-[9px] text-neutral-400">
                      <span>Discipline</span>
                      <span className="text-emerald-400 font-medium">Core Focus</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination Indicators */}
          <div className="mt-4 flex items-center justify-center gap-1.5">
            {cards.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => scrollToIndex(idx)}
                aria-label={`Go to ${c.title}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  scrollIndex === idx ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
