import type { Metadata } from "next";

export const SITE_URL = "https://valueyonder.com";
export const SITE_NAME = "Value Yonder";

interface PageMeta {
  title: string;
  description: string;
  /** Path relative to site root, e.g. "/essays/on-learning/foo" */
  path: string;
  ogType?: "website" | "article";
  /** Social-card title, when it should differ from the <title> (e.g. no site suffix) */
  ogTitle?: string;
  publishedTime?: string;
  images?: string[];
}

export function buildMetadata({
  title,
  description,
  path,
  ogType = "website",
  ogTitle = title,
  publishedTime,
  images,
}: PageMeta): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
      types: { "application/rss+xml": "/index.xml" },
    },
    openGraph: {
      type: ogType,
      siteName: SITE_NAME,
      locale: "en_PT",
      url: path,
      title: ogTitle,
      description,
      ...(publishedTime && { publishedTime }),
      images: images ?? ["/og.png"],
    },
    twitter: {
      card: "summary_large_image",
      creator: "@JDanielAraujo",
      title: ogTitle,
      description,
      images: images ?? ["/og.png"],
    },
  };
}
