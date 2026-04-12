import Link from "next/link";
import { Essay } from "@/lib/content";

interface EssayCardProps {
  essay: Essay;
}

const sectionLabels: Record<string, string> = {
  "on-learning": "On Learning",
  "on-progress": "On Progress",
  "on-prosperity": "On Prosperity",
};

export function EssayCard({ essay }: EssayCardProps) {
  const href = `/essays/${essay.section}/${essay.slug}`;

  return (
    <Link href={href} className="group block h-full">
      <article className="essay-card h-full p-6 rounded-3xl border border-transparent transition-all duration-200 hover:border-neutral-800 hover:scale-[1.015]" style={{ background: "#111218" }}>
        {/* Category badge */}
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
          style={{ background: "#1e1f28", color: "#06b6d4" }}
        >
          {sectionLabels[essay.section] || essay.section}
        </span>

        {/* Title */}
        <h3 className="text-base font-semibold text-white mb-2 leading-snug group-hover:text-cyan-400 transition-colors">
          {essay.title}
        </h3>

        {/* Description */}
        {essay.description && (
          <p className="text-sm text-neutral-500 leading-relaxed mb-4 line-clamp-2">
            {essay.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-3 pt-3">
          {essay.date && (
            <span className="text-xs text-neutral-600">
              {new Date(essay.date).toLocaleDateString("en-GB", {
                year: "numeric",
                month: "short",
              })}
            </span>
          )}
          <span className="text-xs text-neutral-600">{essay.readingTime} min read</span>
        </div>
      </article>
    </Link>
  );
}
