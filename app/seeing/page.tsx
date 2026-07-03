import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { getGalleries } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Seeing — Value Yonder",
  description: "Photography from around the world.",
  path: "/seeing",
});

export default function SeeingPage() {
  const galleries = getGalleries();

  return (
    <div className="px-6 pt-28 pb-24 max-w-5xl mx-auto">
      <FadeIn>
        <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--color-cyan)" }}>
          Seeing
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Through glass
        </h1>
        <p className="text-neutral-400 text-lg max-w-xl mb-16">
          Places, moments, and the light that made them worth keeping.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {galleries.map((gallery, i) => (
          <FadeIn key={gallery.slug} delay={i * 0.1}>
            <Link href={`/seeing/${gallery.slug}`} className="group block">
              <article className="rounded-3xl overflow-hidden border border-transparent hover:border-neutral-800 transition-all duration-300" style={{ background: "var(--color-card)" }}>
                {/* Cover image */}
                <div className="relative overflow-hidden aspect-[16/9]">
                  <img
                    src={gallery.coverImage}
                    alt={gallery.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />
                  <span className="absolute bottom-3 right-3 text-xs text-neutral-400 bg-black/50 px-2 py-1 rounded-full">
                    {gallery.imageCount} photos
                  </span>
                </div>
                {/* Info */}
                <div className="p-5">
                  <h2 className="text-base font-semibold text-white group-hover:text-cyan-400 transition-colors mb-1">
                    {gallery.title}
                  </h2>
                  <p className="text-sm text-neutral-500 line-clamp-2">{gallery.description}</p>
                </div>
              </article>
            </Link>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
