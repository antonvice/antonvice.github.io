import fs from 'fs';
import path from 'path';

export interface BlogPost {
  slug: string;
  filename: string;
  title: string;
  date: Date;
  content: string;
  excerpt: string;
}

const postsDirectory = path.join(process.cwd(), 'posts');

export function getAllPosts(): BlogPost[] {
  try {
    const filenames = fs.readdirSync(postsDirectory)
      .filter(name => name.endsWith('.md'))
      .sort((a, b) => b.localeCompare(a)); // Sort by filename (newest first)

    const posts = filenames.map(filename => {
      const filePath = path.join(postsDirectory, filename);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Extract title from first # line
      const lines = content.split('\n');
      let title = filename.replace('.md', '').replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/-/g, ' ');
      
      for (const line of lines) {
        if (line.startsWith('# ')) {
          title = line.substring(2).trim();
          break;
        }
      }
      
      // If no title found, use filename as fallback
      if (!title || title.length === 0) {
        title = filename.replace('.md', '').replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/-/g, ' ');
      }
      
      // Extract date from filename
      const dateMatch = filename.match(/^(\d{4}-\d{2}-\d{2})/);
      const date = dateMatch ? new Date(dateMatch[1]) : new Date();
      
      // Create excerpt (first paragraph or first 200 chars)
      const cleanContent = content
        .replace(/^#.*$/gm, '') // Remove headers
        .replace(/^\*.*\*$/gm, '') // Remove italic lines like *Published on...*
        .replace(/^section-divider$/gm, '')
        .replace(/^-+$/gm, '')
        .replace(/^\| section-content$/gm, '')
        .replace(/\n\s*\n/g, '\n\n')
        .trim();
      
      const firstParagraph = cleanContent.split('\n\n')[0] || '';
      const excerpt = firstParagraph.length > 200 
        ? firstParagraph.substring(0, 200) + '...'
        : firstParagraph;
      
      const slug = filename.replace('.md', '');
      
      return {
        slug,
        filename,
        title,
        date,
        content: cleanContent,
        excerpt
      };
    });

    return posts;
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const filename = `${slug}.md`;
    const filePath = path.join(postsDirectory, filename);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract title from first # line
    const lines = content.split('\n');
    let title = slug.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/-/g, ' ');
    
    for (const line of lines) {
      if (line.startsWith('# ')) {
        title = line.substring(2).trim();
        break;
      }
    }
    
    // If no title found, use slug as fallback
    if (!title || title.length === 0) {
      title = slug.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/-/g, ' ');
    }
    
    // Extract date from filename
    const dateMatch = slug.match(/^(\d{4}-\d{2}-\d{2})/);
    const date = dateMatch ? new Date(dateMatch[1]) : new Date();
    
    // Clean content
    const cleanContent = content
      .replace(/^\*.*\*$/gm, '') // Remove italic lines like *Published on...*
      .replace(/^section-divider$/gm, '')
      .replace(/^-+$/gm, '')
      .replace(/^\| section-content$/gm, '')
      .replace(/\n\s*\n/g, '\n\n')
      .trim();
    
    const firstParagraph = cleanContent.split('\n\n')[0] || '';
    const excerpt = firstParagraph.length > 200 
      ? firstParagraph.substring(0, 200) + '...'
      : firstParagraph;
    
    return {
      slug,
      filename,
      title,
      date,
      content: cleanContent,
      excerpt
    };
  } catch (error) {
    console.error('Error reading post:', error);
    return null;
  }
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}