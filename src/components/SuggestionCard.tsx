"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  sugestaoSchema,
  enviarSugestao,
  type SugestaoData,
} from "@/lib/sugestao";
import { BrandHeader } from "./BrandHeader";

export function SuggestionCard() {
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SugestaoData>({
    resolver: zodResolver(sugestaoSchema),
    mode: "onTouched",
    defaultValues: { nome: "", mensagem: "" },
  });

  async function onSubmit(dados: SugestaoData) {
    setErroGeral(null);
    const resultado = await enviarSugestao(dados);
    if (resultado.ok) {
      setEnviado(true);
      return;
    }
    setErroGeral(resultado.message);
  }

  function novaSugestao() {
    reset();
    setEnviado(false);
    setErroGeral(null);
  }

  return (
    <div className="w-full max-w-xl animate-fade-up rounded-[28px] border border-white/10 bg-white shadow-card">
      <div className="h-1.5 rounded-t-[28px] bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600" />

      <div className="px-6 py-8 sm:px-10 sm:py-10">
        <header className="flex flex-col items-center text-center">
          <BrandHeader />
        </header>

        {enviado ? (
          <div className="mt-6 animate-pop text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12.5l5.2 5.2L20 6.8" />
              </svg>
            </div>
            <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-navy-800">
              Obrigado pela sugestão!
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-slate-500">
              Sua mensagem foi enviada para a organização do Solys em
              Movimento.
            </p>
            <button
              type="button"
              onClick={novaSugestao}
              className="mt-6 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-navy-800 transition hover:bg-slate-50"
            >
              Enviar outra sugestão
            </button>
          </div>
        ) : (
          <>
            <div className="mt-7 text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-600">
                Sugestões
              </span>
              <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-navy-800 sm:text-3xl">
                Diga sua sugestão pro nosso próximo Solys em Movimento
              </h1>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="mt-8 space-y-5 text-left"
            >
              <div>
                <label
                  htmlFor="nome"
                  className="mb-2 block text-sm font-semibold text-navy-800"
                >
                  Nome completo
                </label>
                <input
                  id="nome"
                  type="text"
                  autoComplete="name"
                  placeholder="Seu nome completo"
                  aria-invalid={!!errors.nome}
                  className={inputClass(!!errors.nome)}
                  {...register("nome")}
                />
                {errors.nome?.message && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.nome.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="mensagem"
                  className="mb-2 block text-sm font-semibold text-navy-800"
                >
                  Mensagem
                </label>
                <textarea
                  id="mensagem"
                  rows={6}
                  maxLength={2000}
                  placeholder="Escreva aqui sua sugestão..."
                  aria-invalid={!!errors.mensagem}
                  className={`${inputClass(!!errors.mensagem)} resize-y`}
                  {...register("mensagem")}
                />
                {errors.mensagem?.message && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.mensagem.message}
                  </p>
                )}
              </div>

              {erroGeral && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {erroGeral}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-4 text-[15px] font-bold uppercase tracking-wide text-navy-900 shadow-gold transition hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Enviando..." : "Enviar sugestão"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function inputClass(erro: boolean) {
  return [
    "w-full rounded-xl border bg-slate-50 px-4 py-3.5 text-[15px] text-navy-900 placeholder:text-slate-400",
    "transition outline-none focus:bg-white focus:ring-4",
    erro
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-navy-600 focus:ring-navy-600/15",
  ].join(" ");
}
