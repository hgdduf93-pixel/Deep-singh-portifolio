export interface Project {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  viewLink: string;
  githubLink?: string;
  previewType: 'game' | 'mobile' | 'portfolio' | 'screenshot' | 'coming-soon';
  accentColor: string;
  highlightStat: string;
  status?: string;
  screenshotUrl?: string;
  galleryScreenshots?: { url: string; title: string }[];
  keyFeatures?: string[];
  isExternalLink?: boolean;
}

export interface SkillItem {
  name: string;
  category: 'web' | 'tools' | 'software' | 'design';
  description: string;
  iconName: string;
}

export interface JourneyMilestone {
  period: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
}
