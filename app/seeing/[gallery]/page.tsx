import { notFound } from "next/navigation";
import Link from "next/link";
import { getGallery, getAllGallerySlugs, GalleryWithContent } from "@/lib/content";
import { FadeIn } from "@/components/fade-in";
import { GalleryViewer } from "@/components/gallery-viewer";


interface Props {
  params: Promise<{ gallery: string }>;
}

export async function generateStaticParams() {
  return getAllGallerySlugs().map((slug) => ({ gallery: slug }));
}

export async function generateMetadata({ params }: Props) {
  const { gallery } = await params;
  const data = await getGallery(gallery);
  if (!data) return {};
  const url = `https://valueyonder.com/seeing/${gallery}`;
  return {
    title: `${data.title} — Value Yonder`,
    description: data.description,
    openGraph: {
      type: "website",
      url,
      title: data.title,
      description: data.description,
      images: [{ url: data.coverImage }],
    },
    twitter: { title: data.title, description: data.description, images: [data.coverImage] },
  };
}

// ─── Segment types ────────────────────────────────────────────────────────────

type TextSegment = { type: "text"; paragraphs: string[] };
type PhotoSegment = { type: "photos"; indices: number[]; layout: "single" | "pair" | "grid" | "trio" };
type Segment = TextSegment | PhotoSegment;

// ─── Per-gallery narrative structure ─────────────────────────────────────────

function getSegments(slug: string, data: GalleryWithContent): Segment[] {
  const p = data.introParagraphs;
  const imgs = data.images;

  if (slug === "israel-through-glass") {
    return [
      { type: "text", paragraphs: p.slice(0, 3) },
      { type: "photos", indices: [0, 1, 2], layout: "trio" },
      { type: "photos", indices: [3, 4, 5], layout: "trio" },
      { type: "photos", indices: [6], layout: "single" },
      { type: "text", paragraphs: ["Gut-wrenching stories of displacement and confrontation — of people living metres apart with no shared future in sight. There were so many."] },
      { type: "photos", indices: [7, 8, 9, 10, 11], layout: "grid" },
      { type: "text", paragraphs: ["Tel Aviv. The beaches are full of life. The city barely sleeps — buzzing streets, bars and restaurants, everyone making the best of every moment. This contrast between the old and the new, the deeply rooted and the avant-garde, makes Israel one of the most special places to visit."] },
      { type: "photos", indices: [12, 13, 14, 15], layout: "grid" },
    ];
  }

  if (slug === "lisbon-through-glass") {
    return [
      { type: "text", paragraphs: p.slice(0, 1) },
      { type: "photos", indices: [0], layout: "single" },
      { type: "text", paragraphs: p.slice(1) },
      { type: "photos", indices: [1, 2], layout: "pair" },
      { type: "photos", indices: [3, 4], layout: "pair" },
      { type: "photos", indices: [5], layout: "single" },
      { type: "photos", indices: [6], layout: "single" },
    ];
  }

  if (slug === "san-francisco-through-glass") {
    return [
      { type: "text", paragraphs: p.slice(0, 1) },
      { type: "photos", indices: [0, 1], layout: "pair" },
      { type: "text", paragraphs: p.slice(1, 3) },
      { type: "photos", indices: [2, 8], layout: "pair" },
      { type: "text", paragraphs: p.slice(3, 4) },
      { type: "photos", indices: [3, 4, 6, 11], layout: "grid" },
      { type: "photos", indices: [5], layout: "single" },
      { type: "text", paragraphs: p.slice(4) },
      { type: "photos", indices: [9, 10], layout: "pair" },
      { type: "photos", indices: [12, 7], layout: "pair" },
      { type: "photos", indices: [13], layout: "single" },
    ];
  }

  // Default: alternate text → photos evenly
  const segments: Segment[] = [];
  if (p.length > 0) segments.push({ type: "text", paragraphs: p });
  for (let i = 0; i < imgs.length; i += 2) {
    const indices = [i, i + 1].filter((idx) => idx < imgs.length);
    segments.push({ type: "photos", indices, layout: indices.length === 1 ? "single" : "pair" });
  }
  return segments;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function GalleryPage({ params }: Props) {
  const { gallery } = await params;
  const data = await getGallery(gallery);
  if (!data) notFound();

  const segments = getSegments(gallery, data);
  const url = `https://valueyonder.com/seeing/${gallery}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ImageGallery",
      "name": data.title,
      "description": data.description,
      "url": url,
      "numberOfItems": data.imageCount,
      "author": { "@type": "Person", "name": "Daniel Araújo", "url": "https://valueyonder.com" },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Seeing", "item": "https://valueyonder.com/seeing" },
        { "@type": "ListItem", "position": 2, "name": data.title, "item": url },
      ],
    },
  ];

  return (
    <div className="pt-28 pb-24">
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      {/* Header */}
      <div className="px-6 max-w-3xl mx-auto mb-14">
        <Link href="/seeing" className="inline-flex items-center gap-2 text-sm mb-8 text-neutral-500 hover:text-cyan-400 transition-colors">
          ← Seeing
        </Link>
        <FadeIn>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: "#1e1f28", color: "#06b6d4" }}>
            {new Date(data.date).getFullYear()}
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-3">{data.title}</h1>
          <p className="text-neutral-500 text-sm italic">{data.imageCount} photographs</p>
        </FadeIn>
      </div>

      {/* Interleaved segments */}
      <div className="px-6 max-w-3xl mx-auto">
        <GalleryViewer segments={segments} images={data.images} />
      </div>
    </div>
  );
}
