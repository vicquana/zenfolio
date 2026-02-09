import { VercelApiResponse, ProjectData, VercelProject } from '../types';

const VERCEL_API_ENDPOINT = 'https://api.vercel.com/v9/projects';

export const fetchProjects = async (token: string): Promise<ProjectData[]> => {
  try {
    const response = await fetch(VERCEL_API_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    });

    if (!response.ok) {
      if (response.status === 403 || response.status === 401) {
        throw new Error("Invalid Token");
      }
      throw new Error(`Vercel API Error: ${response.statusText}`);
    }

    const data: VercelApiResponse = await response.json();

    return data.projects.map((project: VercelProject) => {
      // Deep reasoning: Extract the best possible URL
      let productionUrl = '';
      
      if (project.targets?.production?.url) {
        productionUrl = project.targets.production.url;
      } else if (project.targets?.production?.alias && project.targets.production.alias.length > 0) {
        productionUrl = project.targets.production.alias[0];
      } else if (project.latestDeployments && project.latestDeployments.length > 0) {
        // Fallback to latest deployment if production target isn't set
        productionUrl = project.latestDeployments[0].url;
      }

      // Ensure URL has protocol for Microlink/Usage
      const fullUrl = productionUrl.startsWith('http') ? productionUrl : `https://${productionUrl}`;

      return {
        id: project.id,
        name: project.name,
        url: fullUrl,
        updatedAt: new Date(project.updatedAt).toISOString(),
        framework: project.framework || 'Other',
        status: (project.targets?.production?.readyState || 'READY').toUpperCase() as ProjectData['status'],
      };
    });

  } catch (error) {
    console.error("Failed to fetch Vercel projects:", error);
    throw error;
  }
};
