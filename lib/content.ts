import fs from "fs";
import path from "path";
import matter from "gray-matter";
import * as toml from "toml";
import { remark } from "remark";
import remarkHtml from "remark-html";
import { withBase } from "./base-path";

const CONTENT_DIR = path.join(process.cwd(), "content");
const DATA_DIR = path.join(process.cwd(), "data");
const ESSAYS_DIR = path.join(CONTENT_DIR, "essays");

export const ESSAY_SECTIONS = [
  { slug: "on-learning", label: "On Learning" },
  { slug: "on-progress", label: "On Progress" },
  { slug: "on-prosperity", label: "On Prosperity" },
] as const;

export type EssaySection = (typeof ESSAY_SECTIONS)[number]["slug"];

export interface Essay {
  slug: string;
  section: EssaySection;
  title: string;
  date: string;
  description?: string;
  draft?: boolean;
  readingTime: number;
  relatedEssays?: string[];
}

export interface EssayWithContent extends Essay {
  contentHtml: string;
}

export interface Thought {
  slug: string;
  title: string;
  date: string;
  readingTime: number;
}

export interface ThoughtWithContent extends Thought {
  contentHtml: string;
}

export interface Gallery {
  slug: string;
  title: string;
  date: string;
  description: string;
  coverImage: string;
  imageCount: number;
}

export interface GalleryWithContent extends Gallery {
  images: Array<{ src: string; thumbSrc: string; fullSrc: string; alt: string; caption: string }>;
  intro: string;
  introParagraphs: string[];
}

export interface Book {
  title: string;
  author: string;
  cover: string;
  rating: number;
  dateRead: string;
  tags: string[];
  review: string;
  format: string;
  isbn: string;
}

export interface BookYear {
  year: string;
  books: Book[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function stripAndExcerpt(html: string, maxLen = 155): string {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLen) return text;
  const cut = text.lastIndexOf(" ", maxLen);
  return text.slice(0, cut > 0 ? cut : maxLen) + "…";
}

function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const tomlMatch = raw.match(/^\+\+\+\n([\s\S]*?)\n\+\+\+\n?([\s\S]*)$/);
  if (tomlMatch) {
    const data = toml.parse(tomlMatch[1]);
    return { data, content: tomlMatch[2] };
  }
  const parsed = matter(raw);
  return { data: parsed.data as Record<string, unknown>, content: parsed.content };
}

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

async function markdownToHtml(content: string): Promise<string> {
  const processed = await remark().use(remarkHtml, { sanitize: false }).process(content);
  return processed.toString();
}

// ─── Essays ───────────────────────────────────────────────────────────────────

export function getEssays(): Record<EssaySection, Essay[]> {
  const result = {} as Record<EssaySection, Essay[]>;
  for (const { slug: section } of ESSAY_SECTIONS) {
    const sectionDir = path.join(ESSAYS_DIR, section);
    if (!fs.existsSync(sectionDir)) { result[section] = []; continue; }
    result[section] = fs.readdirSync(sectionDir)
      .filter((f) => f.endsWith(".md") && f !== "_index.md")
      .map((file): Essay | null => {
        const { data, content } = parseFrontmatter(fs.readFileSync(path.join(sectionDir, file), "utf-8"));
        if (data.draft === true) return null;
        return {
          slug: file.replace(/\.md$/, ""), section,
          title: (data.title as string) || file.replace(/\.md$/, ""),
          date: data.date ? new Date(data.date as string).toISOString().split("T")[0] : "",
          description: data.description as string | undefined,
          draft: false, readingTime: estimateReadingTime(content),
          relatedEssays: Array.isArray(data.relatedEssays) ? (data.relatedEssays as string[]) : undefined,
        };
      })
      .filter((e): e is Essay => e !== null)
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }
  return result;
}

