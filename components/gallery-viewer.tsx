"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/fade-in";

interface ImageData {
  src: string;
  thumbSrc: string;
  fullSrc: string;
  alt: string;
  caption: string;
}

type PhotoSegment = { type: "photos"; indices: number[]; layout: "single" | "pair" | "grid" | "trio" };
type TextSegment  = { type: "text"; paragraphs: string[] };
type Segment = TextSegment | PhotoSegment;

interface Props {
  segments: Segment[];
  images: ImageData[];
}

function Photo({
  img,
  onClick,
}: {
  img: ImageData;
  onClick: () => void;
}) {
  return (
    <figure
      className="rounded-2xl overflow-hidden cursor-zoom-in"
      style={{ background: "var(--color-card)" }}
      onClick={onClick}
    >
      <picture>
        <source srcSet={img.thumbSrc} type="image/webp" />
        <img
          src={img.src}
          alt={img.alt}
          className="w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
          loading="lazy"
        />
      </picture>
      {img.caption && (
        <figcaption className="px-4 py-3 text-xs text-neutral-500 leading-relaxed italic">
          {img.caption}
        </figcaption>
      )}
    </figure>
  );
}

function PhotoBlock({
  segment,
  images,
  onOpen,
}: {
  segment: PhotoSegment;
  images: ImageData[];
  onOpen: (index: number) => void;
}) {
  const entries = segment.indices
    .map((idx) => ({ idx, img: images[idx] }))
    .filter((e) => Boolean(e.img));

  if (segment.layout === "single") {
    return (
      <div className="max-w-3xl mx-auto">
        <Photo img={entries[0].img} onClick={() => onOpen(entries[0].idx)} />
      </div>
    );
  }

  const cols =
    segment.layout === "trio" ? "grid-cols-3" : "grid-cols-2";

  return (
    <div className={`grid ${cols} gap-3`}>
      {entries.map(({ idx, img }) => (
        <Photo key={idx} img={img} onClick={() => onOpen(idx)} />
      ))}
    </div>
  );
}

export function GalleryViewer({ segments, images }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const lightbox = lightboxIdx !== null ? images[lightboxIdx] : null;

  const close = useCallback(() => setLightboxIdx(null), []);
  const step = useCallback(
    (delta: number) =>
      setLightboxIdx((idx) =>
        idx === null ? idx : (idx + delta + images.length) % images.length
      ),
    [images.length]
  );

  // Keyboard: Escape closes, arrows navigate
  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightboxIdx, close, step]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  return (
    <>
      <div className="space-y-14">
        {segments.map((seg, i) => (
          <FadeIn key={i} delay={0.05}>
            {seg.type === "text" ? (
              <div className="space-y-4">
                {seg.paragraphs.map((para, j) => (
                  <p key={j} className="text-neutral-300 leading-relaxed text-base md:text-lg">
                    {para}
                  </p>
                ))}
              </div>
            ) : (
              <PhotoBlock segment={seg} images={images} onOpen={setLightboxIdx} />
            )}
          </FadeIn>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[100] flex items-center justify-center cursor-zoom-out"
            style={{ background: "rgba(5, 6, 12, 0.96)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
          >
            <motion.div
              className="relative max-w-[92vw] max-h-[92vh] flex flex-col items-center"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <picture>
                <source srcSet={lightbox.fullSrc} type="image/webp" />
                <img
                  src={lightbox.src}
                  alt={lightbox.alt}
                  className="max-w-[92vw] max-h-[85vh] object-contain rounded-xl"
                  style={{ boxShadow: "0 24px 80px rgba(0,0,0,0.7)" }}
                  onClick={close}
                />
              </picture>
              {lightbox.caption && (
                <p className="mt-4 text-sm text-neutral-400 text-center max-w-lg px-4 italic leading-relaxed">
                  {lightbox.caption}
                </p>
              )}
            </motion.div>

            {/* Prev / next */}
            <button
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 p-3 text-2xl text-neutral-500 hover:text-white transition-colors cursor-pointer"
              onClick={(e) => { e.stopPropagation(); step(-1); }}
              aria-label="Previous photo"
            >
              ‹
            </button>
            <button
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 p-3 text-2xl text-neutral-500 hover:text-white transition-colors cursor-pointer"
              onClick={(e) => { e.stopPropagation(); step(1); }}
              aria-label="Next photo"
            >
              ›
            </button>

            {/* Close hint */}
            <button
              className="absolute top-5 right-5 text-neutral-500 hover:text-white transition-colors text-sm"
              onClick={close}
              aria-label="Close"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
