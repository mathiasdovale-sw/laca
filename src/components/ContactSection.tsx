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

          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
