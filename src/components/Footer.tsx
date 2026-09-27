import Link from "next/link";

import { fallbackSiteTitle, legalLinks, navigation } from "@/lib/site";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";

import { Container } from "./Container";
import { Label } from "./ui";

export async function Footer() {
  const settings = await sanityFetch({
    query: settingsQuery,
    tags: ["settings"],
  });

  const socials = [
    { label: "instagram", href: settings?.instagram },
    { label: "linkedin", href: settings?.linkedin },
  ].filter((social): social is { label: string; href: string } =>
    Boolean(social.href),
  );

  return (
    <footer className="pt-16 text-sm">
      <Container>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          <FooterColumn title="Contacto">
            {settings?.phone && (
              <li>
                <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}>
                  {settings.phone}
                </a>
              </li>
            )}
            {settings?.email && (
              <li>
                <a href={`mailto:${settings.email}`}>{settings.email}</a>
              </li>
            )}
            {settings?.location && <li>{settings.location}</li>}
          </FooterColumn>

          <FooterColumn title="Navegación">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="lowercase">
                  {item.label}
                </Link>
              </li>
            ))}
          </FooterColumn>

          {socials.length > 0 && (
            <FooterColumn title="Redes">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </FooterColumn>
          )}

          <FooterColumn title="Legal">
            {legalLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </FooterColumn>
        </div>

        <p
          aria-hidden="true"
          className="mt-20 text-right text-[17vw] leading-[0.85] font-medium tracking-tighter md:text-[13vw]"
        >
          {fallbackSiteTitle}
        </p>

        <div className="mt-10 flex items-center justify-between border-t border-border py-6">
          <p className="text-[0.6875rem] tracking-[0.15em] text-muted">
            © {new Date().getFullYear()} {fallbackSiteTitle}
          </p>
          <a href="#top" className="text-muted hover:text-foreground">
            <Label as="span">
              Volver arriba <span aria-hidden="true">↑</span>
            </Label>
          </a>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label as="h2" className="mb-4 text-muted">
        {title}
      </Label>
      <ul className="space-y-1 [&_a]:hover:underline">{children}</ul>
    </div>
  );
}
