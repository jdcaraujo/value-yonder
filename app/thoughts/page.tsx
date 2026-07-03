import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { getThoughts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Thoughts — Value Yonder",
  description: "Random thoughts, clustered by themes instead of dates.",
  path: "/thoughts",
});

export default function ThoughtsPage() {
  const thoughts = getThoughts();

  return (
    <div className="px-6 pt-28 pb-24 max-w-5xl mx-auto">
      <FadeIn>
        <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#06b6d4" }}>
          Thoughts
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Thinking out loud
        </h1>
        <p className="text-neutral-400 text-lg max-w-xl mb-16">
          Random thoughts, clustered by themes instead of dates.
        </p>
      </FadeIn>

      <div className="space-y-4 max-w-2xl">
        {thoughts.map((thought, i) => (
          <FadeIn key={thought.slug} delay={i * 0.08}>
            <Link href={`/thoughts/${thought.slug}`} className="group block">
              <article
                className="p-6 rounded-2xl border border-transparent hover:border-neutral-800 transition-all duration-200"
                style={{ background: "#111218" }}
              >
                <h2 className="text-base font-semibold text-white group-hover:text-cyan-400 transition-colors mb-2">
                  {thought.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-neutral-600">
                  {thought.date && (
                    <time dateTime={thought.date}>
                      {new Date(thought.date).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}
                    </time>
                  )}
                  <span>{thought.readingTime} min read</span>
                </div>
              </article>
            </Link>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