export function getAllEssays(): Essay[] {
  return Object.values(getEssays()).flat().sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getEssay(section: EssaySection, slug: string): Promise<EssayWithContent | null> {
  const filePath = path.join(ESSAYS_DIR, section, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const { data, content } = parseFrontmatter(fs.readFileSync(filePath, "utf-8"));
  return {
    slug, section,
    title: (data.title as string) || slug,
    date: data.date ? new Date(data.date as string).toISOString().split("T")[0] : "",
    description: data.description as string | undefined,
    draft: false, readingTime: estimateReadingTime(content),
    contentHtml: await markdownToHtml(content),
  };
}

export function getEssayMarkdown(section: EssaySection, slug: string): string | null {
  const filePath = path.join(ESSAYS_DIR, section, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return parseFrontmatter(fs.readFileSync(filePath, "utf-8")).content.trim();
}

export function getAllEssaySlugs(): Array<{ section: EssaySection; slug: string }> {
  const slugs: Array<{ section: EssaySection; slug: string }> = [];
  for (const { slug: section } of ESSAY_SECTIONS) {
    const sectionDir = path.join(ESSAYS_DIR, section);
    if (!fs.existsSync(sectionDir)) continue;
    fs.readdirSync(sectionDir)
      .filter((f) => f.endsWith(".md") && f !== "_index.md")
      .forEach((file) => slugs.push({ section, slug: file.replace(/\.md$/, "") }));
  }
  return slugs;
}

export function getSectionEssays(section: EssaySection, excludeSlug: string, limit = 3): Essay[] {
  return (getEssays()[section] || [])
    .filter((e) => e.slug !== excludeSlug)
    .slice(0, limit);
}

export function getEssaysBySlug(slugs: string[]): Essay[] {
  const all = getAllEssays();
  return slugs
    .map((slug) => all.find((e) => e.slug === slug))
    .filter((e): e is Essay => e !== undefined);
}

// ─── Thoughts ─────────────────────────────────────────────────────────────────

const THOUGHTS_DIR = path.join(CONTENT_DIR, "thoughts");

export function getThoughts(): Thought[] {
  if (!fs.existsSync(THOUGHTS_DIR)) return [];
  return fs.readdirSync(THOUGHTS_DIR)
    .filter((f) => f.endsWith(".md") && f !== "_index.md")
    .map((file): Thought | null => {
      const { data, content } = parseFrontmatter(fs.readFileSync(path.join(THOUGHTS_DIR, file), "utf-8"));
      if (data.draft === true) return null;
      return {
        slug: file.replace(/\.md$/, ""),
        title: (data.title as string) || file.replace(/\.md$/, ""),
        date: data.date ? new Date(data.date as string).toISOString().split("T")[0] : "",
        readingTime: estimateReadingTime(content),
      };
    })
    .filter((t): t is Thought => t !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getThought(slug: string): Promise<ThoughtWithContent | null> {
  const filePath = path.join(THOUGHTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const { data, content } = parseFrontmatter(fs.readFileSync(filePath, "utf-8"));
  return {
    slug,
    title: (data.title as string) || slug,
    date: data.date ? new Date(data.date as string).toISOString().split("T")[0] : "",
    readingTime: estimateReadingTime(content),
    contentHtml: await markdownToHtml(content),
  };
}

export function getThoughtMarkdown(slug: string): string | null {
  const filePath = path.join(THOUGHTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return parseFrontmatter(fs.readFileSync(filePath, "utf-8")).content.trim();
}

// ─── Seeing / Galleries ───────────────────────────────────────────────────────

const SEEING_DIR = path.join(CONTENT_DIR, "seeing");

function toWebP(src: string, tier: "thumb" | "full"): string {
  const lastSlash = src.lastIndexOf("/");
  const dir = src.slice(0, lastSlash);
  const stem = src.slice(lastSlash + 1).replace(/\.[^.]+$/, "");
  return `${dir}/${tier}/${stem}.webp`;
}

function parseGalleryImages(content: string, gallerySlug: string): Array<{ src: string; thumbSrc: string; fullSrc: string; alt: string; caption: string }> {
  const images: Array<{ src: string; thumbSrc: string; fullSrc: string; alt: string; caption: string }> = [];
  const figureRegex = /<figure>[\s\S]*?<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>[\s\S]*?(?:<figcaption>([\s\S]*?)<\/figcaption>)?[\s\S]*?<\/figure>/g;
  let match;
  while ((match = figureRegex.exec(content)) !== null) {
    const src = withBase(`/seeing/${gallerySlug}/${match[1].replace(/^\.\//, "")}`);
    images.push({
      src,
      thumbSrc: toWebP(src, "thumb"),
      fullSrc: toWebP(src, "full"),
      alt: match[2] || "",
      caption: match[3]?.replace(/<[^>]+>/g, "").trim() || "",
    });
  }
  return images;
}

function stripHtmlAndShortcodes(content: string): string {
  return content
    .replace(/<div class="photo-grid">[\s\S]*?<\/div>/g, "")
    .replace(/{{[^}]+}}/g, "")
    .trim();
}

export function getGalleries(): Gallery[] {
  if (!fs.existsSync(SEEING_DIR)) return [];
  return fs.readdirSync(SEEING_DIR)
    .filter((f) => fs.statSync(path.join(SEEING_DIR, f)).isDirectory())
    .map((dir): Gallery | null => {
      const indexPath = path.join(SEEING_DIR, dir, "index.md");
      if (!fs.existsSync(indexPath)) return null;
      const { data } = parseFrontmatter(fs.readFileSync(indexPath, "utf-8"));
      if (data.draft === true) return null;
      const coverData = data.cover as Record<string, string> | undefined;
      const coverFile = coverData?.image || "01.jpg";
      const coverStem = coverFile.replace(/\.[^.]+$/, "");
      const publicGalleryDir = path.join(process.cwd(), "public", "seeing", dir);
      const imageFiles = fs.existsSync(publicGalleryDir)
        ? fs.readdirSync(publicGalleryDir).filter((f) => /\.(jpg|jpeg|png)$/i.test(f))
        : [];
      return {
        slug: dir,
        title: (data.title as string) || dir,
        date: data.date ? new Date(data.date as string).toISOString().split("T")[0] : "",
        description: (data.description as string) || "",
        coverImage: withBase(`/seeing/${dir}/thumb/${coverStem}.webp`),
        imageCount: imageFiles.length,
      };
    })
    .filter((g): g is Gallery => g !== null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getGallery(slug: string): Promise<GalleryWithContent | null> {
  const indexPath = path.join(SEEING_DIR, slug, "index.md");
  if (!fs.existsSync(indexPath)) return null;
  const { data, content } = parseFrontmatter(fs.readFileSync(indexPath, "utf-8"));
  const coverData = data.cover as Record<string, string> | undefined;
  const coverFile = coverData?.image || "01.jpg";
  const coverStem = coverFile.replace(/\.[^.]+$/, "");
  const publicGalleryDir = path.join(process.cwd(), "public", "seeing", slug);
  const imageFiles = fs.existsSync(publicGalleryDir)
    ? fs.readdirSync(publicGalleryDir).filter((f) => /\.(jpg|jpeg|png)$/i.test(f))
    : [];
  const images = parseGalleryImages(content, slug);
  // If no HTML figures, build from image files
  const finalImages = images.length > 0 ? images : imageFiles.sort().map((f) => {
    const src = withBase(`/seeing/${slug}/${f}`);
    return { src, thumbSrc: toWebP(src, "thumb"), fullSrc: toWebP(src, "full"), alt: (data.title as string) || slug, caption: "" };
  });
  return {
    slug,
    title: (data.title as string) || slug,
    date: data.date ? new Date(data.date as string).toISOString().split("T")[0] : "",
    description: (data.description as string) || "",
    coverImage: withBase(`/seeing/${slug}/thumb/${coverStem}.webp`),
    imageCount: imageFiles.length,
    images: finalImages,
    intro: stripHtmlAndShortcodes(content),
    introParagraphs: stripHtmlAndShortcodes(content)
      .split(/\n\n+/)
      .map((p) => p.replace(/\n/g, " ").trim())
      .filter((p) => p.length > 0),
  };
}

export function getAllGallerySlugs(): string[] {
  if (!fs.existsSync(SEEING_DIR)) return [];
  return fs.readdirSync(SEEING_DIR).filter((f) => fs.statSync(path.join(SEEING_DIR, f)).isDirectory());
}

// ─── Reading / Books ──────────────────────────────────────────────────────────

export function getBooks(): BookYear[] {
  const filePath = path.join(DATA_DIR, "books.json");
  if (!fs.existsSync(filePath)) return [];
  const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as BookYear[];
  return raw.sort((a, b) => Number(b.year) - Number(a.year));
}
