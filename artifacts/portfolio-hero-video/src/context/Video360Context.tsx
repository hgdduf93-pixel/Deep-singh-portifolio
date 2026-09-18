import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
  type RefObject,
} from 'react';

interface Video360ContextValue {
  videoRef: RefObject<HTMLVideoElement | null>;
  currentTime: number;
  duration: number;
  isDragging: boolean;
  isPlaying: boolean;
  heroPointerHandlers: {
    onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
    onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
    onPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
    onPointerCancel: (e: React.PointerEvent<HTMLDivElement>) => void;
  };
  seekToTime: (time: number) => void;
  togglePlayPause: () => void;
}

const Video360Context = createContext<Video360ContextValue | null>(null);

export function useVideo360() {
  const context = useContext(Video360Context);
  if (!context) {
    throw new Error('useVideo360 must be used within a Video360Provider');
  }
  return context;
}

/**
 * Modular shortest distance between two points in a circular loop of length `duration`.
 * Prevents video from jumping backwards across the 0s boundary when rotating 360 degrees.
 */
function getShortestTimeDiff(target: number, current: number, duration: number): number {
  if (duration <= 0) return 0;
  let diff = (target - current) % duration;
  if (diff > duration / 2) {
    diff -= duration;
  } else if (diff < -duration / 2) {
    diff += duration;
  }
  return diff;
}

