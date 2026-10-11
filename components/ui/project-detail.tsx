"use client";

import { useState } from "react";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import { ProjectDetailLayout, type AdjacentProject } from "./project-detail-layout";
import { PROJECT_ORDER, type HeroProjectKey, type ProjectKey } from "./project-tab-bar";
import { HERO_PROJECT_CONFIGS, HeroProjectContent } from "./hero-project-detail";
import { SECTION_PROJECT_CONFIGS, SectionProjectContent } from "./section-project-detail";

interface ProjectDetailProps {
  activeProject: ProjectKey;
  onCloseStart: () => void;
  onClose: () => void;
  onOpenComplete?: () => void;
  onNavigate?: (key: ProjectKey) => void;
}

type ProjectConfig = {
  title: string;
  icon: string;
  iconRotate?: string;
  tags: string[];
  appStore?: boolean;
  downloadUrl?: string;
  shortDescription: React.ReactNode;
  longDescription: string;
};

const CONFIGS: Record<ProjectKey, ProjectConfig> = { ...HERO_PROJECT_CONFIGS, ...SECTION_PROJECT_CONFIGS };

const isHeroProject = (key: ProjectKey): key is HeroProjectKey => key in HERO_PROJECT_CONFIGS;

/**
 * One panel for every project, however it was opened. A single instance is what
 * lets a tab switch slide between any two of them instead of closing and reopening.
 */
export function ProjectDetail({ activeProject, onCloseStart, onClose, onOpenComplete, onNavigate }: ProjectDetailProps) {
  const { isMobile } = useBreakpoint();
  const [prevProject, setPrevProject] = useState<ProjectKey>(activeProject);
  const [slideDirection, setSlideDirection] = useState(0);

  if (activeProject !== prevProject) {
    const prevIdx = PROJECT_ORDER.indexOf(prevProject);
    const currIdx = PROJECT_ORDER.indexOf(activeProject);
    setSlideDirection(currIdx > prevIdx ? 1 : -1);
    setPrevProject(activeProject);
  }

  const config = CONFIGS[activeProject];

  const activeIdx = PROJECT_ORDER.indexOf(activeProject);
  const adjacent = (key: ProjectKey | undefined): AdjacentProject | undefined =>
    key && onNavigate
      ? { title: CONFIGS[key].title, icon: CONFIGS[key].icon, iconRotate: CONFIGS[key].iconRotate, onSelect: () => onNavigate(key) }
      : undefined;

  return (
    <ProjectDetailLayout
      onCloseStart={onCloseStart}
      onClose={onClose}
      title={config.title}
      icon={config.icon}
      iconRotate={config.iconRotate}
      tags={config.tags}
      appStore={config.appStore}
      downloadUrl={config.downloadUrl}
      shortDescription={config.shortDescription}
      longDescription={config.longDescription}
      contentKey={activeProject}
      slideDirection={slideDirection}
      onOpenComplete={onOpenComplete}
      prevProject={adjacent(PROJECT_ORDER[activeIdx - 1])}
      nextProject={adjacent(PROJECT_ORDER[activeIdx + 1])}
    >
      {isHeroProject(activeProject) ? (
        <HeroProjectContent project={activeProject} isMobile={isMobile} />
      ) : (
        <SectionProjectContent project={activeProject} isMobile={isMobile} />
      )}
    </ProjectDetailLayout>
  );
}
