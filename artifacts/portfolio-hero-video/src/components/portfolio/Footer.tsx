import { Github, Linkedin, ArrowUp } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      className="relative py-8 px-4 md:px-8 bg-black/30 backdrop-blur-md border-t border-white/10 text-neutral-300 select-none z-10"
      aria-label="Footer"
    >
      <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4">
        {/* Identity */}
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
          <span className="font-display text-base font-bold text-white tracking-wide drop-shadow">
            DEEP SINGH
          </span>
          <span className="font-mono text-xs text-neutral-300 mt-0.5 drop-shadow">
            Independent Creator / Developer
          </span>
        </div>

        {/* Links & Scroll to top */}
        <div className="flex items-center gap-3">
          <a
            href="https://www.linkedin.com/in/dav-deep-056a55174"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Deep Singh LinkedIn"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/40 border border-white/15 text-neutral-200 hover:text-white hover:border-white/35 transition-all shadow-sm"
          >
            <Linkedin className="h-4 w-4" />
          </a>

          <a
            href="https://github.com/hgdduf93-pixel"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Deep Singh GitHub"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/40 border border-white/15 text-neutral-200 hover:text-white hover:border-white/35 transition-all shadow-sm"
          >
            <Github className="h-4 w-4" />
          </a>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top of page"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/40 border border-white/15 text-neutral-200 hover:text-white hover:border-white/35 active:scale-95 transition-all shadow-sm"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
