"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import { SUPABASE_TABLE } from "@/lib/config";
import { SolysLogo } from "./SolysLogo";
import { BrandHeader } from "./BrandHeader";

type Sugestao = {
  id: string;
  nome_completo: string;
  mensagem: string;
  created_at: string;
};

export function AdminPanel() {
  const supabase = getSupabaseBrowser();
  const [session, setSession] = useState<Session | null>(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCarregandoSessao(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  if (carregandoSessao) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-slate-400">
        Carregando...
      </div>
    );
  }

  return session ? (
    <Dashboard onSair={() => supabase.auth.signOut()} />
  ) : (
    <LoginForm />
  );
}

/* ----------------------- Login ----------------------- */

function LoginForm() {
  const supabase = getSupabaseBrowser();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setEnviando(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: senha,
    });
    setEnviando(false);
    if (error) {
      setErro("E-mail ou senha inválidos.");
    }
  }

  return (
    <div className="mx-auto w-full max-w-md animate-fade-up rounded-[28px] border border-white/10 bg-white shadow-card">
      <div className="h-1.5 rounded-t-[28px] bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600" />
      <div className="px-6 py-8 sm:px-10 sm:py-10">
        <header className="flex flex-col items-center text-center">
          <BrandHeader />
          <span className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-gold-600">
            Área restrita
          </span>
          <h1 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-navy-800">
            Painel de sugestões
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Acesso exclusivo da organização.
          </p>
        </header>

        <form onSubmit={onSubmit} className="mt-8 space-y-5 text-left">
          <div>
            <label
              htmlFor="admin-email"
              className="mb-2 block text-sm font-semibold text-navy-800"
            >
              E-mail
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-[15px] text-navy-900 outline-none transition placeholder:text-slate-400 focus:border-navy-600 focus:bg-white focus:ring-4 focus:ring-navy-600/15"
            />
          </div>
          <div>
            <label
              htmlFor="admin-senha"
              className="mb-2 block text-sm font-semibold text-navy-800"
            >
              Senha
            </label>
            <input
              id="admin-senha"
              type="password"
              autoComplete="current-password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-[15px] text-navy-900 outline-none transition placeholder:text-slate-400 focus:border-navy-600 focus:bg-white focus:ring-4 focus:ring-navy-600/15"
            />
          </div>

          {erro && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {erro}
            </div>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-4 text-[15px] font-bold uppercase tracking-wide text-navy-900 shadow-gold transition hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {enviando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ----------------------- Dashboard ----------------------- */

function Dashboard({ onSair }: { onSair: () => void }) {
  const supabase = getSupabaseBrowser();
  const [dados, setDados] = useState<Sugestao[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    const { data, error } = await supabase
      .from(SUPABASE_TABLE)
      .select("id,nome_completo,mensagem,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setErro("Não foi possível carregar as sugestões.");
      setCarregando(false);
      return;
    }
    setDados((data as Sugestao[]) ?? []);
    setCarregando(false);
  }, [supabase]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function exportarCSV() {
    if (!dados) return;
    const cab = ["Nome completo", "Mensagem", "Data"];
    const linhas = dados.map((d) => [
      d.nome_completo,
      d.mensagem,
      new Date(d.created_at).toLocaleString("pt-BR"),
    ]);
    const csv = [cab, ...linhas]
      .map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";"))
      .join("\n");
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sugestoes-solys-movimento.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const termo = busca.trim().toLowerCase();
  const visiveis = (dados ?? []).filter(
    (d) =>
      !termo ||
      d.nome_completo.toLowerCase().includes(termo) ||
      d.mensagem.toLowerCase().includes(termo),
  );

  return (
    <div className="mx-auto w-full max-w-4xl animate-fade-up">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white px-6 py-5 shadow-card">
        <div className="flex items-center gap-4">
          <SolysLogo priority className="h-11 w-auto" />
          <div className="hidden h-9 w-px bg-slate-200 sm:block" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
              Painel
            </p>
            <p className="font-display text-lg font-bold text-navy-800">
              Sugestões
            </p>
          </div>
        </div>
        <button
          onClick={onSair}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-navy-800 transition hover:bg-slate-50"
        >
          Sair
        </button>
      </div>

      <div className="mb-6 rounded-2xl border border-white/10 bg-gradient-to-br from-navy-700 to-navy-900 px-6 py-6 text-white shadow-card">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">
          Total de sugestões
        </p>
        <p className="mt-2 font-display text-4xl font-extrabold">
          {dados ? dados.length : "—"}
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white p-5 shadow-card sm:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome ou mensagem"
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-navy-900 outline-none transition placeholder:text-slate-400 focus:border-navy-600 focus:bg-white focus:ring-4 focus:ring-navy-600/15"
          />
          <button
            onClick={carregar}
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-navy-800 transition hover:bg-slate-50"
          >
            Atualizar
          </button>
          <button
            onClick={exportarCSV}
            disabled={!dados || dados.length === 0}
            className="rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 px-4 py-2.5 text-sm font-bold text-navy-900 transition hover:brightness-105 disabled:opacity-50"
          >
            Exportar CSV
          </button>
        </div>

        {erro && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {erro}
          </div>
        )}

        {carregando && !dados ? (
          <p className="py-10 text-center text-sm text-slate-400">Carregando...</p>
        ) : visiveis.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-400">
            {termo ? "Nenhuma sugestão encontrada." : "Nenhuma sugestão ainda."}
          </p>
        ) : (
          <ul className="space-y-3">
            {visiveis.map((d) => (
              <li
                key={d.id}
                className="rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-4"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold text-navy-800">{d.nome_completo}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(d.created_at).toLocaleString("pt-BR")}
                  </p>
                </div>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-600">
                  {d.mensagem}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
