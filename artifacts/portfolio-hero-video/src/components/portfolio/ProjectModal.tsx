import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Sparkles, CheckCircle2, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Project } from './types';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    // Reset image index and error when project changes
    setSelectedScreenshotIndex(0);
    setImgError(false);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const currentScreenshot =
    project.galleryScreenshots && project.galleryScreenshots[selectedScreenshotIndex]
      ? project.galleryScreenshots[selectedScreenshotIndex].url
      : project.screenshotUrl;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          aria-hidden="true"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0e1017] border border-white/15 p-5 sm:p-8 shadow-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-project-title"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close project modal"
            className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-neutral-300 transition-all hover:bg-white/20 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Modal Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Column: Visual Preview / Screenshots */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="relative w-full aspect-[9/16] max-h-[480px] rounded-2xl overflow-hidden bg-black/60 border border-white/10 flex items-center justify-center shadow-inner">
                {currentScreenshot && !imgError ? (
                  <img
                    src={currentScreenshot}
                    alt={`${project.name} screenshot`}
                    onError={() => setImgError(true)}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  /* Clean interface placeholder */
                  <div className="flex flex-col items-center justify-center p-6 text-center text-neutral-400">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/5 border border-white/10 mb-3">
                      <ImageIcon className="h-7 w-7 text-neutral-300" />
                    </div>
                    <span className="font-display text-sm font-bold text-white">
                      {project.name}
                    </span>
                    <p className="mt-1 font-mono text-xs text-neutral-400 max-w-xs">
                      {project.status === 'COMING SOON' ? 'Interactive preview under development' : 'Mobile interface preview'}
                    </p>
                  </div>
                )}

                {/* Badge Overlay */}
                <div className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 font-mono text-[10px] text-neutral-300 border border-white/10">
                  {project.highlightStat}
                </div>
              </div>

              {/* Gallery Thumbnails (if multiple exist) */}
              {project.galleryScreenshots && project.galleryScreenshots.length > 1 && (
                <div className="mt-4 flex gap-2 overflow-x-auto pb-1 max-w-full justify-center">
                  {project.galleryScreenshots.map((item, idx) => (
                    <button
                      key={item.url}
                      onClick={() => {
                        setSelectedScreenshotIndex(idx);
                        setImgError(false);
                      }}
                      className={`relative flex-shrink-0 h-16 w-11 rounded-lg overflow-hidden border transition-all ${
                        selectedScreenshotIndex === idx
                          ? 'border-white ring-2 ring-white/30 scale-105'
                          : 'border-white/20 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Project Details & Features */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-full bg-white/10 px-3 py-0.5 text-xs font-mono text-neutral-300">
                  {project.category}
                </span>
                <span className="font-mono text-xs text-neutral-400">Verified Project</span>
              </div>

              <h3
                id="modal-project-title"
                className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
              >
                {project.name}
              </h3>

              <p className="mt-3 text-sm text-neutral-300/90 leading-relaxed">
                {project.longDescription || project.description}
              </p>

              {/* Verified Features list if available */}
              {project.keyFeatures && project.keyFeatures.length > 0 && (
                <div className="mt-5 rounded-xl bg-white/[0.03] border border-white/10 p-4">
                  <h4 className="font-display text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2.5">
                    Actual Project Capabilities
                  </h4>
                  <ul className="space-y-2">
                    {project.keyFeatures.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-neutral-300/80">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Technologies Detected */}
              <div className="mt-5">
                <h4 className="font-mono text-[11px] uppercase tracking-wider text-neutral-400 mb-2">
                  Detected Technologies
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg bg-white/5 px-2.5 py-1 text-xs font-mono text-neutral-200 border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Direct Links */}
              <div className="mt-8 flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-black transition-all hover:bg-neutral-200 active:scale-95 shadow-md"
                  >
                    <Github className="h-4 w-4" />
                    <span>View on GitHub</span>
                    <ExternalLink className="h-3.5 w-3.5 text-neutral-600" />
                  </a>
                )}

                {project.viewLink && project.viewLink !== project.githubLink && (
                  <a
                    href={project.viewLink}
                    target={project.viewLink.startsWith('#') ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    onClick={() => {
                      if (project.viewLink.startsWith('#')) onClose();
                    }}
                    className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/20 border border-white/10 active:scale-95"
                  >
                    <span>Launch</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
