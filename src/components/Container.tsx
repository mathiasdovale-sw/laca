/** Márgenes laterales comunes a todas las secciones. */
export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`w-full px-5 md:px-10 ${className}`}>{children}</div>;
}
