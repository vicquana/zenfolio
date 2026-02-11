import fs from 'node:fs/promises';

const token = process.env.VERCEL_TOKEN;

if (!token) {
  console.error('Missing VERCEL_TOKEN environment variable.');
  console.error('Example: VERCEL_TOKEN=xxxx pnpm sync:vercel');
  process.exit(1);
}

const endpoint = 'https://api.vercel.com/v9/projects?limit=100';

const response = await fetch(endpoint, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

if (!response.ok) {
  console.error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
  process.exit(1);
}

const payload = await response.json();
const projects = Array.isArray(payload?.projects) ? payload.projects : [];

const normalized = projects.map((project) => {
  const production = project.targets?.production;
  const latest = project.latestDeployments?.[0];
  const rawUrl = production?.url || production?.alias?.[0] || latest?.url || latest?.alias?.[0] || `${project.name}.vercel.app`;
  const url = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
  const readyState = String(production?.readyState || latest?.readyState || 'UNKNOWN').toUpperCase();
  const status = ['READY', 'ERROR', 'BUILDING'].includes(readyState) ? readyState : 'UNKNOWN';

  return {
    id: project.id,
    name: project.name,
    url,
    updatedAt: new Date(project.updatedAt).toISOString(),
    framework: project.framework || 'Other',
    status,
    featured: false,
  };
});

const outputPath = 'scripts/vercel-projects.snapshot.json';
await fs.writeFile(outputPath, JSON.stringify(normalized, null, 2) + '\n', 'utf8');

const tsBlock = [
  'export const ALL_VERCEL_PROJECTS: CuratedProject[] = [',
  ...normalized.map((p) =>
    `  { id: '${p.id}', name: '${p.name.replace(/'/g, "\\'")}', url: '${p.url}', updatedAt: '${p.updatedAt}', framework: '${p.framework.replace(/'/g, "\\'")}', status: '${p.status}', featured: false },`,
  ),
  '];',
].join('\n');

console.log(`Wrote ${normalized.length} projects to ${outputPath}`);
console.log('\nCopy this into constants.ts (then set featured: true only for public projects):\n');
console.log(tsBlock);
