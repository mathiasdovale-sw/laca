import Link from "next/link";

import { fallbackSiteTitle } from "@/lib/site";

/** Logo en texto. Para reemplazarlo por un SVG, cambiar solo este archivo. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`tracking-tight ${className}`}>
      {fallbackSiteTitle}
    </Link>
  );
}
