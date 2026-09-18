import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function LoadingScreen({ onComplete }: { onComplete?: () => void }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Quick, elegant 850ms transition so it never blocks or causes white flash
    const timer = setTimeout(() => {
      setShow(false);
      onComplete?.();
    }, 850);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#090a0f] text-white"
        >
          <div className="relative flex flex-col items-center">
            {/* Minimal glowing monogram / name */}
            <motion.div
              initial={{ opacity: 0, y: 12, letterSpacing: '0.4em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.3em' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="font-display text-sm font-semibold tracking-[0.3em] uppercase text-neutral-100"
            >
              DEEP SINGH
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="mt-2 text-[10px] font-mono tracking-widest text-neutral-400 uppercase"
            >
              Creative Developer
            </motion.div>

            {/* Subtle animated progress track */}
            <div className="relative mt-5 h-[1.5px] w-36 overflow-hidden rounded-full bg-neutral-800">
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 0.75, ease: 'easeInOut' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
