import { useEffect, useRef } from 'react';
import { useVideo360 } from '@/context/Video360Context';

export function PersistentBackgroundVideo() {
  const { videoRef } = useVideo360();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Enforce HTML5 autoplay requirements explicitly
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;

    const playVideo = () => {
      if (video.paused) {
        video.play().catch(() => {
          // Retry on user interaction if browser policies temporarily block
          const unlock = () => {
            video.play().catch(() => {});
            window.removeEventListener('touchstart', unlock);
            window.removeEventListener('click', unlock);
            window.removeEventListener('scroll', unlock);
          };
          window.addEventListener('touchstart', unlock, { once: true });
          window.addEventListener('click', unlock, { once: true });
          window.addEventListener('scroll', unlock, { once: true });
        });
      }
    };

    playVideo();

    video.addEventListener('loadedmetadata', playVideo);
    video.addEventListener('canplay', playVideo);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        playVideo();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      video.removeEventListener('loadedmetadata', playVideo);
      video.removeEventListener('canplay', playVideo);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="persistent-viewport-background"
      className="fixed inset-0 w-screen h-[100dvh] min-h-[100svh] pointer-events-none overflow-hidden z-0"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100dvh',
      }}
      aria-hidden="true"
    >
      {/* 
        Single, persistent HTML5 Background Video Layer:
        - Viewport-level fixed layer spanning from Hero all the way through Footer.
        - Stays strictly covering 100% of viewport in both forward and reverse scrolling.
        - Extra subtle scale (1.02) provides an edge-bleed safety margin.
      */}
      <video
        ref={videoRef}
        className="site-background-video absolute inset-0 w-full h-full object-cover object-[52%_center] sm:object-center pointer-events-none"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/assets/portfolite-hero-poster.jpg"
      >
        <source src="/assets/portfolite-hero.mp4" type="video/mp4" />
      </video>

      {/* 
        Subtle cinematic dark glass gradient overlay:
        Protects readability while keeping the background video continuously visible.
      */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(5, 5, 8, 0.18) 0%, rgba(5, 5, 8, 0.28) 40%, rgba(5, 5, 8, 0.42) 100%)',
        }}
      />
    </div>
  );
}
