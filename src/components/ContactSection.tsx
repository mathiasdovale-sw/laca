import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";

import { ContactForm } from "./ContactForm";
import { Container } from "./Container";
import { Label } from "./ui";

/** Bloque negro de contacto: aparece al final de todas las páginas. */
export async function ContactSection() {
  const settings = await sanityFetch({
    query: settingsQuery,
    tags: ["settings"],
  });

  const details = [
    {
      label: "Teléfono",
      value: settings?.phone,
      href: settings?.phone && `tel:${settings.phone.replace(/[^\d+]/g, "")}`,
    },
    {
      label: "Email",
      value: settings?.email,
      href: settings?.email && `mailto:${settings.email}`,
    },
    { label: "Estudio", value: settings?.location, href: null },
  ].filter((detail) => detail.value);

  const instagram = settings?.instagram;
  const instagramHandle = instagram && handleFromUrl(instagram);

  return (
    <section
      id="contacto"
      aria-labelledby="contact-title"
      className="bg-foreground py-16 text-white md:py-24"
    >
      <Container>
        <div className="flex flex-col gap-6 border-b border-white/15 pb-12 md:flex-row md:items-start md:justify-between md:pb-16">
          <h2
            id="contact-title"
            className="max-w-md text-4xl leading-[1.05] tracking-tight text-balance md:text-5xl"
          >
            {settings?.contactTitle ?? "¿Tenés un proyecto en mente?"}
          </h2>
          {settings?.contactText && (
            <p className="max-w-xs text-sm leading-relaxed text-white/70 md:mt-2">
              {settings.contactText}
            </p>
          )}
        </div>

        <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-[2fr_3fr]">
          <div className="space-y-10">
            <dl className="space-y-8">
              {details.map((detail) => (
                <div key={detail.label}>
                  <Label as="dt" className="mb-2 text-white/50">
                    {detail.label}
                  </Label>
                  <dd className="text-base">
                    {detail.href ? (
                      <a href={detail.href} className="hover:underline">
                        {detail.value}
                      </a>
                    ) : (
                      detail.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            {instagram && (
              <div>
                <Label className="mb-3 text-white/50">Seguinos</Label>
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 rounded-full border border-white/40 py-3 pr-6 pl-4 text-base transition-colors hover:bg-white hover:text-foreground"
                >
                  <InstagramIcon />
                  <span>
                    {instagramHandle ? `@${instagramHandle}` : "Instagram"}
                  </span>
                  <span aria-hidden="true">↗</span>
                  <span className="sr-only">
                    (Instagram, se abre en otra pestaña)
                  </span>
                </a>
              </div>
            )}
          </div>

          <ContactForm />
        </div>
      </Container>
    </section>
  );
}

/** “https://www.instagram.com/estudiolaca/” → “estudiolaca”. */
function handleFromUrl(url: string) {
  try {
    return new URL(url).pathname.split("/").find(Boolean) ?? null;
  } catch {
    return null;
  }
}

function InstagramIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="size-5"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}
