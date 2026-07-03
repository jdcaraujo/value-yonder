import { getEssays, getThoughts, ESSAY_SECTIONS } from "@/lib/content";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

export async function GET() {
  const grouped = getEssays();

  const sections = ESSAY_SECTIONS.map(({ slug, label }) => {
    const items = (grouped[slug] ?? [])
      .map((e) => {
        const url = `${SITE_URL}/essays/${slug}/${e.slug}/`;
        return e.description ? `- [${e.title}](${url}) — ${e.description}` : `- [${e.title}](${url})`;
      })
      .join("\n");
    return `### ${label}\n\n${items}`;
  }).join("\n\n");

  const thoughts = getThoughts()
    .map((t) => `- [${t.title}](${SITE_URL}/thoughts/${t.slug}/)`)
    .join("\n");

  const body = `# Value Yonder — Daniel Araújo

> Personal site of Daniel Araújo, Principal Product Manager at Zendesk specialising in AI product. Essays and thoughts on product strategy, org design, AI, and learning. Photography galleries from Lisbon, Israel, and San Francisco.

## About

Daniel Araújo is a Principal Product Manager with 15+ years of experience across Google, two startups (Attentive — conversational AI, Techstars Boulder; NovaWeb.pt), OutSystems, and Zendesk. Currently leading Admin Copilot at Zendesk — an AI assistant that helps support teams configure and manage their operations. Based in Lisbon, Portugal.

No ML degree. Product-first, not engineering-first. Writes about what AI actually does for people, not what it theoretically could.

## Essays

Long-form writing organised into three themes.

${sections}

## Thoughts

Shorter notes and observations.

${thoughts}

## Other sections

- [Seeing](${SITE_URL}/seeing) — Photography galleries from Lisbon, Israel, and San Francisco
- [Reading](${SITE_URL}/reading) — Books read with ratings and notes
- [About](${SITE_URL}/about) — Background and career timeline

## Contact

- Email: jdc.araujo@gmail.com
- LinkedIn: https://www.linkedin.com/in/danielaraujopt/
- X / Twitter: https://x.com/JDanielAraujo

## Optional

- [Full content for LLMs](${SITE_URL}/llms-full.txt) — Complete text of all essays and thoughts
- [RSS feed](${SITE_URL}/index.xml)
- [Sitemap](${SITE_URL}/sitemap.xml) — Complete content index
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
