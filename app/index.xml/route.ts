import { getAllEssays, getThoughts } from "@/lib/content";
import { SITE_URL, SITE_NAME } from "@/lib/seo";

export const dynamic = "force-static";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function GET() {
  const items = [
    ...getAllEssays().map((e) => ({
      title: e.title,
      url: `${SITE_URL}/essays/${e.section}/${e.slug}/`,
      date: e.date,
      description: e.description ?? "",
    })),
    ...getThoughts().map((t) => ({
      title: t.title,
      url: `${SITE_URL}/thoughts/${t.slug}/`,
      date: t.date,
      description: "",
    })),
  ].sort((a, b) => (a.date < b.date ? 1 : -1));

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME} — Daniel Araújo</title>
    <link>${SITE_URL}/</link>
    <description>Essays and thoughts on learning, progress, and prosperity.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/index.xml" rel="self" type="application/rss+xml"/>
${items
  .map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.url}</link>
      <guid>${item.url}</guid>
      ${item.date ? `<pubDate>${new Date(item.date).toUTCString()}</pubDate>` : ""}
      ${item.description ? `<description>${escapeXml(item.description)}</description>` : ""}
    </item>`
  )
  .join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
