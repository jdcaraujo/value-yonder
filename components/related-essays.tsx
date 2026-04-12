import Link from "next/link";
import { Essay, EssaySection, ESSAY_SECTIONS, getSectionEssays, getEssaysBySlug } from "@/lib/content";

export function RelatedEssays({ current }: { current: Essay }) {
  const related =
    current.relatedEssays?.length
      ? getEssaysBySlug(current.relatedEssays)
      : getSectionEssays(current.section as EssaySection, current.slug);

  if (related.length === 0) return null;

  const sectionLabel = ESSAY_SECTIONS.find((s) => s.slug === current.section)?.label || current.section;

  return (
    <aside className="mt-16 pt-10" style={{ borderTop: "1px solid #1e1f28" }}>
      <p className="text-xs font-semibold uppercase tracking-widest mb-6" style={{ color: "#06b6d4" }}>
        More in {sectionLabel}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {related.map((essay) => {
          const label = ESSAY_SECTIONS.find((s) => s.slug === essay.section)?.label || essay.section;
          return (
            <Link
              key={essay.slug}
              href={`/essays/${essay.section}/${essay.slug}`}
              className="group block rounded-2xl p-5 border border-transparent hover:border-neutral-800 transition-all duration-300"
              style={{ background: "#111218" }}
            >
              <span
                className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold mb-3"
                style={{ background: "#1e1f28", color: "#06b6d4" }}
              >
                {label}
              </span>
              <p className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors leading-snug mb-2">
                {essay.title}
              </p>
              <p className="text-xs text-neutral-600">{essay.readingTime} min read</p>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
