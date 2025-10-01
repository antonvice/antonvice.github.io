import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { BlogPost } from '../lib/posts';

interface MarkdownPostProps {
  post: BlogPost;
}

export default function MarkdownPost({ post }: MarkdownPostProps) {
  return (
    <div className="prose prose-lg prose-invert max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-4xl md:text-5xl font-bold text-accent-cyan neon-glow mb-6 leading-tight font-rajdhani">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-bold text-accent-yellow mb-4 mt-8 font-rajdhani" style={{ textShadow: '0 0 8px rgba(254,211,63,0.5)' }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-semibold text-nav-link mb-3 mt-6 font-rajdhani">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-gray-300 leading-relaxed mb-6 text-lg">
              {children}
            </p>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="text-nav-link hover:text-accent-yellow transition-colors duration-300 underline hover:no-underline"
              target={href?.startsWith('http') ? '_blank' : undefined}
              rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong className="text-accent-coral font-semibold">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="text-accent-yellow italic">
              {children}
            </em>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-accent-cyan/10 text-nav-link px-2 py-1 rounded text-sm font-mono">
                  {children}
                </code>
              );
            }
            return (
              <code className={className}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="card-glass p-6 my-6 overflow-x-hidden border border-glass-border-color rounded-lg" style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-accent-yellow pl-6 ml-0 my-6 italic text-accent-yellow bg-accent-yellow/5 py-4">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-6 space-y-2 text-gray-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-6 space-y-2 text-gray-300">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-300 leading-relaxed">
              {children}
            </li>
          ),
          img: ({ src, alt }) => (
            <img 
              src={src} 
              alt={alt} 
              className="w-full rounded-lg shadow-lg my-8 border border-card-border"
            />
          ),
          hr: () => (
            <hr className="border-t border-accent-cyan/30 my-12" />
          ),
        }}
      >
        {post.content}
      </ReactMarkdown>
    </div>
  );
}