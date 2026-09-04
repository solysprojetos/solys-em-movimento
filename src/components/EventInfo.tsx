import { EVENTO } from "@/lib/evento";

/** Data, local e horário de início — texto centralizado, estilo limpo. */
export function EventInfo({ className = "" }: { className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <p className="text-[14.5px] leading-relaxed text-slate-600">
        <span className="font-semibold text-navy-800">{EVENTO.data}</span>
        <span className="text-slate-400"> · </span>
        <span className="font-semibold text-gold-600">{EVENTO.local}</span>
      </p>
      <p className="mt-1 text-[15px] font-bold text-navy-800">
        Início às {EVENTO.horario}
        <span className="font-medium text-slate-400">
          {" "}
          · chegue às {EVENTO.chegada}
        </span>
      </p>
    </div>
  );
}
