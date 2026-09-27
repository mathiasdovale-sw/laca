import Link from "next/link";

import { fallbackSiteTitle, navigation } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";

import { Container } from "./Container";

export async function Header() {
  const settings = await sanityFetch({
    query: settingsQuery,
    tags: ["settings"],
  });

  return (
    <header className="border-b border-border">
      <Container className="flex flex-wrap items-center justify-between gap-4 py-5">
        <Link href="/" className="font-semibold">
          {settings?.siteTitle ?? fallbackSiteTitle}
        </Link>
        <nav aria-label="Principal">
          <ul className="flex gap-6 text-sm">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
