export interface VercelProject {
  id: string;
  name: string;
  framework: string | null;
  updatedAt: number;
  targets?: {
    production?: {
      url: string;
      alias?: string[];
      readyState?: string;
    };
  };
  latestDeployments?: Array<{
    alias?: string[];
    url: string;
    readyState: string;
  }>;
}

export interface VercelApiResponse {
  projects: VercelProject[];
  pagination: {
    count: number;
    next: number | null;
    prev: number | null;
  };
}

export interface ProjectData {
  id: string;
  name: string;
  url: string;
  updatedAt: string;
  framework: string;
  status: 'READY' | 'ERROR' | 'BUILDING' | 'UNKNOWN';
}
