import matter from "gray-matter";
import { marked } from "marked";
import fs from "node:fs/promises";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "src", "content", "faq");

export type FaqItem = {
  slug: string;
  title: string;
  bodyHtml: string;
};

export async function listFaq(): Promise<FaqItem[]> {
  let files: string[];
  try {
    files = (await fs.readdir(CONTENT_DIR)).filter(
      (f) => f.endsWith(".md") || f.endsWith(".mdx"),
    );
  } catch {
    return [];
  }
  files.sort();
  marked.setOptions({ gfm: true, breaks: false });

  const items: FaqItem[] = [];
  for (const file of files) {
    const raw = await fs.readFile(path.join(CONTENT_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.(md|mdx)$/, "");
    const bodyHtml = await marked.parse(content);
    items.push({
      slug,
      title: String(data.title ?? slug),
      bodyHtml,
    });
  }
  return items;
}
