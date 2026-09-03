"use client";

import { useEffect } from "react";

const MEDIDAS = [
  { tam: "PP", largura: "48 cm", altura: "66 cm" },
  { tam: "P", largura: "50 cm", altura: "69 cm" },
  { tam: "M", largura: "53 cm", altura: "72 cm" },
  { tam: "G", largura: "56 cm", altura: "74 cm" },
  { tam: "GG", largura: "59 cm", altura: "76 cm" },
  { tam: "XXG", largura: "62 cm", altura: "78 cm" },
  { tam: "XXXG", largura: "65 cm", altura: "80 cm" },
];

export function SizeGuideModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/70 p-0 backdrop-blur-sm sm:items-center sm:p-4 animate-fade-up"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-medidas"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl border border-slate-200 bg-white p-6 shadow-card sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3
            id="titulo-medidas"
            className="font-display text-lg font-bold text-navy-800"
          >
            Tabela de medidas
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="grid h-9 w-9 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-navy-800"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-navy-800">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Tamanho</th>
                <th className="px-4 py-2.5 font-semibold">Largura</th>
                <th className="px-4 py-2.5 font-semibold">Altura</th>
              </tr>
            </thead>
            <tbody className="text-slate-600">
              {MEDIDAS.map((m) => (
                <tr key={m.tam} className="border-t border-slate-100">
                  <td className="px-4 py-2.5 font-semibold text-navy-700">{m.tam}</td>
                  <td className="px-4 py-2.5">{m.largura}</td>
                  <td className="px-4 py-2.5">{m.altura}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Medidas aproximadas da camisa (tolerância de ±2 cm).
        </p>
      </div>
    </div>
  );
}
