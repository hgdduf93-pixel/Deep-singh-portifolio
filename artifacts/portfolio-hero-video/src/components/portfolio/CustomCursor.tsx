import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  // Smooth springs for cursor positioning
  const cursorX = useSpring(0, { damping: 28, stiffness: 350 });
  const cursorY = useSpring(0, { damping: 28, stiffness: 350 });

  useEffect(() => {
    // Check if device supports fine pointer (mouse/trackpad)
    if (window.matchMedia('(pointer: fine)').matches) {
      setIsTouchDevice(false);
    } else {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check if target or parent is interactive
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'BUTTON' ||
          target.tagName === 'A' ||
          target.closest('button') ||
          target.closest('a') ||
          target.getAttribute('role') === 'button' ||
          target.classList.contains('interactive-target'))
      ) {
        setIsPointer(true);
      } else {
        setIsPointer(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="custom-cursor-element pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Center dot */}
      <motion.div
        className="fixed top-0 left-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      />
      {/* Outer tracking ring */}
      <motion.div
        className="fixed top-0 left-0 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30"
        style={{
          x: cursorX,
          y: cursorY,
          width: isPointer ? 48 : 28,
          height: isPointer ? 48 : 28,
          backgroundColor: isPointer ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
          borderColor: isPointer ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.25)',
        }}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 300,
        }}
      />
    </div>
  );
}
