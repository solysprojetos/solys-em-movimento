"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  inscricaoSchema,
  TAMANHOS,
  type InscricaoInput,
  type InscricaoData,
} from "@/lib/schema";
import { formatarTelefone } from "@/lib/format";
import { enviarInscricao } from "@/lib/inscrever";
import { enviarConfirmacao } from "@/lib/enviarEmail";
import { SolysLogo } from "./SolysLogo";
import { SizeGuideModal } from "./SizeGuideModal";

type Enviado = {
  nome: string;
  email: string;
  telefone: string;
  tamanho: string;
};

export function RegistrationCard() {
  const [guiaAberto, setGuiaAberto] = useState(false);
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<Enviado | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InscricaoInput, unknown, InscricaoData>({
    resolver: zodResolver(inscricaoSchema),
    mode: "onTouched",
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      tamanho: undefined,
      consentimento: false as unknown as true,
    },
  });

  async function onSubmit(dados: InscricaoData) {
    setErroGeral(null);
    const resultado = await enviarInscricao(dados);

    if (resultado.ok) {
      // Envia o e-mail de confirmação (best-effort, não bloqueia o sucesso)
      void enviarConfirmacao(dados.nome, dados.email);
      setSucesso({
        nome: dados.nome,
        email: dados.email,
        telefone: formatarTelefone(dados.telefone),
        tamanho: dados.tamanho,
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setErroGeral(resultado.message);
  }

  function novaInscricao() {
    reset();
    setSucesso(null);
    setErroGeral(null);
  }

  return (
    <>
      <div className="w-full max-w-xl animate-fade-up rounded-[28px] border border-white/10 bg-white shadow-card">
        {/* Faixa dourada superior */}
        <div className="h-1.5 rounded-t-[28px] bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600" />

        <div className="px-6 py-8 sm:px-10 sm:py-10">
          {/* Cabeçalho com a logo oficial */}
          <header className="flex flex-col items-center text-center">
            <SolysLogo priority className="h-16 w-auto sm:h-20" />
          </header>

          {sucesso ? (
            <SuccessState dados={sucesso} onNova={novaInscricao} />
          ) : (
            <>
              <div className="mt-7 text-center">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-600">
                  Inscrição
                </span>
                <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight text-navy-800 sm:text-4xl">
                  Solys em Movimento
                </h1>
                <p className="mt-3 text-[15px] leading-relaxed text-slate-500">
                  Preencha seus dados abaixo para confirmar sua participação.
                </p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="mt-8 space-y-5 text-left"
              >
                <Field
                  label="Nome completo"
                  htmlFor="nome"
                  error={errors.nome?.message}
                >
                  <input
                    id="nome"
                    type="text"
                    autoComplete="name"
                    placeholder="Seu nome completo"
                    aria-invalid={!!errors.nome}
                    className={inputClass(!!errors.nome)}
                    {...register("nome")}
                  />
                </Field>

                <Field
                  label="E-mail"
                  htmlFor="email"
                  error={errors.email?.message}
                >
                  <input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="voce@email.com"
                    aria-invalid={!!errors.email}
                    className={inputClass(!!errors.email)}
                    {...register("email")}
                  />
                </Field>

                <Field
                  label="Telefone / WhatsApp"
                  htmlFor="telefone"
                  error={errors.telefone?.message}
                  hint="Usamos apenas para avisos sobre o evento."
                >
                  <Controller
                    control={control}
                    name="telefone"
                    render={({ field }) => (
                      <input
                        id="telefone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        placeholder="(85) 99999-9999"
                        aria-invalid={!!errors.telefone}
                        className={inputClass(!!errors.telefone)}
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(formatarTelefone(e.target.value))
                        }
                        onBlur={field.onBlur}
                      />
                    )}
                  />
                </Field>

                {/* Tamanho da camisa */}
                <Controller
                  control={control}
                  name="tamanho"
                  render={({ field }) => (
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-navy-800">
                          Tamanho da camisa
                        </span>
                        <button
                          type="button"
                          onClick={() => setGuiaAberto(true)}
                          className="text-xs font-semibold text-gold-600 underline-offset-2 hover:underline"
                        >
                          Ver tabela de medidas
                        </button>
                      </div>
                      <div
                        role="radiogroup"
                        aria-label="Tamanho da camisa"
                        className="grid grid-cols-4 gap-2"
                      >
                        {TAMANHOS.map((t) => {
                          const ativo = field.value === t;
                          return (
                            <button
                              key={t}
                              type="button"
                              role="radio"
                              aria-checked={ativo}
                              onClick={() =>
                                setValue("tamanho", t, {
                                  shouldValidate: true,
                                  shouldTouch: true,
                                })
                              }
                              className={sizeClass(ativo)}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>
                      {errors.tamanho?.message && (
                        <p className="mt-2 text-xs font-medium text-red-500">
                          {errors.tamanho.message}
                        </p>
                      )}
                    </div>
                  )}
                />

                {/* Consentimento */}
                <div>
                  <label
                    htmlFor="consentimento"
                    className="flex cursor-pointer items-start gap-3 text-[13px] leading-relaxed text-slate-500"
                  >
                    <input
                      id="consentimento"
                      type="checkbox"
                      className="mt-0.5 h-[18px] w-[18px] flex-none rounded border-slate-300 accent-navy-700"
                      {...register("consentimento")}
                    />
                    <span>
                      Autorizo o uso dos meus dados exclusivamente para
                      organização e comunicação relacionadas ao evento Solys em
                      Movimento.
                    </span>
                  </label>
                  {errors.consentimento?.message && (
                    <p className="mt-2 text-xs font-medium text-red-500">
                      {errors.consentimento.message}
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
                  {isSubmitting ? (
                    <>
                      <Spinner /> Confirmando inscrição...
                    </>
                  ) : (
                    "Confirmar inscrição"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {guiaAberto && <SizeGuideModal onClose={() => setGuiaAberto(false)} />}
    </>
  );
}

/* ---------------- subcomponentes ---------------- */

function Field({
  label,
  htmlFor,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-semibold text-navy-800"
      >
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
      )}
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}

function SuccessState({
  dados,
  onNova,
}: {
  dados: Enviado;
  onNova: () => void;
}) {
  return (
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
        Inscrição confirmada!
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-slate-500">
        Sua participação no Solys em Movimento foi registrada com sucesso. Em
        breve enviaremos mais informações por e-mail e WhatsApp.
      </p>

      <dl className="mx-auto mt-6 max-w-sm divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-slate-50/60 px-5 text-left text-sm">
        <Resumo termo="Nome" valor={dados.nome} />
        <Resumo termo="E-mail" valor={dados.email} />
        <Resumo termo="Telefone" valor={dados.telefone} />
        <Resumo termo="Camisa" valor={dados.tamanho} />
      </dl>

      <button
        type="button"
        onClick={onNova}
        className="mt-6 rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-navy-800 transition hover:bg-slate-50"
      >
        Fazer outra inscrição
      </button>
    </div>
  );
}

function Resumo({ termo, valor }: { termo: string; valor: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <dt className="text-slate-500">{termo}</dt>
      <dd className="break-all text-right font-semibold text-navy-800">
        {valor}
      </dd>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-90"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

/* ---------------- classes utilitárias ---------------- */

function inputClass(erro: boolean) {
  return [
    "w-full rounded-xl border bg-slate-50 px-4 py-3.5 text-[15px] text-navy-900 placeholder:text-slate-400",
    "transition outline-none focus:bg-white focus:ring-4",
    erro
      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
      : "border-slate-200 focus:border-navy-600 focus:ring-navy-600/15",
  ].join(" ");
}

function sizeClass(ativo: boolean) {
  return [
    "flex h-12 items-center justify-center rounded-xl text-sm font-bold transition",
    ativo
      ? "bg-navy-800 text-white ring-2 ring-gold-500 ring-offset-1"
      : "border border-slate-200 bg-white text-navy-700 hover:border-navy-400 hover:bg-slate-50",
  ].join(" ");
}
