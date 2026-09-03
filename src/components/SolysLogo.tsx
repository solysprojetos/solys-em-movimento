import Image from "next/image";

export function SolysLogo({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/solys-logo.png"
      alt="Solys — Gestão Administrativa"
      width={625}
      height={507}
      priority={priority}
      className={className}
    />
  );
}
