import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { BlogPost } from '../lib/posts';

interface MarkdownPostProps {
  post: BlogPost;
}

function InteractiveLab({ src, title }: { src: string; title: string }) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const resize = () => {
      const height = frame.contentDocument?.documentElement.scrollHeight;
      if (height) frame.style.height = `${height}px`;
    };

    frame.addEventListener('load', resize);
    window.addEventListener('resize', resize);
    resize();
    return () => {
      frame.removeEventListener('load', resize);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <figure className="my-8 overflow-hidden rounded-lg border-[3px] border-dark bg-dark shadow-[6px_6px_0_var(--neo-ink)] sm:my-10 sm:shadow-[8px_8px_0_var(--neo-ink)]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-[3px] border-dark bg-accent-cyan px-3 py-2 text-sm font-black text-dark sm:px-4">
        <span>{title}</span>
        <a href={src} target="_blank" rel="noopener noreferrer" className="text-dark underline decoration-2 underline-offset-2">
          Open full screen
        </a>
      </div>
      <iframe
        ref={frameRef}
        src={src}
        title={title}
        loading="lazy"
        className="block h-[720px] min-h-[34rem] w-full border-0 bg-dark"
      />
    </figure>
  );
}

export default function MarkdownPost({ post }: MarkdownPostProps) {
  return (
    <div className="prose max-w-none text-[1.0625rem] sm:text-lg">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-5 font-rajdhani text-3xl font-black leading-tight text-accent-cyan neon-glow sm:mb-6 sm:text-4xl md:text-5xl">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-3 mt-9 font-rajdhani text-[1.75rem] font-black leading-[1.08] text-accent-coral sm:mb-4 sm:mt-10 sm:text-3xl" style={{ textShadow: '3px 3px 0 rgba(255,230,109,0.65)' }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-3 mt-7 font-rajdhani text-2xl font-bold leading-tight text-nav-link">
              {children}
            </h3>
          ),
          p: ({ children, node }) => {
            const containsLab = node?.children.some(
              (child) => child.type === 'element'
                && child.tagName === 'img'
                && String(child.properties?.src || '').endsWith('.html')
            );

            return containsLab ? children : (
              <p className="mb-5 text-[1.0625rem] leading-[1.75] text-dark sm:mb-6 sm:text-lg">
                {children}
              </p>
            );
          },
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="break-words text-nav-link underline decoration-2 underline-offset-2 transition-colors duration-300 hover:text-accent-coral"
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
                <code className="break-words rounded-md border-2 border-dark bg-accent-yellow px-1.5 py-0.5 font-mono text-[0.82em] text-dark shadow-[2px_2px_0_var(--neo-ink)] sm:px-2 sm:py-1">
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
            <pre className="my-6 max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-lg border-[3px] border-dark bg-dark p-4 text-sm leading-relaxed text-[var(--neo-bg-soft)] shadow-[5px_5px_0_var(--neo-pink)] sm:p-6">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-7 ml-0 border-l-[6px] border-dark bg-accent-yellow px-4 py-4 italic text-dark shadow-[4px_4px_0_var(--neo-ink)] sm:border-l-[8px] sm:px-6 sm:shadow-[6px_6px_0_var(--neo-ink)]">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="mb-6 list-outside list-disc space-y-2 pl-5 text-dark sm:pl-6">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-6 list-outside list-decimal space-y-2 pl-5 text-dark sm:pl-6">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="pl-1 leading-[1.7] text-dark">
              {children}
            </li>
          ),
          img: ({ src, alt }) => src?.endsWith('.html') ? (
            <InteractiveLab src={src} title={alt || 'Interactive lab'} />
          ) : (
            <img
              src={src}
              alt={alt}
              className="my-7 h-auto w-full rounded-lg border-[3px] border-dark shadow-[5px_5px_0_var(--neo-ink)] sm:my-8 sm:shadow-[8px_8px_0_var(--neo-ink)]"
            />
          ),
          table: ({ children }) => (
            <div className="my-7 max-w-full overflow-x-auto rounded-md border-[3px] border-dark shadow-[4px_4px_0_var(--neo-ink)]">
              <table className="w-full min-w-[36rem] border-collapse bg-[var(--neo-surface)] text-left text-sm">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border-b-[3px] border-r-2 border-dark bg-accent-yellow px-3 py-2 font-black text-dark last:border-r-0">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b-2 border-r-2 border-dark px-3 py-2 align-top text-dark last:border-r-0">
              {children}
            </td>
          ),
          hr: () => (
            <hr className="border-t-[3px] border-dark my-12" />
          ),
        }}
      >
        {post.content}
      </ReactMarkdown>
    </div>
  );
}
