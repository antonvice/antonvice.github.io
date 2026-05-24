import fs from "fs";
import path from "path";

export interface BlogPost {
  slug: string;
  filename: string;
  title: string;
  date: Date;
  content: string;
  excerpt: string;
  description?: string;
}

const postsDirectory = path.join(process.cwd(), "posts");

const datedPostPattern = /^\d{4}-\d{2}-\d{2}-/;

function isMarkdownPostFile(filename: string): boolean {
  return (
    filename.endsWith(".md") ||
    (datedPostPattern.test(filename) && path.extname(filename) === "")
  );
}

function filenameToSlug(filename: string): string {
  return filename.replace(/\.md$/, "");
}

function extractDate(filenameOrSlug: string): Date {
  const dateMatch = filenameOrSlug.match(/^(\d{4}-\d{2}-\d{2})/);
  return dateMatch ? new Date(`${dateMatch[1]}T00:00:00`) : new Date(0);
}

function extractTitle(content: string, fallback: string): string {
  const titleLine = content.split("\n").find((line) => line.startsWith("# "));
  return titleLine?.substring(2).trim() || fallback;
}

function cleanPostContent(content: string): string {
  return content
    .replace(/^# .*\n?/, "")
    .replace(/^\*.*\*$/gm, "") // Remove italic lines like *Published on...*
    .replace(/^section-divider$/gm, "")
    .replace(/^-+$/gm, "")
    .replace(/^\| section-content$/gm, "")
    .replace(/\n\s*\n/g, "\n\n")
    .trim();
}

function createExcerpt(cleanContent: string): string {
  const excerptSource = cleanContent.replace(/^#{2,6}\s.*$/gm, "").trim();
  const firstParagraph = excerptSource.split("\n\n")[0] || "";
  return firstParagraph.length > 200
    ? `${firstParagraph.substring(0, 200)}...`
    : firstParagraph;
}

function readPost(filename: string): BlogPost {
  const filePath = path.join(postsDirectory, filename);
  const content = fs.readFileSync(filePath, "utf8");
  const slug = filenameToSlug(filename);
  const fallbackTitle = slug.replace(datedPostPattern, "").replace(/-/g, " ");
  const title = extractTitle(content, fallbackTitle);
  const date = extractDate(filename);
  const contentWithoutTitle = cleanPostContent(content);
  const excerpt = createExcerpt(contentWithoutTitle);

  return {
    slug,
    filename,
    title,
    date,
    content: contentWithoutTitle,
    excerpt,
    description: excerpt,
  };
}

export function getAllPosts(): BlogPost[] {
  try {
    const filenames = fs.readdirSync(postsDirectory).filter(isMarkdownPostFile);

    return filenames
      .map(readPost)
      .sort(
        (a, b) =>
          b.date.valueOf() - a.date.valueOf() ||
          b.filename.localeCompare(a.filename),
      );
  } catch (error) {
    console.error("Error reading posts:", error);
    return [];
  }
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const filename = [`${slug}.md`, slug].find((candidate) => {
      const filePath = path.join(postsDirectory, candidate);
      return fs.existsSync(filePath) && isMarkdownPostFile(candidate);
    });

    if (!filename) {
      return null;
    }

    return readPost(filename);
  } catch (error) {
    console.error("Error reading post:", error);
    return null;
  }
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}
