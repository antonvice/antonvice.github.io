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
  topics: z.array(z.string()),
  fork: z.boolean(),
  private: z.boolean(),
  homepage: z.string().nullable(),
});

export type GitHubRepo = z.infer<typeof GitHubRepoSchema>;

const GitHubReposSchema = z.array(GitHubRepoSchema);

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

class GitHubService {
  private baseURL = 'https://api.github.com';
  private username = 'antonvice';
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
  
  constructor() {
    // Configure axios with default headers
    axios.defaults.headers.common['Accept'] = 'application/vnd.github.v3+json';
    axios.defaults.headers.common['User-Agent'] = 'vice-portfolio';
    
    // Add GitHub token if available (optional, increases rate limit)
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      axios.defaults.headers.common['Authorization'] = `token ${token}`;
    }
  }

  /**
   * Check if cached data is still valid
   */
  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.cacheTimeout;
  }

  /**
   * Get cached data if valid
   */
  private getCached<T>(key: string): T | null {
    if (this.isCacheValid(key)) {
      return this.cache.get(key)?.data || null;
    }
    return null;
  }

  /**
   * Set cache data
   */
  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Format repository data for display
   */
  formatRepository(repo: GitHubRepo) {
    return {
      ...repo,
      languageColor: getLanguageColor(repo.language),
      formattedDate: new Date(repo.updated_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    };
  }

  /**
   * Get all repositories sorted into categories
   */
  async getAllRepositoriesSorted() {
    const cacheKey = 'all-repos-sorted';
    
    // Check cache first
    const cached = this.getCached<any>(cacheKey);
    if (cached) {
      console.log('Using cached sorted repositories');
      return cached;
    }

    try {
      const [repos, pinnedNames] = await Promise.all([
        this.getRepositories(),
        this.getPinnedRepositories()
      ]);

      const pinnedSet = new Set(pinnedNames);
      const featuredNames = new Set([
        'selflayer-dash',
        'pocker',
        'vice',
        'pytorch',
        'slbrowser',
        'v07'
      ]);

      // Categorize repositories
      const pinned = repos.filter(r => pinnedSet.has(r.name));
      const featured = repos.filter(r => !pinnedSet.has(r.name) && featuredNames.has(r.name));
      const others = repos.filter(r => !pinnedSet.has(r.name) && !featuredNames.has(r.name));

      // Sort pinned by the order in pinnedNames
      pinned.sort((a, b) => {
        const aIndex = pinnedNames.indexOf(a.name);
        const bIndex = pinnedNames.indexOf(b.name);
        return aIndex - bIndex;
      });

      // Sort featured and others by stars and recency
      const sortByActivity = (a: GitHubRepo, b: GitHubRepo) => {
        const aScore = a.stargazers_count * 2 + (new Date(a.updated_at).getTime() / 1000000);
        const bScore = b.stargazers_count * 2 + (new Date(b.updated_at).getTime() / 1000000);
        return bScore - aScore;
      };

      featured.sort(sortByActivity);
      others.sort(sortByActivity);

      const all = [...pinned, ...featured, ...others];

      const result = {
        pinned,
        featured,
        others,
        all
      };

      // Cache for 10 minutes
      this.setCache(cacheKey, result);

      return result;
    } catch (error) {
      console.error('Error getting sorted repositories:', error);
      return {
        pinned: [],
        featured: [],
        others: [],
        all: []
      };
    }
  }

  /**
   * Fetches all public repositories for the user
   */
  async getRepositories(): Promise<GitHubRepo[]> {
    const cacheKey = 'repositories';
    
    // Check cache first
    const cached = this.getCached<GitHubRepo[]>(cacheKey);
    if (cached) {
      console.log('Using cached repositories');
      return cached;
    }

    try {
      const response = await axios.get(
        `${this.baseURL}/users/${this.username}/repos`,
        {
          params: {
            type: 'public',
            sort: 'updated',
            direction: 'desc',
            per_page: 100,
          },
          timeout: 10000, // 10 second timeout
        }
      );

      // Validate the response data
      const repos = GitHubReposSchema.parse(response.data);
      
      // Filter out forked repositories and private ones
      const filtered = repos.filter(repo => !repo.fork && !repo.private);
      
      // Cache the result
      this.setCache(cacheKey, filtered);
      
      return filtered;
    } catch (error) {
      console.error('Error fetching GitHub repositories:', error);
      
      // Return cached data even if expired as fallback
      const fallback = this.cache.get(cacheKey)?.data;
      if (fallback) {
        console.log('Using expired cache as fallback');
        return fallback;
      }
      
      return [];
    }
  }

  /**
   * Fetches pinned repositories from GitHub profile
   */
  async getPinnedRepositories(): Promise<string[]> {
    try {
      // GitHub doesn't have a direct API for pinned repos, but we can use GraphQL
      // For now, we'll use a predefined list that you can update
      return [
        'DreamDiffusion',
        'SelfTUI',
        'moondream',
        'my-blog',
        'arasaka2',
        'mondr'
      ];
    } catch (error) {
      console.error('Error fetching pinned repositories:', error);
      return [];
    }
  }

  /**
   * Fetches featured repositories (you can customize this logic)
   */
  async getFeaturedRepositories(): Promise<GitHubRepo[]> {
    const cacheKey = 'featured-repositories';
    
    // Check cache first
    const cached = this.getCached<GitHubRepo[]>(cacheKey);
    if (cached) {
      console.log('Using cached featured repositories');
      return cached;
    }

    const allRepos = await this.getRepositories();
    const pinnedNames = await this.getPinnedRepositories();
    
    // Additional featured repositories based on criteria
    const additionalFeatured = [
      'selflayer-dash',
      'pocker',
      'vice',
      'pytorch',
      'slbrowser',
      'v07'
    ];
    
    // Combine pinned and additional featured names
    const featuredNames = [...new Set([...pinnedNames, ...additionalFeatured])];
    
    // Separate pinned and other repos
    const pinnedRepos = allRepos.filter(repo => pinnedNames.includes(repo.name));
    const otherFeaturedRepos = allRepos.filter(repo => 
      !pinnedNames.includes(repo.name) && (
        additionalFeatured.includes(repo.name) || 
        repo.stargazers_count > 5 ||
        (repo.topics && repo.topics.length > 2)
      )
    );
    
    // Sort pinned repos by the order in pinnedNames
    pinnedRepos.sort((a, b) => {
      const aIndex = pinnedNames.indexOf(a.name);
      const bIndex = pinnedNames.indexOf(b.name);
      return aIndex - bIndex;
    });
    
    // Sort other repos by stars and recent activity
    otherFeaturedRepos.sort((a, b) => {
      const aScore = a.stargazers_count * 2 + (new Date(a.updated_at).getTime() / 1000000);
      const bScore = b.stargazers_count * 2 + (new Date(b.updated_at).getTime() / 1000000);
      return bScore - aScore;
    });
    
    // Combine: pinned first, then other featured repos
    const featured = [...pinnedRepos, ...otherFeaturedRepos].slice(0, 12);
    
    // Cache the result
    this.setCache(cacheKey, featured);
    
    return featured;
  }

  /**
   * Get repository languages statistics
   */
  async getRepositoryLanguages(repoName: string): Promise<Record<string, number>> {
    const cacheKey = `languages-${repoName}`;
    
    // Check cache first
    const cached = this.getCached<Record<string, number>>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const response = await axios.get(
        `${this.baseURL}/repos/${this.username}/${repoName}/languages`,
        { timeout: 5000 }
      );
      
      // Cache the result
      this.setCache(cacheKey, response.data);
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching languages for ${repoName}:`, error);
      return {};
    }
  }

  /**
   * Get repository statistics (commits, contributors, etc.)
   */
  async getRepositoryStats(repoName: string): Promise<any> {
    const cacheKey = `stats-${repoName}`;
    
    // Check cache first
    const cached = this.getCached<any>(cacheKey);
    if (cached) {
      return cached;
    }

    try {
      const [commits, contributors] = await Promise.all([
        axios.get(`${this.baseURL}/repos/${this.username}/${repoName}/commits`, {
          params: { per_page: 1 },
          timeout: 5000,
        }),
        axios.get(`${this.baseURL}/repos/${this.username}/${repoName}/contributors`, {
          params: { per_page: 100 },
          timeout: 5000,
        }),
      ]);

      const stats = {
        total_commits: parseInt(commits.headers.link?.match(/page=(\d+)>; rel="last"/)?.[1] || '1'),
        contributors_count: contributors.data.length,
      };
      
      // Cache the result
      this.setCache(cacheKey, stats);
      
      return stats;
    } catch (error) {
      console.error(`Error fetching stats for ${repoName}:`, error);
      return { total_commits: 0, contributors_count: 0 };
    }
  }

  /**
   * Format repository data for display
   */
  formatRepository(repo: GitHubRepo) {
    return {
      ...repo,
      formattedDate: new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(repo.updated_at)),
      
      languageColor: this.getLanguageColor(repo.language),
      
      shortDescription: repo.description 
        ? repo.description.length > 100 
          ? repo.description.substring(0, 100) + '...'
          : repo.description
        : 'No description available',
    };
  }

  /**
   * Get color for programming languages
   */
  private getLanguageColor(language: string | null): string {
    const colors: Record<string, string> = {
      'JavaScript': '#f7df1e',
      'TypeScript': '#3178c6',
      'Python': '#3776ab',
      'Go': '#00add8',
      'Rust': '#dea584',
      'Java': '#ed8b00',
      'C++': '#00599c',
      'C': '#a8b9cc',
      'C#': '#178600',
      'Swift': '#fa7343',
      'Kotlin': '#7f52ff',
      'PHP': '#777bb4',
      'Ruby': '#cc342d',
      'CSS': '#1572b6',
      'SCSS': '#c6538c',
      'HTML': '#e34c26',
      'Vue': '#4fc08d',
      'React': '#61dafb',
      'Svelte': '#ff3e00',
      'Astro': '#ff5a05',
      'Shell': '#89e051',
      'Bash': '#89e051',
      'Dart': '#00b4ab',
      'Flutter': '#02569b',
      'Jupyter Notebook': '#da5b0b',
      'Scala': '#dc322f',
      'Elixir': '#6e4a7e',
      'Haskell': '#5e5086',
      'Lua': '#000080',
      'Perl': '#0298c3',
      'R': '#198ce7',
      'MATLAB': '#e16737',
      'Julia': '#a270ba',
      'Objective-C': '#438eff',
      'Clojure': '#db5855',
      'Vim Script': '#199f4b',
      'PowerShell': '#012456',
      'Assembly': '#6e4c13',
      'Makefile': '#427819',
      'Dockerfile': '#384d54',
      'YAML': '#cb171e',
      'JSON': '#292929',
      'XML': '#0060ac',
      'Markdown': '#083fa1',
      'TeX': '#3d6117',
      'GLSL': '#5686a5'
    };
    
    return language ? (colors[language] || '#6b7280') : '#6b7280';
  }

  /**
   * Get all repositories sorted and categorized
   * Returns repositories grouped by pinned, featured, and others
   */
  async getAllRepositoriesSorted(): Promise<{
    pinned: GitHubRepo[];
    featured: GitHubRepo[];
    others: GitHubRepo[];
    all: GitHubRepo[];
  }> {
    const cacheKey = 'all-repositories-sorted';
    
    // Check cache first
    const cached = this.getCached<any>(cacheKey);
    if (cached) {
      console.log('Using cached sorted repositories');
      return cached;
    }

    const allRepos = await this.getRepositories();
    const pinnedNames = await this.getPinnedRepositories();
    
    // Additional featured repositories
    const featuredNames = [
      'selflayer-dash',
      'pocker',
      'vice',
      'slbrowser',
      'v07',
      'sf_bot',
      'sl_landings'
    ];
    
    // Categorize repositories
    const pinned: GitHubRepo[] = [];
    const featured: GitHubRepo[] = [];
    const others: GitHubRepo[] = [];
    
    allRepos.forEach(repo => {
      if (pinnedNames.includes(repo.name)) {
        pinned.push(repo);
      } else if (featuredNames.includes(repo.name) || 
                 repo.stargazers_count > 5 || 
                 (repo.topics && repo.topics.length > 2)) {
        featured.push(repo);
      } else {
        others.push(repo);
      }
    });
    
    // Sort each category
    // Pinned: maintain order from pinnedNames
    pinned.sort((a, b) => {
      const aIndex = pinnedNames.indexOf(a.name);
      const bIndex = pinnedNames.indexOf(b.name);
      return aIndex - bIndex;
    });
    
    // Featured: sort by stars and recent activity
    featured.sort((a, b) => {
      const aScore = a.stargazers_count * 2 + (new Date(a.updated_at).getTime() / 1000000);
      const bScore = b.stargazers_count * 2 + (new Date(b.updated_at).getTime() / 1000000);
      return bScore - aScore;
    });
    
    // Others: sort by update date
    others.sort((a, b) => {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
    
    const result = {
      pinned,
      featured,
      others,
      all: [...pinned, ...featured, ...others]
    };
    
    // Cache the result
    this.setCache(cacheKey, result);
    
    return result;
  }
}

// Export singleton instance
export const githubService = new GitHubService();