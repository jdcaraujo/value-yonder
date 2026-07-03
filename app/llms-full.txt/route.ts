import {
  getAllEssays,
  getThoughts,
  getEssayMarkdown,
  getThoughtMarkdown,
  ESSAY_SECTIONS,
} from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export async function GET() {
  const essays = getAllEssays()
    .map((e) => {
      const label = ESSAY_SECTIONS.find((s) => s.slug === e.section)?.label ?? e.section;
      const body = getEssayMarkdown(e.section, e.slug) ?? "";
      return `## ${e.title}

- Section: ${label}
- Date: ${e.date}
- URL: ${SITE_URL}/essays/${e.section}/${e.slug}/

${body}`;
    })
    .join("\n\n---\n\n");

  const thoughts = getThoughts()
    .map((t) => {
      const body = getThoughtMarkdown(t.slug) ?? "";
      return `## ${t.title}

- Date: ${t.date}
- URL: ${SITE_URL}/thoughts/${t.slug}/

${body}`;
    })
    .join("\n\n---\n\n");

  const full = `# Value Yonder — Daniel Araújo (full content)

> Complete text of all essays and thoughts from ${SITE_URL}. See ${SITE_URL}/llms.txt for the index.

# Essays

${essays}

# Thoughts

${thoughts}
`;

  return new Response(full, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
