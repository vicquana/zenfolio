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

const normalizeUrl = (input) => {
  if (!input || typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  const withProtocol = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
  try {
    return new URL(withProtocol).toString();
  } catch {
    return null;
  }
};

const looksLikeProtectedPreviewHost = (hostname) => {
  if (!hostname.endsWith('.vercel.app')) return false;
  // Typical preview hostnames often include random deployment ids.
  return /-[a-z0-9]{8,}-/.test(hostname) || hostname.includes('-git-');
};

const urlScore = (url, projectName) => {
  try {
    const host = new URL(url).hostname.toLowerCase();
    const name = String(projectName || '').toLowerCase();
    if (!host.endsWith('.vercel.app')) return 0; // Custom domain: best.
    if (looksLikeProtectedPreviewHost(host)) return 4; // Likely protected preview URL.
    if (host === `${name}.vercel.app`) return 1; // Canonical production domain.
    if (host.startsWith(`${name}-`)) return 2; // Team-scoped stable alias.
    return 3; // Other vercel.app domains.
  } catch {
    return 99;
  }
};

const pickBestUrl = (project) => {
  const production = project.targets?.production;
  const latest = project.latestDeployments?.[0];
  const fallback = `${project.name}.vercel.app`;
  const candidates = [
    production?.alias?.[0],
    production?.url,
    ...(Array.isArray(project.alias) ? project.alias : []),
    ...(Array.isArray(latest?.alias) ? latest.alias : []),
    latest?.url,
    fallback,
  ]
    .map((value) => normalizeUrl(value))
    .filter(Boolean);

  if (candidates.length === 0) return `https://${fallback}`;

  const sorted = [...new Set(candidates)].sort(
    (a, b) => urlScore(a, project.name) - urlScore(b, project.name),
  );
  return sorted[0];
};

const normalized = projects.map((project) => {
  const production = project.targets?.production;
  const latest = project.latestDeployments?.[0];
  const url = pickBestUrl(project);
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
