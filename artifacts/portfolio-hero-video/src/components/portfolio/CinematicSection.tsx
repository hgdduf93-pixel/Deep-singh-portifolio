import { ReactNode, useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CinematicSectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  isFooter?: boolean;
  perspective?: number;
  direction?: 'left' | 'right' | 'center' | 'up';
}

/**
 * CinematicSection wraps portfolio sections with an iPhone-keynote 3D entrance transition.
 * 
 * Performance & Ergonomics:
 * - Uses native IntersectionObserver via Framer Motion's whileInView
 * - 100% GPU-accelerated: only `transform: translate3d(...)` and `opacity`
 * - No heavy continuous JS calculations on scroll
 * - Respects prefers-reduced-motion
 * - Auto-adapts angle and distance on mobile to prevent clipping or horizontal scrollbars
 */
export function CinematicSection({
  id,
  children,
  className = '',
  isFooter = false,
  perspective = 1200,
  direction = 'center',
}: CinematicSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mqlMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mqlMotion.matches);
    const motionHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mqlMotion.addEventListener('change', motionHandler);

    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      mqlMotion.removeEventListener('change', motionHandler);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  if (prefersReducedMotion) {
    return (
      <section id={id} ref={sectionRef} className={className}>
        {children}
      </section>
    );
  }

  // Directional 3D entrance calculation - refined, subtle, GPU accelerated
  const getInitialProps = () => {
    if (isFooter || direction === 'up') {
      return {
        opacity: 0.2,
        y: isMobile ? 24 : 36,
        scale: 0.98,
        rotateX: 2,
      };
    }

    if (direction === 'right') {
      return {
        opacity: 0.2,
        x: isMobile ? 32 : 55,
        rotateY: isMobile ? 2.5 : 4.5,
        scale: 0.97,
        z: -25,
      };
    }

    if (direction === 'left') {
      return {
        opacity: 0.2,
        x: isMobile ? -32 : -55,
        rotateY: isMobile ? -2.5 : -4.5,
        scale: 0.97,
        z: -25,
      };
    }

    // 'center' / alternating children
    return {
      opacity: 0.3,
      scale: 0.98,
      z: -20,
    };
  };

  const initialProps = getInitialProps();

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative w-full overflow-x-clip ${className}`}
      style={{
        perspective: `${perspective}px`,
      }}
    >
      <motion.div
        initial={initialProps}
        whileInView={{
          opacity: 1,
          x: 0,
          y: 0,
          z: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
        }}
        viewport={{ once: false, amount: 0.08, margin: '80px 0px 80px 0px' }}
        transition={{
          duration: 0.75,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
        className="will-change-[transform,opacity] w-full"
      >
        {children}
      </motion.div>
    </section>
  );
}
