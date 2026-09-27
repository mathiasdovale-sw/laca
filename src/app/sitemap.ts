import type { MetadataRoute } from "next";

import { navigation, siteUrl } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/fetch";
import { sitemapQuery } from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await sanityFetch({
    query: sitemapQuery,
    tags: ["project"],
  });

  return [
    { url: `${siteUrl}/` },
    ...navigation.map((item) => ({ url: `${siteUrl}${item.href}` })),
    ...projects.map((project) => ({
      url: `${siteUrl}/proyectos/${project.slug}`,
      lastModified: project._updatedAt,
    })),
  ];
}
