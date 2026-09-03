import { asset } from "@/lib/asset";

export function SolysLogo({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset("/solys-logo.png")}
      alt="Solys — Gestão Administrativa"
      width={625}
      height={507}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={className}
    />
  );
}
