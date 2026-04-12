import { notFound } from "next/navigation";
import Link from "next/link";
import { EssayCard } from "@/components/essay-card";
import { FadeIn } from "@/components/fade-in";
import { getEssays, ESSAY_SECTIONS, EssaySection } from "@/lib/content";

interface Props {
  params: Promise<{ section: string }>;
}

export function generateStaticParams() {
  return ESSAY_SECTIONS.map(({ slug }) => ({ section: slug }));
}

export async function generateMetadata({ params }: Props) {
  const { section } = await params;
  const label = ESSAY_SECTIONS.find((s) => s.slug === section)?.label;
  if (!label) return {};
  return {
    title: `${label} — Value Yonder`,
    description: `All essays on ${label.toLowerCase()}.`,
  };
}

const sectionDescriptions: Record<string, string> = {
  "on-learning":    "How we acquire knowledge, build skills, and update our beliefs.",
  "on-progress":    "Building things, strategy, and the mechanics of getting better.",
  "on-prosperity":  "Meaning, wealth, and what makes a life worth living.",
};

export default async function SectionPage({ params }: Props) {
  const { section } = await params;
  const sectionMeta = ESSAY_SECTIONS.find((s) => s.slug === section);
  if (!sectionMeta) notFound();

  const essays = getEssays()[section as EssaySection] ?? [];
  const description = sectionDescriptions[section] ?? "";

  return (
    <div className="px-6 pt-28 pb-24 max-w-5xl mx-auto">
      <FadeIn>
        <Link
          href="/essays"
          className="inline-flex items-center gap-2 text-sm mb-10 text-neutral-500 hover:text-cyan-400 transition-colors"
        >
          ← Essays
        </Link>
        <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#06b6d4" }}>
          {sectionMeta.label}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          {sectionMeta.label}
        </h1>
        {description && (
          <p className="text-neutral-400 text-lg max-w-xl mb-14">{description}</p>
        )}
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {essays.map((essay, i) => (
          <FadeIn key={essay.slug} delay={i * 0.04}>
            <EssayCard essay={essay} />
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
