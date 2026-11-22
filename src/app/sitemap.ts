import type { MetadataRoute } from "next";

import { navigation, siteUrl } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/fetch";
import { legalSitemapQuery, sitemapQuery } from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await sanityFetch({
    query: sitemapQuery,
    tags: ["project"],
  });
  const legalPages = await sanityFetch({
    query: legalSitemapQuery,
    tags: ["legalPage"],
  });

  return [
    { url: `${siteUrl}/` },
    ...navigation.map((item) => ({ url: `${siteUrl}${item.href}` })),
    ...projects.map((project) => ({
      url: `${siteUrl}/proyectos/${project.slug}`,
      lastModified: project._updatedAt,
    })),
    ...legalPages.map((page) => ({
      url: `${siteUrl}/legales/${page.slug}`,
      lastModified: page._updatedAt,
    })),
  ];
}
