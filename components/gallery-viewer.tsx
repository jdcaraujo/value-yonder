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
      style={{ background: "#111218" }}
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
  onOpen: (img: ImageData) => void;
}) {
  const imgs = segment.indices.map((i) => images[i]).filter(Boolean);

  if (segment.layout === "single") {
    return (
      <div className="max-w-3xl mx-auto">
        <Photo img={imgs[0]} onClick={() => onOpen(imgs[0])} />
      </div>
    );
  }

  const cols =
    segment.layout === "trio" ? "grid-cols-3" : "grid-cols-2";

  return (
    <div className={`grid ${cols} gap-3`}>
      {imgs.map((img, i) => (
        <Photo key={i} img={img} onClick={() => onOpen(img)} />
      ))}
    </div>
  );
}

export function GalleryViewer({ segments, images }: Props) {
  const [lightbox, setLightbox] = useState<ImageData | null>(null);

  const close = useCallback(() => setLightbox(null), []);

  // Close on Escape
  useEffect(() => {
    if (!lightbox) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, close]);

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
              <PhotoBlock segment={seg} images={images} onOpen={setLightbox} />
            )}
          </FadeIn>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
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
