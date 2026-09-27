import Image, { type ImageProps } from "next/image";

import { urlFor } from "@/sanity/lib/image";

/** Forma mínima de una imagen de Sanity tal como la devuelven las queries. */
export type SanityImageValue = {
  alt?: string | null;
  asset?: {
    _id: string;
    metadata?: {
      dimensions?: { width?: number | null; height?: number | null } | null;
    } | null;
  } | null;
  crop?: unknown;
  hotspot?: unknown;
};

// Ancho máximo de la imagen original que se le pide a Sanity. Vercel la
// optimiza a partir de ahí (no acepta originales de más de 8192 px).
const MAX_SOURCE_WIDTH = 2560;

type Props = Omit<ImageProps, "src" | "alt" | "width" | "height"> & {
  image: SanityImageValue | null | undefined;
};

/**
 * next/image con una imagen de Sanity. Sin `fill`, usa las proporciones
 * originales; con `fill`, ocupa el contenedor (que tiene que tener tamaño).
 */
export function SanityImage({ image, fill, ...props }: Props) {
  if (!image?.asset) return null;

  const src = urlFor(image).width(MAX_SOURCE_WIDTH).fit("max").url();
  const alt = image.alt ?? "";

  if (fill) {
    return <Image src={src} alt={alt} fill {...props} />;
  }

  const { width = 1600, height = 1200 } =
    image.asset.metadata?.dimensions ?? {};
  const scale = Math.min(1, MAX_SOURCE_WIDTH / (width ?? 1600));

  return (
    <Image
      src={src}
      alt={alt}
      width={Math.round((width ?? 1600) * scale)}
      height={Math.round((height ?? 1200) * scale)}
      {...props}
    />
  );
}
