import { notFound } from "next/navigation";
import Link from "next/link";
import { getThought, getThoughts, stripAndExcerpt } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getThoughts().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const thought = await getThought(slug);
  if (!thought) return {};
  const description = stripAndExcerpt(thought.contentHtml);
  return buildMetadata({
    title: `${thought.title} — Value Yonder`,
    ogTitle: thought.title,
    description,
    path: `/thoughts/${slug}`,
    ogType: "article",
    publishedTime: thought.date,
  });
}

export default async function ThoughtPage({ params }: Props) {
  const { slug } = await params;
  const thought = await getThought(slug);
  if (!thought) notFound();

  const description = stripAndExcerpt(thought.contentHtml);
  const url = `https://valueyonder.com/thoughts/${slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": thought.title,
      "description": description,
      "url": url,
      "datePublished": thought.date,
      "author": { "@type": "Person", "name": "Daniel Araújo", "url": "https://valueyonder.com" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Thoughts", "item": "https://valueyonder.com/thoughts" },
        { "@type": "ListItem", "position": 2, "name": thought.title, "item": url },
      ],
    },
  ];

  return (
    <div className="px-6 pt-28 pb-24 max-w-4xl mx-auto">
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <Link href="/thoughts" className="inline-flex items-center gap-2 text-sm mb-10 text-neutral-500 hover:text-cyan-400 transition-colors">
        ← Thoughts
      </Link>

      <article>
      <header className="mb-10">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: "#1e1f28", color: "#06b6d4" }}>
          Thought
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">{thought.title}</h1>
        <div className="flex items-center gap-4 text-sm text-neutral-500">
          {thought.date && (
            <time dateTime={thought.date}>
              {new Date(thought.date).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}
            </time>
          )}
          <span>{thought.readingTime} min read</span>
        </div>
      </header>

      <div className="mb-10 h-px" style={{ background: "#1e1f28" }} />
      <div className="prose" dangerouslySetInnerHTML={{ __html: thought.contentHtml }} />
      </article>
    </div>
  );
}
