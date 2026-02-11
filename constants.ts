import { ProjectData } from './types';

export interface CuratedProject extends ProjectData {
  featured: boolean;
}

// Curated source list from your Vercel account.
// Set `featured: true` only for projects you want in the public portfolio.
export const ALL_VERCEL_PROJECTS: CuratedProject[] = [
  {
    id: 'vercel_zen_garden_analytics',
    name: 'zen-garden-analytics',
    url: 'https://zen-garden-analytics.vercel.app',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    framework: 'Next.js',
    status: 'READY',
    featured: true
  },
  {
    id: 'vercel_mono_repo_dashboard',
    name: 'mono-repo-dashboard',
    url: 'https://mono-repo-dashboard.vercel.app',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    framework: 'React',
    status: 'READY',
    featured: true
  },
  {
    id: 'vercel_linear_clone_v2',
    name: 'linear-clone-v2',
    url: 'https://linear-clone-v2.vercel.app',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    framework: 'Vue.js',
    status: 'BUILDING',
    featured: false
  },
  {
    id: 'vercel_hyper_commerce',
    name: 'hyper-commerce',
    url: 'https://hyper-commerce.vercel.app',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    framework: 'Svelte',
    status: 'ERROR',
    featured: false
  }
];

export const PORTFOLIO_PROJECTS: ProjectData[] = ALL_VERCEL_PROJECTS.filter((project) => project.featured);
