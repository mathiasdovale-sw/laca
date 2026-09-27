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
  hotspot?: { x?: number | null; y?: number | null } | null;
};

// Ancho máximo de la imagen original que se le pide a Sanity. Vercel la
// optimiza a partir de ahí (no acepta originales de más de 8192 px).
const MAX_SOURCE_WIDTH = 2560;

type Props = Omit<ImageProps, "src" | "alt" | "width" | "height"> & {
  image: SanityImageValue | null | undefined;
};

/**
 * next/image con una imagen de Sanity, optimizada por Vercel.
 *
 * La URL siempre termina en `?w=2560&fit=max` (lo único que acepta
 * `remotePatterns` en next.config.ts), así nadie puede pedir variantes
 * arbitrarias y agotar las transformaciones del plan. Por eso el recorte
 * (crop) de Sanity no se aplica; el punto de interés (hotspot) sí, vía
 * `object-position`, en las imágenes con `fill`.
 *
 * Sin `fill`, usa las proporciones originales; con `fill`, ocupa el
 * contenedor (que tiene que tener tamaño).
 */
export function SanityImage({ image, fill, style, ...props }: Props) {
  if (!image?.asset) return null;

  const src = urlFor(image.asset._id).width(MAX_SOURCE_WIDTH).fit("max").url();
  const alt = image.alt ?? "";

  if (fill) {
    const { x = 0.5, y = 0.5 } = image.hotspot ?? {};
    return (
      <Image
        src={src}
        alt={alt}
        fill
        style={{
          objectPosition: `${(x ?? 0.5) * 100}% ${(y ?? 0.5) * 100}%`,
          ...style,
        }}
        {...props}
      />
    );
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
      style={style}
      {...props}
    />
  );
}
