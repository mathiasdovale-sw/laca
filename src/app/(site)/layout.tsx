import type { Metadata } from "next";

import "../globals.css";

import { SiteShell } from "@/components/SiteShell";
import { fallbackSiteTitle, siteUrl } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch({
    query: settingsQuery,
    tags: ["settings"],
  });
  const siteTitle = settings?.siteTitle ?? fallbackSiteTitle;

  return {
    metadataBase: new URL(siteUrl),
    title: { default: siteTitle, template: `%s · ${siteTitle}` },
    description: settings?.siteDescription ?? undefined,
    openGraph: {
      siteName: siteTitle,
      locale: "es_AR",
      type: "website",
    },
  };
}

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return <SiteShell>{children}</SiteShell>;
}
