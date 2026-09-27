import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "next-sanity";

import type { RichText as RichTextValue } from "@/sanity/types";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-8 mb-4 text-xl font-semibold">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 mb-3 text-lg font-semibold">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mb-4 border-l-2 border-border pl-4 text-muted italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-4 list-disc pl-6">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="mb-4 list-decimal pl-6">{children}</ol>
    ),
  },
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href ?? "#";
      const external = href.startsWith("http");
      return (
        <a
          href={href}
          className="underline underline-offset-2"
          {...(external && { target: "_blank", rel: "noopener noreferrer" })}
        >
          {children}
        </a>
      );
    },
  },
};

export function RichText({
  value,
}: {
  value: RichTextValue | null | undefined;
}) {
  if (!value?.length) return null;
  return <PortableText value={toBlocks(value)} components={components} />;
}

/**
 * El tipo que genera TypeGen marca `children` como opcional y el de
 * PortableText lo exige; en la práctica Sanity siempre lo guarda.
 */
export function toBlocks(value: RichTextValue) {
  return value as PortableTextBlock[];
}
