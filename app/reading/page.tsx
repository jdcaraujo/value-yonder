import { FadeIn } from "@/components/fade-in";
import { getBooks } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Reading — Value Yonder",
  description: "Books read, with notes.",
  path: "/reading",
});

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ color: s <= rating ? "#06b6d4" : "#2a2b35", fontSize: "10px" }}>★</span>
      ))}
    </div>
  );
}

export default function ReadingPage() {
  const years = getBooks();
  const totalBooks = years.reduce((acc, y) => acc + y.books.length, 0);
  const allRatings = years.flatMap((y) => y.books.map((b) => b.rating)).filter((r) => r > 0);
  const avgRating = allRatings.length ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1) : "—";

  return (
    <div className="px-6 pt-28 pb-24 max-w-5xl mx-auto">
      <FadeIn>
        <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: "#06b6d4" }}>
          Reading
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Books
        </h1>
        <div className="flex items-center gap-6 text-sm text-neutral-500 mb-16">
          <span><span className="text-white font-semibold">{totalBooks}</span> books</span>
          <span><span className="text-white font-semibold">{avgRating}</span> avg rating</span>
        </div>
      </FadeIn>

      <div className="space-y-16">
        {years.map((year, yi) => (
          <FadeIn key={year.year} delay={yi * 0.05}>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-lg font-semibold text-white">{year.year}</h2>
              <div className="flex-1 h-px" style={{ background: "#1e1f28" }} />
              <span className="text-xs text-neutral-600">{year.books.length} books</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
              {year.books.map((book, bi) => (
                <div key={bi} className="group relative" title={`${book.title} — ${book.author}`}>
                  <div className="rounded-lg overflow-hidden aspect-[2/3]" style={{ background: "#1e1f28" }}>
                    {book.cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-end p-2">
                        <span className="text-[9px] text-neutral-500 leading-tight line-clamp-3">{book.title}</span>
                      </div>
                    )}
                  </div>
                  {/* Tooltip on hover */}
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 rounded-xl z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    style={{ background: "#1a1b24", border: "1px solid #2a2b35" }}
                  >
                    <p className="font-semibold text-white mb-0.5 line-clamp-2 text-sm">{book.title}</p>
                    <p className="text-neutral-500 mb-1.5 text-xs">{book.author}</p>
                    {book.rating > 0 && <Stars rating={book.rating} />}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
