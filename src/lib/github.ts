import axios from 'axios';
import { z } from 'zod';

// GitHub repository schema
const GitHubRepoSchema = z.object({
  id: z.number(),
  name: z.string(),
  full_name: z.string(),
  description: z.string().nullable(),
  html_url: z.string(),
  language: z.string().nullable(),
  stargazers_count: z.number(),
  forks_count: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  topics: z.array(z.string()).optional().default([]),
  fork: z.boolean(),
  private: z.boolean(),
  homepage: z.string().nullable(),
});

export type GitHubRepo = z.infer<typeof GitHubRepoSchema>;

/**
 * Get programming language color
 */
export function getLanguageColor(language: string | null): string {
  if (!language) return '#6b7280';
  
  const colors: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#2b7489',
    Python: '#3572A5',
    Java: '#b07219',
    'C++': '#f34b7d',
    C: '#555555',
    'C#': '#178600',
    Go: '#00ADD8',
    Rust: '#dea584',
    Swift: '#ffac45',
    Kotlin: '#F18E33',
    Ruby: '#701516',
    PHP: '#4F5D95',
    HTML: '#e34c26',
    CSS: '#563d7c',
    SCSS: '#c6538c',
    Vue: '#4FC08D',
    Shell: '#89e051',
    Dockerfile: '#384d54',
    Makefile: '#427819',
    'Jupyter Notebook': '#DA5B0B',
    Markdown: '#083fa1',
    YAML: '#cb171e',
    JSON: '#292929',
    XML: '#0060ac',
    SQL: '#e38c00',
    GraphQL: '#e10098',
    R: '#198CE7',
    MATLAB: '#e16737',
    Scala: '#c22d40',
    Perl: '#0298c3',
    Lua: '#000080',
    Dart: '#00B4AB',
    Elixir: '#6e4a7e',
    Clojure: '#db5855',
    Haskell: '#5e5086',
    'Objective-C': '#438eff',
    Assembly: '#6E4C13',
    WebAssembly: '#04133b',
    Solidity: '#AA6746',
    'Vim script': '#199f4b',
    TeX: '#3D6117',
    Processing: '#0096D8',
    Arduino: '#bd79d1',
    Fortran: '#4d41b1',
    COBOL: '#0D597F',
    Pascal: '#E3F171',
    Groovy: '#e69f56',
    Erlang: '#B83998',
    Zig: '#ec915c',
    Julia: '#a270ba',
    Nim: '#ffc200',
    Crystal: '#000100',
    OCaml: '#3be133',
    'F#': '#b845fc',
    ReScript: '#e6484f',
    Reason: '#ff5847',
    Elm: '#60B5CC',
    PureScript: '#1D222D',
    CoffeeScript: '#244776',
    Svelte: '#ff3e00',
    Astro: '#ff5a03',
    TSX: '#2b7489',
    JSX: '#f1e05a',
    MDX: '#fcb32c'
  };
  
  return colors[language] || '#6b7280';
}

const GITHUB_USERNAME = 'antonvice';
const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;

/**
 * Fetch all public repositories for a user with pagination
 */
export async function getAllRepos(username: string = GITHUB_USERNAME): Promise<GitHubRepo[]> {
  const allRepos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;

  try {
    while (true) {
      const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
        params: {
          per_page: perPage,
          page: page,
          sort: 'updated',
          direction: 'desc'
        },
        headers: GITHUB_TOKEN ? {
          Authorization: `token ${GITHUB_TOKEN}`
        } : {}
      });

      if (response.data.length === 0) break;
      
      allRepos.push(...response.data);
      if (response.data.length < perPage) break;
      page++;
    }

    return allRepos;
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    return [];
  }
}

/**
 * Get pinned repositories using GraphQL API
 */
export async function getPinnedRepos(username: string = GITHUB_USERNAME): Promise<GitHubRepo[]> {
  if (!GITHUB_TOKEN) {
    // Fallback to top repositories if no token
    const repos = await getAllRepos(username);
    return repos.filter(r => !r.fork).slice(0, 6);
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        pinnedItems(first: 6, types: [REPOSITORY]) {
          nodes {
            ... on Repository {
              id: databaseId
              name
              full_name: nameWithOwner
              description
              html_url: url
              stargazers_count: stargazerCount
              forks_count: forkCount
              language: primaryLanguage {
                name
              }
              created_at: createdAt
              updated_at: updatedAt
              homepage: homepageUrl
              topics: repositoryTopics(first: 10) {
                nodes {
                  topic {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post('https://api.github.com/graphql', 
      { query, variables: { username } },
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}` } }
    );

    const nodes = response.data?.data?.user?.pinnedItems?.nodes || [];
    return nodes.map((node: any) => ({
      ...node,
      language: node.language?.name || null,
      topics: node.topics?.nodes?.map((t: any) => t.topic.name) || [],
      fork: false,
      private: false
    }));
  } catch (error) {
    console.error('Error fetching pinned repos:', error);
    return [];
  }
}
/**
 * githubService object to wrap all GitHub related functionality
 */
export const githubService = {
  getAllRepos,
  getPinnedRepos,
  getLanguageColor,

  /**
   * Fetch all repositories and sort them into categories
   */
  async getAllRepositoriesSorted() {
    const all = await getAllRepos();
    const pinned = await getPinnedRepos();
    
    // Featured are pinned or high star count
    const featured = all.filter(repo => 
      pinned.some(p => p.id === repo.id) || repo.stargazers_count >= 5
    ).sort((a, b) => b.stargazers_count - a.stargazers_count);

    // Others are the rest
    const others = all.filter(repo => !featured.some(f => f.id === repo.id));

    return {
      pinned,
      featured,
      others,
      all
    };
  },

  /**
   * Format repository for display
   */
  formatRepository(repo: GitHubRepo) {
    return {
      id: repo.id,
      name: repo.name,
      title: repo.name, // Keep for backward compatibility
      description: repo.description || 'No description provided.',
      tags: repo.language ? [repo.language] : [],
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      forks_count: repo.forks_count,
      stars: repo.stargazers_count, // Keep for backward compatibility
      forks: repo.forks_count, // Keep for backward compatibility
      html_url: repo.html_url,
      link: repo.html_url, // Keep for backward compatibility
      github: repo.html_url, // Keep for backward compatibility
      updatedAt: repo.updated_at,
      isFork: repo.fork,
      topics: repo.topics
    };
  }
};
