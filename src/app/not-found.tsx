import "./globals.css";

import { Container } from "@/components/Container";
import { SiteShell } from "@/components/SiteShell";
import { PillLink } from "@/components/ui";

// Está fuera de (site) para cubrir también URLs que no existen, por eso
// arma el header, el bloque de contacto y el footer por su cuenta.
export default function NotFound() {
  return (
    <SiteShell>
      <Container className="pt-10 pb-20 md:pt-16 md:pb-28">
        <h1 className="text-4xl tracking-tight md:text-5xl">
          Página no encontrada
        </h1>
        <p className="mt-4 text-muted">
          La página que buscás no existe o fue movida.
        </p>
        <PillLink href="/" className="mt-10">
          Volver al inicio
        </PillLink>
      </Container>
    </SiteShell>
  );
}