export function Video360Provider({ children }: { children: ReactNode }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  // Lightweight synchronized refs to prevent continuous React state re-renders during pointer tracking
  const durationRef = useRef(8.5);
  const targetTimeRef = useRef(0);
  const displayTimeRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isSettlingRef = useRef(false);
  const wasVideoPausedByDragRef = useRef(false);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Pointer tracking & Direction-locking state
  const activePointerIdRef = useRef<number | null>(null);
  const pointerDownXRef = useRef(0);
  const pointerDownYRef = useRef(0);
  const lastMoveXRef = useRef(0);
  const lastMoveTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const gestureStateRef = useRef<'idle' | 'pending' | 'horizontal' | 'vertical'>('idle');

  // Video element metadata sync
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration) && video.duration > 0) {
        durationRef.current = video.duration;
      }
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);

    if (video.readyState >= 1 && video.duration > 0) {
      durationRef.current = video.duration;
    }

    return () => {
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
    };
  }, []);

  // Coordinated Single Animation Loop:
  // Handles both smooth video scrubbing interpolation and background parallax transforms
  // in one single requestAnimationFrame tick to eliminate duplicate loops and CPU/GPU load.
  useEffect(() => {
    let isRunning = true;
    let rafId: number;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let targetPointerX = 0;
    let currentPointerX = 0;

    const onMouseMove = (e: MouseEvent) => {
      targetPointerX = e.clientX / window.innerWidth - 0.5;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    const unifiedAnimationLoop = () => {
      if (!isRunning) return;

      const video = videoRef.current;
      const dur = durationRef.current || video?.duration || 8.5;

      // 1. SUPER-SMOOTH VIDEO SCRUBBING & INTERPOLATION
      if (isDraggingRef.current || isSettlingRef.current) {
        const diff = getShortestTimeDiff(targetTimeRef.current, displayTimeRef.current, dur);

        if (Math.abs(diff) > 0.002) {
          // Smooth interpolation factor (0.16) prevents stepping between frames
          displayTimeRef.current += diff * 0.16;
          displayTimeRef.current = ((displayTimeRef.current % dur) + dur) % dur;

          if (video && Math.abs(video.currentTime - displayTimeRef.current) > 0.004) {
            try {
              video.currentTime = displayTimeRef.current;
            } catch (_) {}
          }
        } else {
          if (isSettlingRef.current) {
            isSettlingRef.current = false;
          }
        }
      } else if (video && !video.paused) {
        displayTimeRef.current = video.currentTime;
        targetTimeRef.current = video.currentTime;
      }

      // 2. SUBTLE MOUSE PARALLAX CAMERA MOVEMENT (NEVER MOVE VIDEO VERTICALLY OUT OF VIEWPORT)
      if (video && !prefersReducedMotion) {
        currentPointerX += (targetPointerX - currentPointerX) * 0.05;

        // Only extremely subtle horizontal parallax from mouse cursor, zero vertical scroll translation
        // Video stays strictly 100% fixed covering the viewport with slight scale safety margin (1.02)
        const horizontalParallax = currentPointerX * 8;

        video.style.transform = `translate3d(${horizontalParallax.toFixed(2)}px, 0px, 0px) scale(1.02)`;
      }

      rafId = requestAnimationFrame(unifiedAnimationLoop);
    };

    rafId = requestAnimationFrame(unifiedAnimationLoop);

    return () => {
      isRunning = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  const seekToTime = useCallback((time: number) => {
    const video = videoRef.current;
    const dur = durationRef.current || video?.duration || 8.5;
    const wrapped = ((time % dur) + dur) % dur;
    targetTimeRef.current = wrapped;
    displayTimeRef.current = wrapped;
    if (video) {
      try {
        video.currentTime = wrapped;
      } catch (_) {}
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.playbackRate = 0.85;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, []);

  // Pointer Event Handlers for Hero Interactive Layer
  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest('a, button, input, textarea, select, [role="button"]')) {
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    // IMPORTANT: Do NOT call setPointerCapture here!
    // Capturing on pointerdown prevents the browser from detecting vertical touch scrolling.
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }

    activePointerIdRef.current = e.pointerId;
    pointerDownXRef.current = e.clientX;
    pointerDownYRef.current = e.clientY;
    lastMoveXRef.current = e.clientX;
    lastMoveTimeRef.current = performance.now();
    velocityRef.current = 0;
    gestureStateRef.current = 'pending';
    isSettlingRef.current = false;
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return;

    // Once classified as vertical, allow normal page scrolling without controlling the video
    if (gestureStateRef.current === 'vertical') {
      return;
    }

    const dx = e.clientX - pointerDownXRef.current;
    const dy = e.clientY - pointerDownYRef.current;

    // Movement threshold (8–12px) before deciding gesture type
    if (gestureStateRef.current === 'pending') {
      const dist = Math.hypot(dx, dy);
      if (dist < 10) {
        return;
      }

      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal interaction confirmed -> control video rotation!
        gestureStateRef.current = 'horizontal';
        isDraggingRef.current = true;
        setIsDragging(true);

        // Capture pointer ONLY after horizontal intent is confirmed
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch (_) {}

        const video = videoRef.current;
        if (video) {
          if (!video.paused) {
            video.pause();
            wasVideoPausedByDragRef.current = true;
          }
          targetTimeRef.current = video.currentTime;
          displayTimeRef.current = video.currentTime;
        }

        lastMoveXRef.current = e.clientX;
        lastMoveTimeRef.current = performance.now();
      } else {
        // Vertical interaction confirmed -> allow normal page scrolling!
        gestureStateRef.current = 'vertical';
        activePointerIdRef.current = null;
        return;
      }
    }

    if (gestureStateRef.current === 'horizontal') {
      const video = videoRef.current;
      const dur = durationRef.current || video?.duration || 8.5;
      const moveDx = e.clientX - lastMoveXRef.current;
      const now = performance.now();
      const dt = Math.max(1, now - lastMoveTimeRef.current);

      // Sensitivity: ~440px on mobile, ~780px on desktop sweeps the full sequence
      const isMobile = window.innerWidth < 768;
      const sweepDistance = isMobile ? 440 : 780;
      const secondsPerPixel = dur / sweepDistance;
      const timeDelta = moveDx * secondsPerPixel;

      let next = targetTimeRef.current + timeDelta;
      if (next < 0) next = dur + (next % dur);
      else if (next >= dur) next = next % dur;

      targetTimeRef.current = next;
      velocityRef.current = timeDelta / dt;

      lastMoveXRef.current = e.clientX;
      lastMoveTimeRef.current = now;
    }
  }, []);

  const onPointerUpOrCancel = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (_) {}

    const wasHorizontal = gestureStateRef.current === 'horizontal';
    activePointerIdRef.current = null;
    gestureStateRef.current = 'idle';

    if (!wasHorizontal) {
      isDraggingRef.current = false;
      setIsDragging(false);
      return;
    }

    const video = videoRef.current;
    const dur = durationRef.current || video?.duration || 8.5;

    // Apply gentle inertia glide
    const vel = Math.max(-0.012, Math.min(0.012, velocityRef.current));
    if (Math.abs(vel) > 0.0003) {
      let next = targetTimeRef.current + vel * 120;
      if (next < 0) next = dur + (next % dur);
      else if (next >= dur) next = next % dur;
      targetTimeRef.current = next;
      isSettlingRef.current = true;
    }

    isDraggingRef.current = false;
    setIsDragging(false);

    // Gently resume normal background video playback after 1.4s idle
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      const v = videoRef.current;
      if (v && v.paused && !isDraggingRef.current && wasVideoPausedByDragRef.current) {
        wasVideoPausedByDragRef.current = false;
        v.playbackRate = 0.85;
        v.play().catch(() => {});
      }
    }, 1400);
  }, []);

  return (
    <Video360Context.Provider
      value={{
        videoRef,
        currentTime: displayTimeRef.current,
        duration: durationRef.current,
        isDragging,
        isPlaying,
        heroPointerHandlers: {
          onPointerDown,
          onPointerMove,
          onPointerUp: onPointerUpOrCancel,
          onPointerCancel: onPointerUpOrCancel,
        },
        seekToTime,
        togglePlayPause,
      }}
    >
      {children}
    </Video360Context.Provider>
  );
}
