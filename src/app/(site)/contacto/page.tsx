import type { Metadata } from "next";

import { ContactForm } from "@/components/ContactForm";
import { Container } from "@/components/Container";
import { buildMetadata } from "@/lib/metadata";
import { sanityFetch } from "@/sanity/lib/fetch";
import { settingsQuery } from "@/sanity/lib/queries";

export const metadata: Metadata = buildMetadata({
  title: "Contacto",
  description: "Escribinos para consultas sobre proyectos.",
  path: "/contacto",
});

export default async function ContactPage() {
  const settings = await sanityFetch({
    query: settingsQuery,
    tags: ["settings"],
  });

  return (
    <Container className="py-12">
      <h1 className="mb-8 text-2xl font-semibold">Contacto</h1>

      <div className="grid gap-12 md:grid-cols-[2fr_1fr]">
        <ContactForm />

        <ul className="space-y-2 text-sm">
          {settings?.email && (
            <li>
              <a href={`mailto:${settings.email}`} className="hover:underline">
                {settings.email}
              </a>
            </li>
          )}
          {settings?.phone && <li>{settings.phone}</li>}
          {settings?.address && (
            <li className="whitespace-pre-line">{settings.address}</li>
          )}
        </ul>
      </div>
    </Container>
  );
}
