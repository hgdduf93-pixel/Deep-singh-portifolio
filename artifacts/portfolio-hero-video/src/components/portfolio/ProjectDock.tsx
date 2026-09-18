import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { Project } from './types';

export function ProjectDock() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const [scrollIndex, setScrollIndex] = useState(0);

  const sectionRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const baseUrl = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;

  // Subtle 3D tilt on scroll through Z-space
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const cardsTranslateZ = useTransform(scrollYProgress, [0, 0.35, 0.8], [-40, 0, 0]);
  const cardsRotateX = useTransform(scrollYProgress, [0, 0.35, 0.8], [6, 0, 0]);
  const cardsOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8], [0.6, 1, 1]);

  // STRICTLY GENUINE PORTFOLIO PROJECTS:
  // 1. GSD CRASH (Original Interactive Web Game)
  // 2. COMING SOON (Interactive experience in development)
  // 3. MUDRIX by GSD (Android Application)
  // 4. GSD CRASH Android (Mobile Application)
  const projects: Project[] = [
    {
      id: 'gsd-crash',
      name: 'GSD CRASH',
      category: 'Interactive Web Game',
      description: 'Real-time interactive browser game featuring dynamic multiplier trajectory curves, 60 FPS HTML5 Canvas animation, and deterministic odds engine.',
      longDescription: 'An interactive browser game engineered around real-time odds curves and dynamic multiplier calculations. Employs vanilla HTML5 Canvas for fast 60fps trajectory animation and deterministic game loop state management.',
      technologies: ['HTML5', 'CSS3', 'JavaScript', 'Canvas API'],
      viewLink: 'https://github.com/hgdduf93-pixel/GSD-Crash-App',
      githubLink: 'https://github.com/hgdduf93-pixel/GSD-Crash-App',
      previewType: 'game',
      accentColor: '#10b981',
      highlightStat: 'Dynamic Odds Engine',
      keyFeatures: [
        'Deterministic odds multiplier trajectory computation',
        'Smooth 60 FPS HTML5 Canvas rendering engine',
        'Pure client-side responsive state management',
      ],
    },
    {
      id: 'gsd-crash-coming-soon',
      name: 'COMING SOON',
      status: 'COMING SOON',
      category: 'Interactive Experience',
      description: 'A new interactive experience is currently in development.',
      longDescription: 'A new interactive experience is currently in active development. Features upgraded simulation mechanics, next-generation canvas rendering, and responsive real-time controls.',
      technologies: ['HTML5 Canvas', 'TypeScript', 'WebAudio', 'Real-Time Physics'],
      viewLink: 'https://github.com/hgdduf93-pixel/GSD-Crash-App',
      githubLink: 'https://github.com/hgdduf93-pixel/GSD-Crash-App',
      previewType: 'coming-soon',
      accentColor: '#f59e0b',
      highlightStat: 'In Development',
      keyFeatures: [
        'Next-generation interactive simulation mechanics',
        'Enhanced visual telemetry & responsive state engine',
        'Built for modern desktop and mobile browsers',
      ],
    },
    {
      id: 'mudrix-by-gsd',
      name: 'MUDRIX by GSD',
      category: 'Android Application',
      description: 'Android application for personal expense tracking and financial organization with an offline-first glassmorphic interface.',
      longDescription: 'Android application for personal expense tracking and financial organization. Features an offline-first architecture with a modern glassmorphic interface, automated transaction parsing, and custom expense categorization without storing external credentials.',
      technologies: ['Kotlin', 'Android SDK', 'MVVM', 'Room Database', 'Gradle'],
      viewLink: 'https://github.com/hgdduf93-pixel/liquid-expense-tracker-',
      githubLink: 'https://github.com/hgdduf93-pixel/liquid-expense-tracker-',
      previewType: 'screenshot',
      accentColor: '#8b5cf6',
      highlightStat: 'Offline Architecture',
      screenshotUrl: `${baseUrl}assets/mudrix/screenshot-main.jpg`,
      galleryScreenshots: [
        { url: `${baseUrl}assets/mudrix/screenshot-main.jpg`, title: 'Dashboard' },
        { url: `${baseUrl}assets/mudrix/screenshot-history.png`, title: 'Transaction History' },
        { url: `${baseUrl}assets/mudrix/screenshot-insights.png`, title: 'Spending Insights' },
        { url: `${baseUrl}assets/mudrix/screenshot-settings.png`, title: 'Settings' },
      ],
      keyFeatures: [
        'Automated Expense Categorization: Classifies transactions into clear budget groups',
        'Privacy-First Architecture: Operates strictly offline without external account syncing',
        'Native Performance: Lightweight Kotlin Android architecture with minimal battery and memory overhead',
        'Modern Glass Interface: Polished mobile layout with financial charts and summaries',
      ],
    },
    {
      id: 'gsd-crash-android',
      name: 'GSD CRASH Android',
      category: 'Mobile Application',
      description: 'Native Android WebView bridge and wrapper architecture providing hardware-accelerated rendering, offline cache, and touch optimization.',
      longDescription: 'Android wrapper and native integration bridge for GSD CRASH. Implements hardware-accelerated WebView rendering, responsive orientation lock, custom client touch drivers, and offline caching for high-frame-rate mobile playback.',
      technologies: ['Android SDK', 'Kotlin', 'WebView API', 'Hardware Acceleration'],
      viewLink: 'https://github.com/hgdduf93-pixel/GSD-Crash-App',
      githubLink: 'https://github.com/hgdduf93-pixel/GSD-Crash-App',
      previewType: 'game',
      accentColor: '#38bdf8',
      highlightStat: 'Hardware Accelerated',
      keyFeatures: [
        'Custom touch-event bridge preventing input latency',
        'Hardware-accelerated WebView canvas rendering pipeline',
        'Optimized for Android device viewport aspect ratios',
      ],
    },
  ];

  const scrollToIndex = (idx: number) => {
    const nextIdx = Math.max(0, Math.min(projects.length - 1, idx));
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
      ref={sectionRef}
      className="relative py-12 md:py-20 px-4 md:px-8 select-none bg-transparent overflow-hidden"
      style={{ perspective: '1600px' }}
      aria-label="Deep Singh Featured Works"
    >
      <div className="relative z-10 mx-auto max-w-7xl w-full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6 md:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full glass-pill px-3.5 py-1 text-[11px] font-mono tracking-widest text-white uppercase mb-3 drop-shadow">
              <Sparkles className="h-3 w-3 text-white/90" />
              <span>PROJECTS</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)]">
              FEATURED BUILDS
            </h2>
            <p className="mt-2 text-sm sm:text-base text-neutral-300 max-w-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
              Real-time interactive browser game, native Android applications, and hardware-accelerated mobile systems.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={scrollIndex === 0}
              aria-label="Previous project"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 border border-white/20 text-white transition-all hover:bg-white/20 hover:border-white/40 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-md shadow-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={scrollIndex === projects.length - 1}
              aria-label="Next project"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 border border-white/20 text-white transition-all hover:bg-white/20 hover:border-white/40 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-md shadow-md"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Project Gallery Container */}
        <motion.div
          style={{
            z: cardsTranslateZ,
            rotateX: cardsRotateX,
            opacity: cardsOpacity,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full"
        >
          <div
            ref={galleryRef}
            onScroll={handleScroll}
            className="w-full overflow-x-auto dock-scroll-container py-4 md:py-6 px-1 sm:px-4 snap-x snap-mandatory flex items-stretch gap-5 sm:gap-6 justify-start lg:justify-center scroll-smooth"
            style={{
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {projects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={idx}
                hoveredIndex={hoveredIndex}
                onHoverIndex={setHoveredIndex}
                onSelectProject={(p) => setActiveModalProject(p)}
              />
            ))}
          </div>
        </motion.div>

        {/* Pagination Dots */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {projects.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => scrollToIndex(idx)}
              aria-label={`Go to ${p.name}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                scrollIndex === idx ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Interactive Project Modal */}
      {activeModalProject && (
        <ProjectModal
          project={activeModalProject}
          onClose={() => setActiveModalProject(null)}
        />
      )}
    </div>
  );
}
