/**
 * Layout raíz: compartido por el sitio y el Studio (/studio).
 * El header, el footer y los estilos del sitio están en (site)/layout.tsx
 * para que no interfieran con el Studio.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
