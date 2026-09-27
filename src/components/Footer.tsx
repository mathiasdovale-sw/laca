import { fallbackSiteTitle } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";

import { Container } from "./Container";

export async function Footer() {
  const settings = await sanityFetch({
    query: settingsQuery,
    tags: ["settings"],
  });

  const socials = [
    { label: "Instagram", href: settings?.instagram },
    { label: "LinkedIn", href: settings?.linkedin },
    { label: "Facebook", href: settings?.facebook },
  ].filter((social): social is { label: string; href: string } =>
    Boolean(social.href),
  );

  return (
    <footer className="mt-24 border-t border-border text-sm text-muted">
      <Container className="grid gap-8 py-10 sm:grid-cols-3">
        <div>
          <p className="font-semibold text-foreground">
            {settings?.siteTitle ?? fallbackSiteTitle}
          </p>
          {settings?.address && (
            <p className="mt-2 whitespace-pre-line">
              {settings.mapsUrl ? (
                <a
                  href={settings.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {settings.address}
                </a>
              ) : (
                settings.address
              )}
            </p>
          )}
        </div>

        <ul className="space-y-1">
          {settings?.email && (
            <li>
              <a href={`mailto:${settings.email}`} className="hover:underline">
                {settings.email}
              </a>
            </li>
          )}
          {settings?.phone && (
            <li>
              <a
                href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}
                className="hover:underline"
              >
                {settings.phone}
              </a>
            </li>
          )}
        </ul>

        {socials.length > 0 && (
          <ul className="space-y-1">
            {socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </footer>
  );
}
