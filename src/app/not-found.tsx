import Link from "next/link";

import "./globals.css";

import { Container } from "@/components/Container";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

// Está fuera de (site) para cubrir también URLs que no existen, por eso
// incluye el header y el footer por su cuenta.
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Container className="py-24">
          <h1 className="text-2xl font-semibold">Página no encontrada</h1>
          <p className="mt-4 text-muted">
            La página que buscás no existe o fue movida.
          </p>
          <p className="mt-8">
            <Link href="/" className="underline underline-offset-4">
              Volver al inicio
            </Link>
          </p>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
