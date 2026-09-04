import { EVENTO } from "@/lib/evento";

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-2 py-1 text-center">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-600">
        {label}
      </div>
      <div className="mt-1 text-[14px] font-semibold text-navy-800">{value}</div>
    </div>
  );
}

/** Data, horário e local do evento — layout limpo, sem molduras. */
export function EventInfo({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-col divide-y divide-slate-200 sm:flex-row sm:items-center sm:justify-center sm:divide-x sm:divide-y-0 ${className}`}
    >
      <div className="flex-1 py-2 sm:py-0">
        <Item label="Data" value={EVENTO.data} />
      </div>
      <div className="flex-1 py-2 sm:py-0">
        <Item
          label="Horário"
          value={`${EVENTO.horario} · chegue ${EVENTO.chegada}`}
        />
      </div>
      <div className="flex-1 py-2 sm:py-0">
        <Item label="Local" value={EVENTO.local} />
      </div>
    </div>
  );
}
