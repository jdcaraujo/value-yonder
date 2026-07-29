"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Book, BookYear } from "@/lib/content";

/* Deterministic book-cloth palette (spine gradient: top → bottom). */
const CLOTHS: [string, string][] = [
  ["#8a3542", "#6d2531"], // burgundy
  ["#35566a", "#243b49"], // slate blue
  ["#4a6a49", "#33502f"], // forest
  ["#c07f36", "#9a5f22"], // ochre
  ["#3f6b7d", "#2b4d5c"], // teal-blue
  ["#665579", "#4a3c5c"], // plum
  ["#9a5636", "#7a3f27"], // terracotta
  ["#34796d", "#245b52"], // pine
  ["#565b86", "#3e4266"], // indigo
  ["#7a713f", "#5c5430"], // olive
  ["#8f5670", "#6e3f56"], // mauve
  ["#3b5262", "#293b48"], // steel
  ["#4c4a4f", "#343237"], // charcoal cloth
  ["#a8843f", "#7f5f26"], // tan/gold
];

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

interface Dims {
  cloth: [string, string];
  w: number;
  h: number;
  d: number;
}

function bookDims(book: Book): Dims {
  const n = hash(book.title + "|" + book.author);
  const cloth = CLOTHS[n % CLOTHS.length];
  // Height + thickness vary deterministically so the shelf reads as real books.
  const h = 168 + ((n >>> 7) % 40); // 168–207
  const w = Math.round(h * 0.66); // ~2:3 covers
  const len = book.title.length;
  const d = 20 + Math.min(14, Math.floor(len / 12) * 3) + ((n >>> 3) % 6); // 20–39
  return { cloth, w, h, d };
}

function clothBg([a, b]: [string, string]): string {
  return `linear-gradient(150deg, ${a}, ${b})`;
}

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          style={{
            color: s <= rating ? "#e9c46a" : "var(--color-border-hover)",
            fontSize: size,
            lineHeight: 1,
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
}

function readYear(book: Book, fallback: string): string {
  if (book.dateRead) return book.dateRead.slice(0, 4);
  return fallback === "Unknown" ? "" : fallback;
}

/* ─── 3D book ────────────────────────────────────────────────────────────── */

function Book({ book, onOpen }: { book: Book; onOpen: () => void }) {
  const { cloth, w, h, d } = useMemo(() => bookDims(book), [book]);
  const [imgFailed, setImgFailed] = useState(false);
  const hasCover = !!book.cover && !imgFailed;

  return (
    <button
      type="button"
      className="book"
      style={
        {
          "--w": `${w}px`,
          "--h": `${h}px`,
          "--d": `${d}px`,
          "--c1": cloth[0],
          "--c2": cloth[1],
        } as React.CSSProperties
      }
      onClick={onOpen}
      aria-label={`${book.title} by ${book.author}${book.rating ? `, rated ${book.rating} of 5` : ""}`}
    >
      {/* Front cover */}
      <span className="book__face book__front">
        {hasCover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.cover}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span className="book__proc" style={{ background: clothBg(cloth) }}>
            <span className="book__proc-author">{book.author}</span>
            <span className="book__proc-title">{book.title}</span>
            <span className="book__proc-rule" />
          </span>
        )}
        <span className="book__cap">
          <b>{book.title}</b>
          <span>{book.author}</span>
          {book.rating > 0 && <em aria-hidden="true">{"★".repeat(book.rating)}</em>}
        </span>
      </span>

      {/* Spine (left) */}
      <span className="book__face book__spine">
        <span>{book.title}</span>
      </span>

      {/* Page edges */}
      <span className="book__face book__pages" />
      <span className="book__face book__top" />
    </button>
  );
}

/* ─── Detail dialog ──────────────────────────────────────────────────────── */

