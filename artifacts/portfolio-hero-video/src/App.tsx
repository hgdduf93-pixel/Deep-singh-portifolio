import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

import { LoadingScreen } from '@/components/portfolio/LoadingScreen';
import { CustomCursor } from '@/components/portfolio/CustomCursor';
import { Navbar } from '@/components/portfolio/Navbar';
import { PersistentBackgroundVideo } from '@/components/portfolio/PersistentBackgroundVideo';
import { HeroSection } from '@/components/portfolio/HeroSection';
import { CinematicSection } from '@/components/portfolio/CinematicSection';
import { ProjectDock } from '@/components/portfolio/ProjectDock';
import { AboutSection } from '@/components/portfolio/AboutSection';
import { SkillsSection } from '@/components/portfolio/SkillsSection';
import { JourneySection } from '@/components/portfolio/JourneySection';
import { CreativeFeatureSection } from '@/components/portfolio/CreativeFeatureSection';
import { ContactSection } from '@/components/portfolio/ContactSection';
import { Footer } from '@/components/portfolio/Footer';
import { Video360Provider } from '@/context/Video360Context';

const queryClient = new QueryClient();

function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <Video360Provider>
      <div className="relative min-h-screen bg-black text-[#f4f4f6] selection:bg-white/20 selection:text-white overflow-x-hidden">
        {/* 
          Persistent Cinematic HTML5 Background Video Layer
          Runs uninterrupted from hero through projects, about, skills, journey,
          creative section, contact, and the footer.
        */}
        <PersistentBackgroundVideo />

        {/* Short cinematic loading screen */}
        <LoadingScreen onComplete={() => setLoadingComplete(true)} />

        {/* Desktop custom interactive pointer */}
        <CustomCursor />

        {/* Floating glass navigation */}
        <Navbar />

        <main className="relative z-10 w-full overflow-x-hidden">
          {/* Full-viewport cinematic video hero (strictly preserved) */}
          <HeroSection />

          {/* Featured projects horizontal gallery (inner cards alternate left/right) */}
          <CinematicSection id="projects" direction="center">
            <ProjectDock />
          </CinematicSection>

          {/* Editorial 3D About Section (enters from RIGHT) */}
          <CinematicSection id="about" direction="right">
            <AboutSection />
          </CinematicSection>

          {/* Interactive 3D Skills section (enters from LEFT) */}
          <CinematicSection id="skills" direction="left">
            <SkillsSection />
          </CinematicSection>

          {/* Factual 3D Journey Timeline (enters from RIGHT) */}
          <CinematicSection id="journey" direction="right">
            <JourneySection />
          </CinematicSection>

          {/* Cinematic 3D Typography Mantra Break (enters from LEFT) */}
          <CinematicSection id="creative" direction="left">
            <CreativeFeatureSection />
          </CinematicSection>

          {/* Premium 3D Contact Section (enters from RIGHT - opposite of creative) */}
          <CinematicSection id="contact" direction="right">
            <ContactSection />
          </CinematicSection>
        </main>

        {/* Minimalist Footer with video shining through (enters smoothly from below) */}
        <CinematicSection id="footer" isFooter={true} direction="up">
          <Footer />
        </CinematicSection>
      </div>
    </Video360Provider>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
