import { interTight } from "@/lib/fonts";

import { ContactSection } from "./ContactSection";
import { Footer } from "./Footer";
import { Header } from "./Header";

/** Estructura común del sitio: la usan el layout y la página 404. */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="top"
      className={`${interTight.variable} flex min-h-screen flex-col font-sans antialiased`}
    >
      <Header />
      <main className="flex-1">{children}</main>
      <ContactSection />
      <Footer />
    </div>
  );
}