function BookDialog({
  book,
  year,
  onClose,
}: {
  book: Book;
  year: string;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const { cloth } = useMemo(() => bookDims(book), [book]);
  const [imgFailed, setImgFailed] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const yr = readYear(book, year);
  const hasCover = !!book.cover && !imgFailed;

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const cover = hasCover ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={book.cover}
      alt={`Cover of ${book.title}`}
      className="w-full h-full object-cover"
      onError={() => setImgFailed(true)}
    />
  ) : (
    // Procedural clothbound front for books without a cover image.
    <div
      className="w-full h-full flex flex-col justify-between p-5 text-center"
      style={{ background: clothBg(cloth), color: "var(--spine-text)" }}
    >
      <span className="text-[10px] uppercase tracking-[0.22em] opacity-70">{book.author}</span>
      <span
        className="font-serif leading-tight"
        style={{ fontFamily: "var(--font-newsreader), Georgia, serif", fontSize: "clamp(15px, 4vw, 22px)" }}
      >
        {book.title}
      </span>
      <span className="mx-auto w-8 h-px opacity-50" style={{ background: "var(--spine-text)" }} />
    </div>
  );

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${book.title} by ${book.author}`}
    >
      <motion.div
        className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden"
        style={{ background: "var(--color-card)", border: "1px solid var(--color-border)", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.65)" }}
        initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full text-neutral-400 hover:text-white transition-colors"
          style={{ background: "var(--surface-active)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="flex flex-col sm:flex-row max-h-[90vh]">
          <div className="sm:w-[44%] shrink-0 p-7 sm:p-8 flex items-center justify-center" style={{ background: "var(--color-card-hover)" }}>
            <div
              className="rounded-xl overflow-hidden aspect-[2/3] w-48 sm:w-full max-w-[280px]"
              style={{ boxShadow: "0 18px 34px -14px rgba(0,0,0,0.6)" }}
            >
              {cover}
            </div>
          </div>

          <div className="flex-1 p-7 sm:p-8 sm:pr-14 overflow-y-auto">
            <h2 className="text-2xl md:text-[28px] font-semibold text-white leading-tight mb-2">{book.title}</h2>
            <p className="text-base text-neutral-400 mb-4">{book.author}</p>

            {book.rating > 0 && (
              <div className="mb-5">
                <Stars rating={book.rating} size={20} />
              </div>
            )}

            <dl className="text-sm text-neutral-500 space-y-2">
              {yr && (
                <div className="flex gap-3">
                  <dt className="uppercase tracking-wider w-20 shrink-0">Read</dt>
                  <dd className="text-neutral-300">{book.dateRead || yr}</dd>
                </div>
              )}
              {book.format && (
                <div className="flex gap-3">
                  <dt className="uppercase tracking-wider w-20 shrink-0">Format</dt>
                  <dd className="text-neutral-300 capitalize">{book.format}</dd>
                </div>
              )}
              {book.tags?.length > 0 && (
                <div className="flex gap-3">
                  <dt className="uppercase tracking-wider w-20 shrink-0">Tags</dt>
                  <dd className="text-neutral-300">{book.tags.join(", ")}</dd>
                </div>
              )}
            </dl>

            {book.review && (
              <p className="mt-6 text-base leading-relaxed text-neutral-300 border-l-2 pl-4" style={{ borderColor: "var(--color-cyan)" }}>
                {book.review}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Shelf (one year) ───────────────────────────────────────────────────── */

function Shelf({ year, onOpen }: { year: BookYear; onOpen: (b: Book) => void }) {
  const label = year.year === "Unknown" ? "Undated" : year.year;
  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <h2 className="text-lg font-semibold text-white">{label}</h2>
        <div className="flex-1 h-px" style={{ background: "var(--color-border)" }} />
        <span className="text-xs text-neutral-500">{year.books.length} books</span>
      </div>
      <div className="shelf-scene">
        <div className="shelf-track">
          {year.books.map((book, i) => (
            <Book key={i} book={book} onOpen={() => onOpen(book)} />
          ))}
        </div>
        <div className="shelf-ledge" />
      </div>
    </div>
  );
}

/* ─── Bookshelf ──────────────────────────────────────────────────────────── */

export function Bookshelf({ years }: { years: BookYear[] }) {
  // Push the "Undated" group to the end regardless of source order.
  const ordered = useMemo(() => {
    const named = years.filter((y) => y.year !== "Unknown");
    const unknown = years.filter((y) => y.year === "Unknown");
    return [...named, ...unknown];
  }, [years]);

  const [selected, setSelected] = useState<{ book: Book; year: string } | null>(null);

  const open = useCallback(
    (year: string) => (book: Book) => setSelected({ book, year }),
    [],
  );

  return (
    <div className="space-y-10">
      {ordered.map((year) => (
        <Shelf key={year.year} year={year} onOpen={open(year.year)} />
      ))}

      <AnimatePresence>
        {selected && (
          <BookDialog
            key={`${selected.year}:${selected.book.title}`}
            book={selected.book}
            year={selected.year}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
