import { Inter_Tight } from "next/font/google";

/**
 * Tipografía del sitio. next/font la descarga en el build y la sirve desde
 * el propio dominio (no hay pedidos a Google desde el navegador).
 */
export const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
});
