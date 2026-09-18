import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Github, Smartphone, Eye, Image as ImageIcon, Sparkles, Clock } from 'lucide-react';
import { Project } from './types';

interface ProjectCardProps {
  project: Project;
  index: number;
  hoveredIndex: number | null;
  onHoverIndex: (index: number | null) => void;
  onSelectProject: (project: Project) => void;
}

export function ProjectCard({
  project,
  index,
  hoveredIndex,
  onHoverIndex,
  onSelectProject,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [imageError, setImageError] = useState(false);
  const [imgSrc, setImgSrc] = useState(project.screenshotUrl || '');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Local card mouse tilt (subtle & bounded)
  const localX = useMotionValue(0);
  const localY = useMotionValue(0);

  const tiltSpring = { damping: 24, stiffness: 260, mass: 0.8 };
  const cardRotateX = useSpring(useTransform(localY, [-0.5, 0.5], [8, -8]), tiltSpring);
  const cardRotateY = useSpring(useTransform(localX, [-0.5, 0.5], [-8, 8]), tiltSpring);

  const isHovered = hoveredIndex === index;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    localX.set(mouseX / width - 0.5);
    localY.set(mouseY / height - 0.5);

    setGlarePosition({
      x: (mouseX / width) * 100,
      y: (mouseY / height) * 100,
    });
  };

  const handleMouseEnter = () => {
    onHoverIndex(index);
  };

  const handleMouseLeave = () => {
    onHoverIndex(null);
    localX.set(0);
    localY.set(0);
    setGlarePosition({ x: 50, y: 50 });
  };

  const isComingSoon = project.status === 'COMING SOON' || project.previewType === 'coming-soon';

  const renderProjectVisual = () => {
    // Duplicate GSD CRASH Coming Soon Visual
    if (isComingSoon) {
      return (
        <div className="relative h-44 sm:h-48 w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#1a1408]/90 via-neutral-900/90 to-black/90 p-3 flex flex-col justify-between border border-amber-500/30 group-hover:border-amber-500/60 transition-colors shadow-[0_0_20px_rgba(245,158,11,0.1)]">
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              <span className="font-mono text-[9px] text-amber-300 font-semibold tracking-wider">
                IN ACTIVE DEVELOPMENT
              </span>
            </div>
            <span className="rounded-full bg-amber-500/20 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-sm">
              <Sparkles className="h-2.5 w-2.5 text-amber-400" />
              COMING SOON
            </span>
          </div>

          {/* Dynamic Next-Gen Trajectory Simulation Visual */}
          <div className="relative flex-1 w-full flex items-center justify-center my-1">
            <svg className="w-full h-24 overflow-visible" viewBox="0 0 200 80">
              <defs>
                <linearGradient id={`grad-coming-soon-${project.id}`} x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                  <stop offset="60%" stopColor="#ef4444" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.95" />
                </linearGradient>
              </defs>
              {/* Radar Grid Guides */}
              <line x1="10" y1="75" x2="190" y2="75" stroke="rgba(245,158,11,0.15)" strokeDasharray="3 3" />
              <line x1="10" y1="45" x2="190" y2="45" stroke="rgba(245,158,11,0.15)" strokeDasharray="3 3" />
              <path
                d="M 10 75 Q 75 72, 120 40 T 190 12"
                fill="none"
                stroke={`url(#grad-coming-soon-${project.id})`}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <circle cx="190" cy="12" r="5" fill="#fbbf24" className="animate-pulse drop-shadow-[0_0_8px_rgba(251,191,36,0.9)]" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-mono text-xl sm:text-2xl font-black text-amber-300 drop-shadow-[0_2px_12px_rgba(245,158,11,0.85)] tracking-wider">
                COMING SOON
              </span>
              <span className="font-mono text-[9px] text-amber-400/80 tracking-widest uppercase mt-0.5">
                Next-Gen Game Loop
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between font-mono text-[9px] text-amber-200/80 border-t border-amber-500/20 pt-1.5 z-10">
            <span>Next-Gen Physics</span>
            <span className="text-amber-400 font-semibold">In Development</span>
          </div>
        </div>
      );
    }

    // Screenshot preview (Used for MUDRIX by GSD with genuine screenshot)
    if (project.previewType === 'screenshot' || project.screenshotUrl) {
      return (
        <div className="relative h-44 sm:h-48 w-full overflow-hidden rounded-xl bg-black/40 backdrop-blur-md p-2 flex items-center justify-center border border-white/15 group-hover:border-white/30 transition-colors">
          {!imageError && imgSrc ? (
            <div className="relative h-full w-full flex items-center justify-center overflow-hidden rounded-lg bg-black/30">
              <img
                src={imgSrc}
                alt={`${project.name} interface showcase`}
                className="h-full w-full object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
                onError={() => {
                  if (project.galleryScreenshots && project.galleryScreenshots.length > 1) {
                    setImgSrc(project.galleryScreenshots[1].url);
                  } else {
                    setImageError(true);
                  }
                }}
              />
              <div className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-black/75 px-2 py-0.5 text-[9px] font-mono text-white/90 border border-white/20 backdrop-blur-sm shadow-md">
                <ImageIcon className="h-3 w-3 text-purple-400" />
                <span>Screenshot</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-center p-4">
              <Smartphone className="h-8 w-8 text-purple-400/80 animate-pulse" />
              <div className="text-xs font-semibold text-white">MUDRIX by GSD</div>
              <div className="text-[10px] text-neutral-300">Android Finance Organizer</div>
            </div>
          )}
        </div>
      );
    }

    // Interactive Game / Mobile Canvas Simulation
    return (
      <div className="relative h-44 sm:h-48 w-full overflow-hidden rounded-xl bg-gradient-to-br from-neutral-900/90 to-black/90 p-3 flex flex-col justify-between border border-white/15 group-hover:border-white/30 transition-colors">
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-[9px] text-emerald-300 font-semibold tracking-wider">
              {project.id === 'gsd-crash-android' ? 'ANDROID WEBVIEW' : 'HTML5 CANVAS 60FPS'}
            </span>
          </div>
          <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[9px] text-white/90 border border-white/15">
            {project.id === 'gsd-crash-android' ? 'Mobile Port' : 'Live Game Engine'}
          </span>
        </div>

        {/* Dynamic Trajectory Curve Visualization */}
        <div className="relative flex-1 w-full flex items-center justify-center my-1">
          <svg className="w-full h-24 overflow-visible" viewBox="0 0 200 80">
            <defs>
              <linearGradient id={`grad-${project.id}`} x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <path
              d="M 10 75 Q 80 70, 130 45 T 190 15"
              fill="none"
              stroke={`url(#grad-${project.id})`}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <circle cx="190" cy="15" r="4.5" fill="#38bdf8" className="animate-pulse" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="font-mono text-2xl font-black text-white/80 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] tracking-tight">
              {project.id === 'gsd-crash-android' ? 'v1.0.4 APK' : 'x 4.82'}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between font-mono text-[9px] text-neutral-300 border-t border-white/10 pt-1.5 z-10">
          <span>{project.id === 'gsd-crash-android' ? 'WebView 60fps' : 'Dynamic Odds Engine'}</span>
          <span className="text-emerald-400 font-semibold">{project.id === 'gsd-crash-android' ? 'Hardware Accel' : 'Deterministic'}</span>
        </div>
      </div>
    );
  };

  // Alternating Left / Right 3D Motion Directions per iPhone scroll specifications:
  const isLeft = index % 2 === 0;
  const initialTranslateX = isMobile
    ? isLeft ? -30 : 30
    : isLeft ? -60 : 60;
  const initialRotateY = isMobile
    ? isLeft ? -2.5 : 2.5
    : isLeft ? -5 : 5;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelectProject(project)}
      className="perspective-1000 relative shrink-0 w-[clamp(280px,82vw,350px)] snap-center select-none cursor-pointer group flex flex-col will-change-[transform,opacity]"
      initial={{
        opacity: 0.25,
        x: initialTranslateX,
        rotateY: initialRotateY,
        z: -25,
        scale: 0.97,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        rotateY: 0,
        z: 0,
        scale: 1,
      }}
      viewport={{ once: false, amount: 0.08, margin: '60px 0px 60px 0px' }}
      animate={{
        scale: isHovered ? 1.025 : 1,
        y: isHovered ? -6 : [0, -3, 0],
      }}
      transition={{
        scale: { type: 'spring', damping: 24, stiffness: 260 },
        y: isHovered
          ? { duration: 0.25 }
          : { repeat: Infinity, duration: 5.0 + index * 0.7, ease: 'easeInOut' },
        opacity: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 },
        x: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 },
        rotateY: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 },
        z: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 },
      }}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      <motion.div
        style={{
          rotateX: isHovered ? cardRotateX : 0,
          rotateY: isHovered ? cardRotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        className={`glass-dock relative h-full rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between ${
          isComingSoon ? 'border-amber-500/30' : ''
        }`}
      >
        {/* Dynamic Specular Glare */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: isComingSoon
              ? `radial-gradient(circle 280px at ${glarePosition.x}% ${glarePosition.y}%, rgba(245,158,11,0.2), transparent 70%)`
              : `radial-gradient(circle 280px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255,255,255,0.18), transparent 70%)`,
          }}
        />

        {/* Project Visual Container */}
        <div>
          {renderProjectVisual()}

          {/* Project Details */}
          <div className="mt-4 flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-300 font-semibold drop-shadow">
                {project.category}
              </span>
              {isComingSoon ? (
                <span className="rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-sm">
                  <Sparkles className="h-2.5 w-2.5 text-amber-400" />
                  COMING SOON
                </span>
              ) : (
                <span className="text-[11px] font-mono text-white/90 font-medium drop-shadow">
                  {project.highlightStat}
                </span>
              )}
            </div>

            <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {project.name}
            </h3>

            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed line-clamp-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
              {project.description}
            </p>

            {/* Technology Badges */}
            <div className="mt-1 flex flex-wrap gap-1.5">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className={`rounded-md px-2 py-0.5 text-[10px] font-mono border drop-shadow ${
                    isComingSoon
                      ? 'bg-amber-500/10 text-amber-200 border-amber-500/25'
                      : 'bg-white/10 text-white border-white/15'
                  }`}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          className="mt-4 flex items-center gap-2 pt-3 border-t border-white/15"
          onClick={(e) => e.stopPropagation()}
        >
          {isComingSoon ? (
            <button
              type="button"
              onClick={() => onSelectProject(project)}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 px-3.5 py-2 text-xs font-bold text-black transition-all active:scale-95 shadow-md shadow-amber-500/20"
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Coming Soon</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onSelectProject(project)}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-black transition-all hover:bg-neutral-100 active:scale-95 shadow-md"
            >
              <span>View Project</span>
              <Eye className="h-3.5 w-3.5" />
            </button>
          )}

          {project.githubLink && (
            <a
              href={project.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.name} GitHub Repository`}
              className="flex items-center justify-center rounded-xl bg-white/15 px-3 py-2 text-xs font-medium text-white transition-all hover:bg-white/25 active:scale-95 border border-white/20 shadow-sm"
            >
              <Github className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
