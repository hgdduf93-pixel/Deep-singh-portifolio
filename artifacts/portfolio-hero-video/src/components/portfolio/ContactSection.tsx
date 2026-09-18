import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  Github,
  Linkedin,
  Mail,
  Copy,
  Check,
  ArrowUpRight,
  Send,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export function ContactSection() {
  const [scrollIndex, setScrollIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [name, setName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');

  const emailAddress = (import.meta.env.VITE_CONTACT_EMAIL as string | undefined) || 'contact@deepsingh.dev';
  const sectionRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Subtle 3D tilt on scroll through Z-space (gentle, no scroll blocking)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const dockZ = useTransform(scrollYProgress, [0, 0.35, 0.8], [-20, 0, 0]);
  const dockRotateX = useTransform(scrollYProgress, [0, 0.35, 0.8], [3, 0, 0]);
  const dockOpacity = useTransform(scrollYProgress, [0, 0.25, 0.8], [0.8, 1, 1]);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !userEmail || !message) return;
    const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${userEmail}\n\nMessage:\n${message}`);
    window.location.href = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
    setFormSent(true);
  };

  const scrollToIndex = (idx: number) => {
    const nextIdx = Math.max(0, Math.min(2, idx));
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
      className="relative py-12 md:py-20 px-4 md:px-8 overflow-hidden select-none bg-transparent"
      aria-label="Contact and Collaboration"
      style={{ perspective: '1600px' }}
    >
      <div className="relative mx-auto max-w-7xl w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0.3, x: 30, rotateY: 3, scale: 0.98 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0, scale: 1 }}
          viewport={{ once: false, amount: 0.08, margin: '60px 0px 60px 0px' }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-10 gap-4 will-change-[transform,opacity]"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full glass-pill px-3.5 py-1 text-[11px] font-mono tracking-widest text-white uppercase mb-2.5 drop-shadow">
              <Sparkles className="h-3 w-3 text-white/90" />
              <span>CONTACT</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.08] drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              LET'S BUILD SOMETHING.
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-neutral-300 max-w-xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]">
              Connect directly on LinkedIn, inspect open-source code on GitHub, or send a direct message.
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={scrollIndex === 0}
              aria-label="Previous contact card"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 border border-white/20 text-white transition-all hover:bg-white/20 hover:border-white/40 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-md shadow-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              disabled={scrollIndex === 2}
              aria-label="Next contact card"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 border border-white/20 text-white transition-all hover:bg-white/20 hover:border-white/40 active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed backdrop-blur-md shadow-md"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Horizontal Contact Gallery */}
        <motion.div
          style={{
            z: dockZ,
            rotateX: dockRotateX,
            opacity: dockOpacity,
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
            {/* 1. LINKEDIN CARD */}
            <motion.div
              onMouseEnter={() => setHoveredIndex(0)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="perspective-1000 relative shrink-0 w-[clamp(280px,80vw,340px)] min-h-[400px] snap-center select-none flex flex-col justify-between will-change-[transform,opacity]"
              initial={{
                opacity: 0.3,
                x: 35,
                rotateY: 3,
                z: -20,
                scale: 0.98,
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
                scale: hoveredIndex === 0 ? 1.025 : 1,
                y: hoveredIndex === 0 ? -5 : [0, -3.5, 0],
              }}
              transition={{
                scale: { type: 'spring', damping: 24, stiffness: 260 },
                y: hoveredIndex === 0 ? { duration: 0.25 } : { repeat: Infinity, duration: 4.8, ease: 'easeInOut' },
                opacity: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0 },
                x: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0 },
                rotateY: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0 },
                z: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0 },
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="glass-dock relative h-full rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/30 text-blue-300 border border-blue-400/30 shadow-sm">
                      <Linkedin className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-300 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10">
                      Professional
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-white mb-1 drop-shadow">
                    LinkedIn
                  </h3>
                  <p className="font-mono text-xs text-neutral-300 mb-3">
                    dav-deep-056a55174
                  </p>
                  <p className="text-xs text-neutral-200 leading-relaxed drop-shadow">
                    Connect for professional inquiries, software engineering collaborations, and industry networking.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <a
                    href="https://www.linkedin.com/in/dav-deep-056a55174"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-mono text-xs font-semibold tracking-wider uppercase transition-all active:scale-95 shadow-sm"
                  >
                    <span>Open LinkedIn</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* 2. GITHUB CARD */}
            <motion.div
              onMouseEnter={() => setHoveredIndex(1)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="perspective-1000 relative shrink-0 w-[clamp(280px,80vw,340px)] min-h-[400px] snap-center select-none flex flex-col justify-between will-change-[transform,opacity]"
              initial={{
                opacity: 0.3,
                x: 35,
                rotateY: 3,
                z: -20,
                scale: 0.98,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
                rotateY: 0,
                z: 16,
                scale: 1,
              }}
              viewport={{ once: false, amount: 0.08, margin: '60px 0px 60px 0px' }}
              animate={{
                scale: hoveredIndex === 1 ? 1.025 : 1,
                y: hoveredIndex === 1 ? -5 : [0, -4, 0],
              }}
              transition={{
                scale: { type: 'spring', damping: 24, stiffness: 260 },
                y: hoveredIndex === 1 ? { duration: 0.25 } : { repeat: Infinity, duration: 5.2, ease: 'easeInOut' },
                opacity: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 },
                x: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 },
                rotateY: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 },
                z: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.08 },
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="glass-dock relative h-full rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white border border-white/20 shadow-sm">
                      <Github className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-neutral-300 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10">
                      Repositories
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-bold text-white mb-1 drop-shadow">
                    GitHub
                  </h3>
                  <p className="font-mono text-xs text-neutral-300 mb-3">
                    hgdduf93-pixel
                  </p>
                  <p className="text-xs text-neutral-200 leading-relaxed drop-shadow">
                    Browse active repositories, inspect Canvas game algorithms, Android Kotlin codebases, and commit history.
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <a
                    href="https://github.com/hgdduf93-pixel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-mono text-xs font-semibold tracking-wider uppercase transition-all active:scale-95 shadow-sm"
                  >
                    <span>View GitHub</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* 3. DIRECT MESSAGE / EMAIL CARD */}
            <motion.div
              onMouseEnter={() => setHoveredIndex(2)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="perspective-1000 relative shrink-0 w-[clamp(280px,80vw,340px)] min-h-[400px] snap-center select-none flex flex-col justify-between will-change-[transform,opacity]"
              initial={{
                opacity: 0.3,
                x: 35,
                rotateY: 3,
                z: -20,
                scale: 0.98,
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
                scale: hoveredIndex === 2 ? 1.025 : 1,
                y: hoveredIndex === 2 ? -5 : [0, -3.5, 0],
              }}
              transition={{
                scale: { type: 'spring', damping: 24, stiffness: 260 },
                y: hoveredIndex === 2 ? { duration: 0.25 } : { repeat: Infinity, duration: 4.6, ease: 'easeInOut' },
                opacity: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.16 },
                x: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.16 },
                rotateY: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.16 },
                z: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.16 },
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="glass-dock relative h-full rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shadow-sm">
                      <Mail className="h-5 w-5" />
                    </div>
                    <button
                      onClick={handleCopyEmail}
                      className="inline-flex items-center gap-1 font-mono text-[10px] text-neutral-300 hover:text-white px-2.5 py-1 rounded-full bg-white/10 border border-white/15 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy Email</span>
                        </>
                      )}
                    </button>
                  </div>

                  <h3 className="font-display text-xl font-bold text-white mb-1 drop-shadow">
                    Direct Connect
                  </h3>
                  <p className="font-mono text-xs text-neutral-300 mb-3 truncate">
                    {emailAddress}
                  </p>

                  <form onSubmit={handleSendMessage} className="space-y-2.5">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full rounded-lg bg-black/40 border border-white/15 px-3 py-1.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-white/40"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      required
                      className="w-full rounded-lg bg-black/40 border border-white/15 px-3 py-1.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-white/40"
                    />
                    <textarea
                      placeholder="Your Message..."
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="w-full rounded-lg bg-black/40 border border-white/15 px-3 py-1.5 text-xs text-white placeholder-neutral-400 focus:outline-none focus:border-white/40 resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full py-2 px-3 rounded-lg bg-white text-black font-semibold text-xs transition-all hover:bg-neutral-100 active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>{formSent ? 'Opening Mail Client...' : 'Send Message'}</span>
                      <Send className="h-3 w-3" />
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Pagination Dots */}
        <div className="mt-4 flex items-center justify-center gap-2">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => scrollToIndex(idx)}
              aria-label={`Go to contact card ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                scrollIndex === idx ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
