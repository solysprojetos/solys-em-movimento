import { asset } from "@/lib/asset";
import { SolysLogo } from "./SolysLogo";

/** Logo institucional Solys + símbolo "Solys em Movimento", lado a lado. */
export function BrandHeader({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-4 sm:gap-5 ${className}`}
    >
      <SolysLogo priority className="h-12 w-auto sm:h-14" />
      <span
        className="h-9 w-px bg-slate-200 sm:h-11"
        aria-hidden="true"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={asset("/solys-movimento-mark.png")}
        alt="Solys em Movimento"
        className="h-10 w-auto sm:h-12"
        decoding="async"
      />
    </div>
  );
}
