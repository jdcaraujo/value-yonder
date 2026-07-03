import { Hero } from "@/components/hero";
import { EssayCard } from "@/components/essay-card";
import { FadeIn } from "@/components/fade-in";
import { getAllEssays } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Value Yonder — Daniel Araújo",
  description: "AI product leader. Former founder. Writing about what I'm learning.",
  path: "/",
});

export default function HomePage() {
  const recentEssays = getAllEssays().slice(0, 6);

  return (
    <>
      <Hero />

      {/* Recent Writing */}
      <section className="px-6 pb-24 max-w-5xl mx-auto">
        <FadeIn>
          <div className="flex items-center gap-3 mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#06b6d4" }}>
              Recent Writing
            </span>
            <div className="flex-1 h-px" style={{ background: "#1e1f28" }} />
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentEssays.map((essay, i) => (
            <FadeIn key={essay.slug} delay={i * 0.07}>
              <EssayCard essay={essay} />
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.4} className="mt-8 text-center">
          <a
            href="/essays"
            className="inline-block px-6 py-3 rounded-full text-sm font-medium transition-all duration-200"
            style={{
              background: "rgba(6,182,212,0.08)",
              border: "1px solid rgba(6,182,212,0.2)",
              color: "#06b6d4",
            }}
          >
            All essays →
          </a>
        </FadeIn>
      </section>
    </>
  );
}
