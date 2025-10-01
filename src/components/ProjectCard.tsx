import React from 'react';
import { Star, GitFork, ExternalLink, Github } from 'lucide-react';
import { cn } from '../lib/utils';
import DecryptedText from './DecryptedText';
import MagicBentoBase from './MagicBentoBase';
import type { GitHubRepo } from '../lib/github';

interface ProjectCardProps {
  repo: GitHubRepo & {
    formattedDate: string;
    languageColor: string;
    shortDescription: string;
  };
  className?: string;
}

export default function ProjectCard({ repo, className }: ProjectCardProps) {
  return (
    <MagicBentoBase className={cn("group", className)} padding="large">
      {/* Header with title and external links */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-semibold text-accent-cyan neon-glow truncate">
            <DecryptedText 
              text={repo.name}
              speed={30}
              maxIterations={15}
              animateOn="hover"
              className="text-accent-cyan"
              encryptedClassName="text-accent-cyan opacity-70"
            />
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            Updated {repo.formattedDate}
          </p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-accent-cyan transition-colors duration-300 hover:scale-110"
            title="View on GitHub"
          >
            <Github size={20} />
          </a>
          {repo.homepage && (
            <a
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-accent-yellow transition-colors duration-300 hover:scale-110"
              title="Live Demo"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="text-gray-300 mb-4 text-sm leading-relaxed">
        <DecryptedText 
          text={repo.shortDescription}
          speed={20}
          maxIterations={8}
          animateOn="view"
          sequential={true}
          revealDirection="start"
          className="text-gray-300"
          encryptedClassName="text-electric-blue opacity-60"
          characters="01<>{}[]()_+=-*/#@!$%^&"
        />
      </div>

      {/* Topics/Tags */}
      {repo.topics && repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {repo.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="px-2 py-1 text-xs bg-accent-coral/20 text-accent-coral border border-accent-coral/30 rounded-md"
            >
              #{topic}
            </span>
          ))}
          {repo.topics.length > 4 && (
            <span className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-md">
              +{repo.topics.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Footer with language, stars, and forks */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="flex items-center space-x-4">
          {repo.language && (
            <div className="flex items-center space-x-1">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: repo.languageColor }}
              />
              <span className="text-sm text-gray-400">{repo.language}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          {repo.stargazers_count > 0 && (
            <div className="flex items-center space-x-1">
              <Star size={16} />
              <span>{repo.stargazers_count}</span>
            </div>
          )}
          {repo.forks_count > 0 && (
            <div className="flex items-center space-x-1">
              <GitFork size={16} />
              <span>{repo.forks_count}</span>
            </div>
          )}
        </div>
      </div>
    </MagicBentoBase>
  );
}