import matter from "gray-matter";
import { marked } from "marked";
import fs from "node:fs/promises";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "blog");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  cover?: string;
  author?: string;
  tag?: string;
};

export type Post = PostMeta & { contentHtml: string };

async function readDir(): Promise<string[]> {
  try {
    const files = await fs.readdir(CONTENT_DIR);
    return files.filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
  } catch {
    return [];
  }
}

function toMeta(slug: string, data: Record<string, unknown>): PostMeta {
  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    summary: String(data.summary ?? ""),
    cover: data.cover ? String(data.cover) : undefined,
    author: data.author ? String(data.author) : undefined,
    tag: data.tag ? String(data.tag) : undefined,
  };
}

export async function listPosts(): Promise<PostMeta[]> {
  const files = await readDir();
  const posts: PostMeta[] = [];
  for (const file of files) {
    const raw = await fs.readFile(path.join(CONTENT_DIR, file), "utf8");
    const { data } = matter(raw);
    const slug = file.replace(/\.(md|mdx)$/, "");
    posts.push(toMeta(slug, data));
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<Post | null> {
  const files = await readDir();
  const match = files.find((f) => f.replace(/\.(md|mdx)$/, "") === slug);
  if (!match) return null;
  const raw = await fs.readFile(path.join(CONTENT_DIR, match), "utf8");
  const { data, content } = matter(raw);
  marked.setOptions({ gfm: true, breaks: false });
  const contentHtml = await marked.parse(content);
  return { ...toMeta(slug, data), contentHtml };
}
