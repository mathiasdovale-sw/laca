import type { Metadata } from "next";
import { toPlainText } from "next-sanity";

import { toBlocks } from "@/components/RichText";
import type { SanityImageValue } from "@/components/SanityImage";
import { fallbackSiteTitle } from "@/lib/site";
import { urlFor } from "@/sanity/lib/image";
import type { RichText } from "@/sanity/types";

type Seo = {
  title?: string | null;
  description?: string | null;
  image?: SanityImageValue | null;
} | null;

/**
 * Arma las metadatas de una página. Usa primero el bloque SEO cargado en
 * Sanity y, si está vacío, los valores de respaldo (título, texto, portada).
 */
export function buildMetadata({
  seo,
  title,
  description,
  image,
  path,
}: {
  seo?: Seo;
  title?: string | null;
  description?: string | RichText | null;
  image?: SanityImageValue | null;
  path: string;
}): Metadata {
  const finalTitle = seo?.title || title || undefined;
  const finalDescription =
    seo?.description || toDescription(description) || undefined;
  const ogImage = seo?.image?.asset ? seo.image : image?.asset ? image : null;

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: { canonical: path },
    // openGraph reemplaza entero al del layout: se repiten locale y type.
    openGraph: {
      locale: "es_AR",
      type: "website",
      siteName: fallbackSiteTitle,
      title: finalTitle,
      description: finalDescription,
      url: path,
      images: ogImage
        ? [
            {
              // Imagen servida directo por el CDN de Sanity: no consume
              // transformaciones de Vercel.
              url: urlFor(ogImage).width(1200).height(630).fit("crop").url(),
              width: 1200,
              height: 630,
              alt: ogImage.alt ?? "",
            },
          ]
        : undefined,
    },
  };
}

function toDescription(value: string | RichText | null | undefined) {
  if (!value) return undefined;
  const text = typeof value === "string" ? value : toPlainText(toBlocks(value));
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > 160 ? `${clean.slice(0, 157).trimEnd()}…` : clean;
}
