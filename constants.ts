import { ProjectData } from './types';

export const MOCK_PROJECTS: ProjectData[] = [
  {
    id: 'proj_1',
    name: 'zen-garden-analytics',
    url: 'vercel.com', 
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    framework: 'Next.js',
    status: 'READY'
  },
  {
    id: 'proj_2',
    name: 'mono-repo-dashboard',
    url: 'nextjs.org',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    framework: 'React',
    status: 'READY'
  },
  {
    id: 'proj_3',
    name: 'linear-clone-v2',
    url: 'linear.app',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    framework: 'Vue.js',
    status: 'BUILDING'
  },
  {
    id: 'proj_4',
    name: 'hyper-commerce',
    url: 'supa-b.com',
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    framework: 'Svelte',
    status: 'ERROR'
  }
];

export const SHIMMER_ANIMATION = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5 } }
};
