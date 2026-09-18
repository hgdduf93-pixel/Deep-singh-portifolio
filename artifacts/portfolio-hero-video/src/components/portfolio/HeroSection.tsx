import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useVideo360 } from '@/context/Video360Context';

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDragging, heroPointerHandlers } = useVideo360();

  // Parallax motion values (normalized -0.5 to 0.5)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for cinematic GSAP-like ease (no jitter, no abrupt bounce)
  const springConfig = { damping: 32, stiffness: 180, mass: 1 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Typography floating 3D transforms (moves at a distinct rate with 3D tilt beside shoulder)
  const textX = useTransform(smoothX, [-0.5, 0.5], [-18, 18]);
  const textY = useTransform(smoothY, [-0.5, 0.5], [-14, 14]);
  const textRotateX = useTransform(smoothY, [-0.5, 0.5], [7, -7]);
  const textRotateY = useTransform(smoothX, [-0.5, 0.5], [-9, 9]);

  // Dedicated subtle motion ONLY for the "SINGH" typography accent
  const singhRotateX = useTransform(smoothY, [-0.5, 0.5], [5, -5]);
  const singhRotateY = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);
  const singhTranslateZ = useTransform(smoothY, [-0.5, 0.5], [38, 48]);
  const singhScale = useTransform(smoothX, [-0.5, 0.5], [1.01, 1.04]);

  // Scroll-based motion using Framer Motion useScroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const singhScrollDepth = useTransform(scrollYProgress, [0, 0.5], [0, -25]);
  const singhScrollOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.75]);

  const scrollDriftY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const scrollScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.6, 0]);

  useEffect(() => {
    // Desktop mouse movement tracking
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX.set(e.clientX / innerWidth - 0.5);
      mouseY.set(e.clientY / innerHeight - 0.5);
    };

    // Mobile gyroscope orientation tracking (where supported on Android/iOS)
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        const normX = Math.max(-0.5, Math.min(0.5, e.gamma / 45));
        const normY = Math.max(-0.5, Math.min(0.5, (e.beta - 45) / 45));
        mouseX.set(normX * 0.7);
        mouseY.set(normY * 0.7);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [mouseX, mouseY]);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-[100dvh] min-h-[100svh] w-full overflow-hidden bg-transparent select-none"
      style={{ perspective: '1200px' }}
      aria-label="Deep Singh Portfolio Video Hero"
    >
      {/* 
        Interactive Hero Video Drag Layer:
        - Touch / mouse drag horizontally to scrub video frames in real-time.
        - Drag right -> rotates clockwise / moves forward through video sequence.
        - Drag left -> rotates counter-clockwise / moves backward through video sequence.
        - Reversing direction smoothly reverses video playback.
        - touch-action: pan-y allows smooth vertical page scrolling while enabling horizontal drag.
      */}
      <div
        className={`absolute inset-0 z-10 select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ touchAction: 'pan-y' }}
        {...heroPointerHandlers}
        aria-label="Interactive 360 video rotation drag surface"
      />

      {/* TOP-RIGHT SMALL ROLE TEXT:
          ANDROID APP DEVELOPER / VIBE CODER */}
      <motion.div
        className="absolute top-20 sm:top-24 md:top-28 right-5 sm:right-8 md:right-12 z-20 text-right pointer-events-none select-none"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.8, ease: 'easeOut' }}
      >
        <div className="font-mono text-[9px] xs:text-[10px] sm:text-[11px] tracking-[0.22em] uppercase leading-relaxed text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
          <div className="font-medium text-white/95">ANDROID APP DEVELOPER</div>
          <div className="text-white/70 mt-0.5 tracking-[0.26em]">VIBE CODER</div>
        </div>
      </motion.div>

      {/* LARGE "DEEP SINGH" BESIDE MY SHOULDER
          Floating in space beside the left shoulder, clear of the face.
          Features true perspective, optical depth blur layer, mouse/gyro parallax, and smooth scroll drift. */}
      <motion.div
        className="absolute left-4 xs:left-6 sm:left-10 md:left-14 lg:left-20 xl:left-24 top-[48%] sm:top-[46%] md:top-[44%] -translate-y-1/2 z-20 pointer-events-none select-none max-w-[70%] sm:max-w-[55%] md:max-w-none"
        style={{
          x: textX,
          y: textY,
          rotateX: textRotateX,
          rotateY: textRotateY,
          translateY: scrollDriftY,
          scale: scrollScale,
          opacity: scrollOpacity,
          transformStyle: 'preserve-3d',
        }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 1, ease: 'easeOut' }}
      >
        {/* Subtle camera-depth optical blur underlayer */}
        <div
          aria-hidden="true"
          className="absolute inset-0 leading-[0.88] select-none pointer-events-none transform translate-z-[-20px]"
        >
          <div className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
            <span className="block font-display font-light tracking-[-0.03em] text-white/20 blur-[10px]">DEEP</span>
            <span className="block font-singh font-bold italic tracking-[-0.01em] text-[#dc2626]/20 blur-[16px] -mt-1 sm:-mt-2 md:-mt-4">
              SINGH
            </span>
          </div>
        </div>

        {/* Primary Crisp Floating Typography Layer */}
        <div
          className="relative leading-[0.88] select-none"
          style={{ transform: 'translateZ(30px)' }}
        >
          <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
            <motion.span
              initial={{ opacity: 0, y: 28, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="block font-display font-light text-[#fcfcfd] tracking-[-0.03em] drop-shadow-[0_12px_28px_rgba(0,0,0,0.95)]"
            >
              DEEP
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 38, filter: 'blur(12px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
              style={{
                rotateX: singhRotateX,
                rotateY: singhRotateY,
                z: singhTranslateZ,
                scale: singhScale,
                y: singhScrollDepth,
                opacity: singhScrollOpacity,
                transformStyle: 'preserve-3d',
              }}
              className="block font-singh font-bold italic tracking-[-0.01em] bg-clip-text text-transparent bg-gradient-to-r from-[#7f1d1d] via-[#ef4444] to-[#450a0a] -mt-1 sm:-mt-2 md:-mt-4 drop-shadow-[0_0_26px_rgba(239,68,68,0.55)] drop-shadow-[0_0_55px_rgba(185,28,28,0.35)] drop-shadow-[0_12px_28px_rgba(0,0,0,0.95)]"
            >
              SINGH
            </motion.span>
          </h1>
        </div>
      </motion.div>

      {/* Subtle Scroll Prompt (Bottom Right Corner, minimal & responsive) */}
      <motion.a
        href="#projects"
        className="absolute bottom-6 right-5 sm:bottom-8 sm:right-8 md:bottom-10 md:right-12 z-20 flex items-center gap-2 rounded-full glass-pill px-3 py-1.5 text-[10px] sm:text-[11px] font-mono text-white transition-all hover:bg-white/20 active:scale-95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] pointer-events-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        aria-label="Scroll down to project gallery"
      >
        <span className="hidden sm:inline tracking-wider uppercase">Explore Works</span>
        <motion.span
          animate={{ y: [0, 3, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ArrowDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-white/80" />
        </motion.span>
      </motion.a>
    </section>
  );
}
