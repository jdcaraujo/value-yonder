import { FadeIn } from "@/components/fade-in";
import { Bookshelf } from "@/components/bookshelf";
import { getBooks } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Reading — Value Yonder",
  description: "Books read, with notes — an open bookshelf.",
  path: "/reading",
});

export default function ReadingPage() {
  const years = getBooks();
  const totalBooks = years.reduce((acc, y) => acc + y.books.length, 0);
  const allRatings = years.flatMap((y) => y.books.map((b) => b.rating)).filter((r) => r > 0);
  const avgRating = allRatings.length
    ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1)
    : "—";

  return (
    <div className="px-6 pt-28 pb-24 max-w-5xl mx-auto">
      <FadeIn>
        <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "var(--color-cyan)" }}>
          Reading
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          The Shelf
        </h1>
        <div className="flex items-center gap-6 text-sm text-neutral-500 mb-2">
          <span><span className="text-white font-semibold">{totalBooks}</span> books</span>
          <span><span className="text-white font-semibold">{avgRating}</span> avg rating</span>
        </div>
        <p className="text-xs text-neutral-500 mb-12">
          Grouped by year. Scroll a shelf sideways; pick a book to pull it forward.
        </p>
      </FadeIn>

      <Bookshelf years={years} />
    </div>
  );
}
