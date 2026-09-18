import { useEffect, useRef, useState, useCallback } from 'react';

interface UseAutoPingPongCarouselOptions {
  /** Speed in pixels per second. Defaults to responsive (34px/s on mobile, 42px/s on desktop) */
  baseSpeed?: number | { mobile: number; desktop: number };
  /** Pause duration in ms after any user interaction. Defaults to 4000ms */
  pauseDuration?: number;
  /** Callback when the active/closest card index changes (optional) */
  onIndexChange?: (index: number) => void;
  /** Dependencies that affect layout (e.g. filtered items count) */
  deps?: unknown[];
}

export function useAutoPingPongCarousel({
  baseSpeed,
  pauseDuration = 4000,
  onIndexChange,
  deps = [],
}: UseAutoPingPongCarouselOptions = {}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Position state stored in ref for 60fps/120fps rAF rendering without React re-render overhead
  const posRef = useRef(0);
  // Direction: +1 = scrolling towards right (offset increases), -1 = scrolling towards left (offset decreases)
  const directionRef = useRef<1 | -1>(1);
  const isPausedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const isPointerDownRef = useRef(false);
  const gestureDeterminedRef = useRef(false);
  const pointerStartXRef = useRef(0);
  const pointerStartYRef = useRef(0);
  const startPosRef = useRef(0);
  const maxScrollRef = useRef(0);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Expose reactive index and bounds for UI controls (Prev/Next buttons)
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Helper to directly apply GPU-accelerated transform
  const applyTransform = useCallback((pos: number) => {
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${-pos}px, 0, 0)`;
    }
  }, []);

  // Compute max scrollable distance
  const updateMaxScroll = useCallback(() => {
    if (!viewportRef.current || !trackRef.current) return;
    const viewportWidth = viewportRef.current.clientWidth;
    const trackWidth = trackRef.current.scrollWidth;
    const max = Math.max(0, trackWidth - viewportWidth);
    maxScrollRef.current = max;

    // Clamp current position
    if (posRef.current > max) {
      posRef.current = max;
      applyTransform(max);
      directionRef.current = -1;
    }
    setCanScrollPrev(posRef.current > 1);
    setCanScrollNext(posRef.current < max - 1);
  }, [applyTransform]);

  // Update closest index and button states
  const updateActiveIndex = useCallback(() => {
    if (!trackRef.current || !viewportRef.current) return;
    const children = Array.from(trackRef.current.children) as HTMLElement[];
    if (children.length === 0) return;

    const currentOffset = posRef.current;
    const viewportCenter = currentOffset + viewportRef.current.clientWidth / 2;

    let closest = 0;
    let minDiff = Infinity;
    children.forEach((child, i) => {
      const childCenter = child.offsetLeft + child.clientWidth / 2;
      const diff = Math.abs(childCenter - viewportCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closest = i;
      }
    });

    setCurrentIndex(closest);
    onIndexChange?.(closest);
    setCanScrollPrev(posRef.current > 1);
    setCanScrollNext(posRef.current < maxScrollRef.current - 1);
  }, [onIndexChange]);

  // Single timer manager: resets 4-second resume timer
  const scheduleResumeTimer = useCallback(() => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
    isPausedRef.current = true;

    pauseTimerRef.current = setTimeout(() => {
      isPausedRef.current = false;
      lastTimeRef.current = performance.now();
      pauseTimerRef.current = null;
    }, pauseDuration);
  }, [pauseDuration]);

  // Pause immediately
  const pauseAutoScroll = useCallback(() => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }
    isPausedRef.current = true;
  }, []);

  // Main animation loop
  useEffect(() => {
    updateMaxScroll();

    const getSpeed = () => {
      if (typeof baseSpeed === 'number') return baseSpeed;
      if (typeof baseSpeed === 'object' && baseSpeed !== null) {
        if (typeof window !== 'undefined' && window.innerWidth < 640) {
          return baseSpeed.mobile;
        }
        return baseSpeed.desktop;
      }
      if (typeof window !== 'undefined' && window.innerWidth < 640) {
        return 34; // 34px/s on mobile for optimal legibility
      }
      return 42; // 42px/s on desktop
    };

    let lastIndexCheck = 0;

    const tick = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      const max = maxScrollRef.current;

      if (!isPausedRef.current && !isDraggingRef.current && max > 0) {
        const speed = getSpeed();
        let nextPos = posRef.current + directionRef.current * speed * dt;

        // Ping-pong reversal
        if (nextPos >= max) {
          nextPos = max;
          directionRef.current = -1; // Smoothly reverse to RIGHT → LEFT
        } else if (nextPos <= 0) {
          nextPos = 0;
          directionRef.current = 1; // Smoothly reverse to LEFT → RIGHT
        }

        posRef.current = nextPos;
        applyTransform(nextPos);

        // Throttle active index update to ~5 times/second
        if (now - lastIndexCheck > 200) {
          lastIndexCheck = now;
          updateActiveIndex();
        }
      }

      animFrameIdRef.current = requestAnimationFrame(tick);
    };

    animFrameIdRef.current = requestAnimationFrame(tick);

    const handleResize = () => {
      updateMaxScroll();
      updateActiveIndex();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [baseSpeed, updateMaxScroll, applyTransform, updateActiveIndex, ...deps]);

  // Recalculate when dependencies change (e.g. category filter)
  useEffect(() => {
    // Give DOM a frame to layout
    const timer = setTimeout(() => {
      updateMaxScroll();
      updateActiveIndex();
      // Restart 4-second timer when filter changes
      scheduleResumeTimer();
    }, 50);
    return () => clearTimeout(timer);
  }, [updateMaxScroll, updateActiveIndex, scheduleResumeTimer, ...deps]);

  // Pointer & Touch Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only primary button or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    isPointerDownRef.current = true;
    isDraggingRef.current = false;
    gestureDeterminedRef.current = false;
    pointerStartXRef.current = e.clientX;
    pointerStartYRef.current = e.clientY;
    startPosRef.current = posRef.current;

    // Immediately pause auto-scroll upon touch/tap
    pauseAutoScroll();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current) return;

    const dx = e.clientX - pointerStartXRef.current;
    const dy = e.clientY - pointerStartYRef.current;

    if (!gestureDeterminedRef.current) {
      if (Math.abs(dx) > 7 || Math.abs(dy) > 7) {
        gestureDeterminedRef.current = true;
        if (Math.abs(dy) > Math.abs(dx)) {
          // Vertical swipe: let native page scroll take over
          isPointerDownRef.current = false;
          isDraggingRef.current = false;
          scheduleResumeTimer();
          return;
        } else {
          // Horizontal drag: user is swiping the carousel
          isDraggingRef.current = true;
          try {
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          } catch (_) {}
        }
      }
    }

    if (isDraggingRef.current) {
      const max = maxScrollRef.current;
      const targetPos = Math.max(0, Math.min(max, startPosRef.current - dx));
      posRef.current = targetPos;
      applyTransform(targetPos);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isPointerDownRef.current && !isDraggingRef.current) return;

    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}

    isPointerDownRef.current = false;
    isDraggingRef.current = false;
    gestureDeterminedRef.current = false;

    // Update index and state
    updateActiveIndex();

    // Exactly 4 seconds after tap or drag release, resume loop!
    scheduleResumeTimer();
  };

  const handlePointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    handlePointerUp(e);
  };

  // Step controls for Prev/Next buttons
  const scrollStep = useCallback(
    (direction: 1 | -1) => {
      pauseAutoScroll();
      if (!trackRef.current || !viewportRef.current) return;

      const children = Array.from(trackRef.current.children) as HTMLElement[];
      if (children.length === 0) return;

      const cardWidth = children[0]?.clientWidth || 280;
      const gap = 20;
      const step = (cardWidth + gap) * direction;

      const max = maxScrollRef.current;
      const target = Math.max(0, Math.min(max, posRef.current + step));

      // Smooth step
      const startTime = performance.now();
      const startPos = posRef.current;
      const distance = target - startPos;
      const duration = 380;

      directionRef.current = direction;

      const animateStep = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // easeOutCubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = startPos + distance * ease;

        posRef.current = current;
        applyTransform(current);

        if (progress < 1) {
          requestAnimationFrame(animateStep);
        } else {
          posRef.current = target;
          applyTransform(target);
          updateActiveIndex();
          scheduleResumeTimer();
        }
      };

      requestAnimationFrame(animateStep);
    },
    [applyTransform, pauseAutoScroll, scheduleResumeTimer, updateActiveIndex]
  );

  const handlePrev = useCallback(() => scrollStep(-1), [scrollStep]);
  const handleNext = useCallback(() => scrollStep(1), [scrollStep]);

  const scrollToCard = useCallback(
    (idx: number) => {
      pauseAutoScroll();
      if (!trackRef.current || !viewportRef.current) return;
      const children = Array.from(trackRef.current.children) as HTMLElement[];
      const child = children[idx];
      if (!child) return;

      const max = maxScrollRef.current;
      const target = Math.max(
        0,
        Math.min(max, child.offsetLeft - (viewportRef.current.clientWidth - child.clientWidth) / 2)
      );

      posRef.current = target;
      applyTransform(target);
      updateActiveIndex();
      scheduleResumeTimer();
    },
    [applyTransform, pauseAutoScroll, scheduleResumeTimer, updateActiveIndex]
  );

  return {
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
    scheduleResumeTimer,
  };
}
