import { EVENTO } from "@/lib/evento";

function Item({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-navy-800 text-gold-300">
        {icon}
      </span>
      <div className="leading-tight">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </div>
        <div className="text-[13.5px] font-semibold text-navy-800">{value}</div>
      </div>
    </div>
  );
}

/** Faixa com data, horário e local do evento. */
export function EventInfo({ className = "" }: { className?: string }) {
  return (
    <div
      className={`grid grid-cols-1 gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-3 ${className}`}
    >
      <Item
        label="Data"
        value={EVENTO.data}
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        }
      />
      <Item
        label="Horário"
        value={`${EVENTO.horario} · chegue ${EVENTO.chegada}`}
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        }
      />
      <Item
        label="Local"
        value={EVENTO.local}
        icon={
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        }
      />
    </div>
  );
}
