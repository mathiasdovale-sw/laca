import Link from "next/link";

/** Etiqueta chica en mayúsculas: “(EL ESTUDIO)”, “TELÉFONO”, “TIGRE · 2022”. */
export function Label({
  children,
  className = "",
  id,
  as: Tag = "p",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: "p" | "span" | "h2" | "h3" | "dt";
}) {
  return (
    <Tag
      id={id}
      className={`text-[0.6875rem] leading-snug tracking-[0.15em] uppercase ${className}`}
    >
      {children}
    </Tag>
  );
}

const pillClass =
  "inline-flex items-center gap-3 rounded-full border px-6 py-3 text-[0.6875rem] tracking-[0.15em] uppercase transition-colors";

const pillVariants = {
  dark: "border-foreground text-foreground hover:bg-foreground hover:text-background",
  light: "border-white text-white hover:bg-white hover:text-foreground",
};

/** Botón con borde redondeado y flecha: “VER PROYECTOS →”. */
export function PillLink({
  href,
  children,
  variant = "dark",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof pillVariants;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`${pillClass} ${pillVariants[variant]} ${className}`}
    >
      {children}
      <span aria-hidden="true">→</span>
    </Link>
  );
}

export function PillButton({
  children,
  variant = "dark",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof pillVariants;
}) {
  return (
    <button
      className={`${pillClass} ${pillVariants[variant]} disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
      <span aria-hidden="true">→</span>
    </button>
  );
}
