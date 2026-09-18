import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onNavigate?: (id: string) => void;
}

export function Navbar({ onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Projects', href: '#projects' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Journey', href: '#journey' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      onNavigate?.(targetId);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 py-4 md:px-8 md:py-6 pointer-events-none transition-all duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between pointer-events-auto">
        {/* TOP LEFT: PORTFOLIO with same premium small pill treatment */}
        <a
          href="#hero"
          onClick={(e) => handleLinkClick(e, '#hero')}
          className="group flex items-center gap-2 rounded-full px-3.5 py-1.5 transition-all duration-200 glass-nav hover:border-white/20"
          aria-label="Portfolio Home"
        >
          <span className="font-display text-[11px] sm:text-xs font-semibold tracking-[0.2em] text-white uppercase">
            PORTFOLIO
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
        </a>

        {/* Center Desktop Navigation (subtle glass pill) */}
        <nav
          className={`hidden lg:flex items-center gap-1 rounded-full px-2 py-1.5 transition-all duration-300 ${
            scrolled ? 'glass-nav shadow-lg' : 'bg-black/30 backdrop-blur-md border border-white/5'
          }`}
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="relative rounded-full px-3.5 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:text-white hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* TOP RIGHT: GitHub icon | LinkedIn icon | Menu */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* GitHub Icon Link */}
          <a
            href="https://github.com/hgdduf93-pixel"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Deep Singh GitHub Profile"
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full glass-nav text-neutral-300 transition-all hover:border-white/25 hover:text-white hover:scale-105 active:scale-95"
          >
            <Github className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </a>

          {/* LinkedIn Icon Link */}
          <a
            href="https://www.linkedin.com/in/dav-deep-056a55174"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Deep Singh LinkedIn Profile"
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full glass-nav text-neutral-300 transition-all hover:border-white/25 hover:text-white hover:scale-105 active:scale-95"
          >
            <Linkedin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </a>

          {/* Menu Icon Toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close Menu' : 'Open Navigation Menu'}
            aria-expanded={menuOpen}
            className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full glass-nav text-neutral-200 transition-all hover:border-white/25 hover:text-white active:scale-95"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Navigation Drawer Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="pointer-events-auto mt-3 mx-auto max-w-sm rounded-2xl glass-nav p-4 shadow-2xl border border-white/10"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium text-neutral-200 hover:bg-white/10 transition-colors"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-neutral-400" />
                </a>
              ))}
              <div className="my-2 border-t border-white/10" />
              <div className="flex items-center justify-between px-3 pt-1">
                <span className="text-xs font-mono text-neutral-400">Verified Profiles:</span>
                <div className="flex gap-2">
                  <a
                    href="https://github.com/hgdduf93-pixel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-neutral-200 hover:text-white hover:bg-white/10"
                    aria-label="GitHub Profile"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/dav-deep-056a55174"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-neutral-200 hover:text-white hover:bg-white/10"
                    aria-label="LinkedIn Profile"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
