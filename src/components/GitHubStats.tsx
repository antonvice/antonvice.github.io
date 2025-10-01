import React, { useEffect, useState } from 'react';
import GlassCard from './GlassCard';
import axios from 'axios';

/**
 * GitHub user statistics interface
 */
interface GitHubUserStats {
  public_repos: number;
  followers: number;
  following: number;
  public_gists: number;
  total_stars: number;
  total_forks: number;
  mostUsedLanguages: { name: string; percentage: number; color: string }[];
  contributions: number;
}

/**
 * GitHubStats Component
 * Displays comprehensive GitHub statistics for the user
 */
const GitHubStats: React.FC = () => {
  const [stats, setStats] = useState<GitHubUserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const username = 'antonvice';
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch user data
        const userResponse = await axios.get(`https://api.github.com/users/${username}`);
        const userData = userResponse.data;
        
        // Fetch all repos to calculate total stars and forks
        const reposResponse = await axios.get(
          `https://api.github.com/users/${username}/repos`,
          { params: { per_page: 100 } }
        );
        const repos = reposResponse.data;
        
        // Calculate total stars and forks
        const totalStars = repos.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0);
        const totalForks = repos.reduce((sum: number, repo: any) => sum + repo.forks_count, 0);
        
        // Calculate language statistics
        const languageCounts: Record<string, number> = {};
        repos.forEach((repo: any) => {
          if (repo.language) {
            languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
          }
        });
        
        // Convert to percentage and get top languages
        const totalRepos = repos.length;
        const mostUsedLanguages = Object.entries(languageCounts)
          .map(([name, count]) => ({
            name,
            percentage: Math.round((count / totalRepos) * 100),
            color: getLanguageColor(name)
          }))
          .sort((a, b) => b.percentage - a.percentage)
          .slice(0, 6);
        
        // Set the stats
        setStats({
          public_repos: userData.public_repos,
          followers: userData.followers,
          following: userData.following,
          public_gists: userData.public_gists,
          total_stars: totalStars,
          total_forks: totalForks,
          mostUsedLanguages,
          contributions: 0 // This would need GraphQL API to get accurate data
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching GitHub stats:', err);
        setError('Failed to load GitHub statistics');
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  /**
   * Get color for programming language
   */
  const getLanguageColor = (language: string): string => {
    const colors: Record<string, string> = {
      'JavaScript': '#f7df1e',
      'TypeScript': '#3178c6',
      'Python': '#3776ab',
      'Go': '#00add8',
      'Rust': '#dea584',
      'Java': '#ed8b00',
      'C++': '#00599c',
      'C': '#a8b9cc',
      'Swift': '#fa7343',
      'Kotlin': '#7f52ff',
      'PHP': '#777bb4',
      'Ruby': '#cc342d',
      'CSS': '#1572b6',
      'HTML': '#e34c26',
      'Vue': '#4fc08d',
      'Svelte': '#ff3e00',
      'Astro': '#ff5a05',
      'Shell': '#89e051',
    };
    
    return colors[language] || '#6b7280';
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-accent-cyan">Loading GitHub stats...</div>
      </div>
    );
  }
  
  if (error || !stats) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>{error || 'Failed to load statistics'}</p>
      </div>
    );
  }
  
  const statItems = [
    { label: 'Repositories', value: stats.public_repos, icon: '📦', color: 'text-accent-cyan' },
    { label: 'Total Stars', value: stats.total_stars, icon: '⭐', color: 'text-accent-yellow' },
    { label: 'Total Forks', value: stats.total_forks, icon: '🍴', color: 'text-electric-blue' },
    { label: 'Followers', value: stats.followers, icon: '👥', color: 'text-neon-pink' },
    { label: 'Following', value: stats.following, icon: '🔗', color: 'text-accent-coral' },
    { label: 'Gists', value: stats.public_gists, icon: '📝', color: 'text-green-400' },
  ];
  
  return (
    <div className="w-full">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
        {statItems.map((item) => (
          <GlassCard key={item.label} className="text-center hover:scale-105 transition-all duration-300" padding="large">
            <div className="text-3xl mb-2">{item.icon}</div>
            <div className={`text-3xl font-bold mb-2 font-cyberpunk ${item.color}`}>
              {item.value.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">{item.label}</div>
          </GlassCard>
        ))}
      </div>
      
      {/* Language Distribution */}
      <GlassCard className="p-8">
        <h3 className="text-2xl font-bold text-electric-blue mb-6 font-cyberpunk">
          Language Distribution
        </h3>
        
        <div className="space-y-4">
          {stats.mostUsedLanguages.map((lang) => (
            <div key={lang.name} className="relative">
              <div className="flex justify-between mb-2">
                <span className="text-gray-300 font-semibold">{lang.name}</span>
                <span className="text-gray-400">{lang.percentage}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: lang.color,
                    boxShadow: `0 0 10px ${lang.color}40`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* GitHub Profile Link */}
        <div className="mt-8 text-center">
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 border border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-dark transition-all duration-300 hover:shadow-lg hover:shadow-accent-cyan/50"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            View Full GitHub Profile
          </a>
        </div>
      </GlassCard>
    </div>
  );
};

export default GitHubStats;