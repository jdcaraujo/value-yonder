import Link from "next/link";
import { EssayCard } from "@/components/essay-card";
import { FadeIn } from "@/components/fade-in";
import { getEssays, ESSAY_SECTIONS } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Essays — Value Yonder",
  description: "Notes organised around a question — on learning, on progress, and on prosperity.",
  path: "/essays",
});

export default function EssaysPage() {
  const grouped = getEssays();

  return (
    <div className="px-6 pt-28 pb-24 max-w-6xl mx-auto">
      <FadeIn>
        <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--color-cyan)" }}>
          Essays
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Writing
        </h1>
        <p className="text-neutral-400 text-lg max-w-xl mb-14">
          Notes organised around a question — on learning, on progress, and on prosperity.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {ESSAY_SECTIONS.map(({ slug: section, label }, sectionIdx) => {
          const essays = grouped[section] ?? [];
          const preview = essays.slice(0, 2);

          return (
            <FadeIn key={section} delay={sectionIdx * 0.1}>
              <div className="flex flex-col h-full">
                {/* Section header */}
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-semibold text-white">{label}</h2>
                  <span className="text-xs text-neutral-500">{essays.length} essays</span>
                </div>

                {/* Preview cards */}
                <div className="flex flex-col gap-3 flex-1">
                  {preview.map((essay, i) => (
                    <FadeIn key={essay.slug} delay={sectionIdx * 0.1 + i * 0.06}>
                      <EssayCard essay={essay} />
                    </FadeIn>
                  ))}
                </div>

                {/* See all link */}
                {essays.length > 2 && (
                  <Link
                    href={`/essays/${section}`}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-cyan-400"
                    style={{ color: "var(--color-cyan)" }}
                  >
                    See all {essays.length} essays →
                  </Link>
                )}
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
