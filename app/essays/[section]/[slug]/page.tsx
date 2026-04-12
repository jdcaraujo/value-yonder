import { notFound } from "next/navigation";
import Link from "next/link";
import { getEssay, getAllEssaySlugs, EssaySection, ESSAY_SECTIONS, stripAndExcerpt } from "@/lib/content";
import { RelatedEssays } from "@/components/related-essays";

interface Props {
  params: Promise<{ section: string; slug: string }>;
}

export async function generateStaticParams() {
  return getAllEssaySlugs();
}

export async function generateMetadata({ params }: Props) {
  const { section, slug } = await params;
  const essay = await getEssay(section as EssaySection, slug);
  if (!essay) return {};
  const description = essay.description || stripAndExcerpt(essay.contentHtml);
  const url = `https://valueyonder.com/essays/${section}/${slug}`;
  return {
    title: `${essay.title} — Value Yonder`,
    description,
    openGraph: {
      type: "article",
      url,
      title: essay.title,
      description,
      publishedTime: essay.date,
    },
    twitter: { title: essay.title, description },
  };
}

export default async function EssayPage({ params }: Props) {
  const { section, slug } = await params;
  const essay = await getEssay(section as EssaySection, slug);
  if (!essay) notFound();

  const sectionLabel = ESSAY_SECTIONS.find((s) => s.slug === section)?.label || section;
  const description = essay.description || stripAndExcerpt(essay.contentHtml);
  const url = `https://valueyonder.com/essays/${section}/${slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": essay.title,
      "description": description,
      "url": url,
      "datePublished": essay.date,
      "author": { "@type": "Person", "name": "Daniel Araújo", "url": "https://valueyonder.com" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Essays", "item": "https://valueyonder.com/essays" },
        { "@type": "ListItem", "position": 2, "name": sectionLabel, "item": `https://valueyonder.com/essays/${section}` },
        { "@type": "ListItem", "position": 3, "name": essay.title, "item": url },
      ],
    },
  ];

  return (
    <div className="px-6 pt-28 pb-24 max-w-4xl mx-auto">
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      {/* Back */}
      <Link
        href={`/essays/${section}`}
        className="inline-flex items-center gap-2 text-sm mb-10 text-neutral-500 hover:text-cyan-400 transition-colors"
      >
        ← {sectionLabel}
      </Link>

      {/* Header */}
      <header className="mb-10">
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
          style={{ background: "#1e1f28", color: "#06b6d4" }}
        >
          {sectionLabel}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
          {essay.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-neutral-500">
          {essay.date && (
            <time dateTime={essay.date}>
              {new Date(essay.date).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          )}
          <span>{essay.readingTime} min read</span>
        </div>
      </header>

      {/* Divider */}
      <div className="mb-10 h-px" style={{ background: "#1e1f28" }} />

      {/* Content */}
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: essay.contentHtml }}
      />

      <RelatedEssays current={essay} />
    </div>
  );
}
