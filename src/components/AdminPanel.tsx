"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowser } from "@/lib/supabaseBrowser";
import { formatarTelefone } from "@/lib/format";
import { SolysLogo } from "./SolysLogo";
import { BrandHeader } from "./BrandHeader";

type Inscricao = {
  nome_completo: string;
  email: string;
  telefone: string;
  tamanho_camisa: string;
  created_at: string;
};

const TABELA = "inscricoes_movimento";

/* Presença e sorteio ficam salvos neste aparelho (localStorage). */
const CHAVE_PRESENCA = "solys-movimento-presenca";
const CHAVE_GANHADORES = "solys-movimento-ganhadores";

type Ganhador = { email: string; nome: string; hora: string };

function lerLocal<T>(chave: string, padrao: T): T {
  try {
    const v = localStorage.getItem(chave);
    return v ? (JSON.parse(v) as T) : padrao;
  } catch {
    return padrao;
  }
}

function salvarLocal(chave: string, valor: unknown) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    /* sem armazenamento disponível */
  }
}

const horaAgora = () =>
  new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

/** Inteiro aleatório em [0, max) sem viés, usando crypto quando disponível. */
function aleatorio(max: number): number {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const limite = Math.floor(0x100000000 / max) * max;
    const a = new Uint32Array(1);
    do crypto.getRandomValues(a);
    while (a[0] >= limite);
    return a[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function embaralhar<T>(lista: T[]): T[] {
  const a = lista.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = aleatorio(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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
            Painel de inscrições
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
  const [dados, setDados] = useState<Inscricao[] | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [presentes, setPresentes] = useState<Record<string, string>>({});
  const [ganhadores, setGanhadores] = useState<Ganhador[]>([]);

  useEffect(() => {
    setPresentes(lerLocal(CHAVE_PRESENCA, {}));
    setGanhadores(lerLocal(CHAVE_GANHADORES, []));
  }, []);

  function alternarPresenca(email: string) {
    setPresentes((atual) => {
      const novo = { ...atual };
      if (novo[email]) delete novo[email];
      else novo[email] = horaAgora();
      salvarLocal(CHAVE_PRESENCA, novo);
      return novo;
    });
  }

  function registrarGanhadores(novos: Ganhador[]) {
    setGanhadores((atual) => {
      const lista = [...atual, ...novos];
      salvarLocal(CHAVE_GANHADORES, lista);
      return lista;
    });
  }

  function limparGanhadores() {
    if (!confirm("Limpar a lista de ganhadores?")) return;
    setGanhadores([]);
    salvarLocal(CHAVE_GANHADORES, []);
  }

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    const { data, error, count } = await supabase
      .from(TABELA)
      .select("nome_completo,email,telefone,tamanho_camisa,created_at", {
        count: "exact",
      })
      .order("created_at", { ascending: false });

    if (error) {
      setErro("Não foi possível carregar as inscrições.");
      setCarregando(false);
      return;
    }
    setDados((data as Inscricao[]) ?? []);
    setTotal(count ?? (data ? data.length : 0));
    setCarregando(false);
  }, [supabase]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  function exportarCSV() {
    if (!dados) return;
    const cab = ["Nome completo", "E-mail", "Telefone", "Camisa", "Data", "Presença"];
    const linhas = dados.map((d) => [
      d.nome_completo,
      d.email,
      formatarTelefone(d.telefone),
      d.tamanho_camisa,
      new Date(d.created_at).toLocaleString("pt-BR"),
      presentes[d.email] ? `Veio (${presentes[d.email]})` : "",
    ]);
    const csv = [cab, ...linhas]
      .map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";"))
      .join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inscricoes-solys-movimento.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const qtdPresentes = dados
    ? dados.filter((d) => presentes[d.email]).length
    : 0;
  const termo = busca.trim().toLowerCase();
  const visiveis = dados
    ? dados
        .map((d, i) => ({ d, n: i + 1 }))
        .filter(
          ({ d }) =>
            !termo ||
            d.nome_completo.toLowerCase().includes(termo) ||
            d.email.toLowerCase().includes(termo),
        )
    : [];

  return (
    <div className="mx-auto w-full max-w-4xl animate-fade-up">
      {/* Cabeçalho */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white px-6 py-5 shadow-card">
        <div className="flex items-center gap-4">
          <SolysLogo priority className="h-11 w-auto" />
          <div className="hidden h-9 w-px bg-slate-200 sm:block" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
              Painel
            </p>
            <p className="font-display text-lg font-bold text-navy-800">
              Inscrições
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

      {/* Total */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-navy-700 to-navy-900 px-6 py-6 text-white shadow-card sm:col-span-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">
            Total de inscritos
          </p>
          <p className="mt-2 font-display text-5xl font-extrabold">
            {total ?? "—"}
          </p>
          <p className="mt-3 text-sm text-slate-300">
            <span className="font-bold text-emerald-300">{qtdPresentes}</span>{" "}
            {qtdPresentes === 1 ? "presente" : "presentes"}
          </p>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-6 shadow-card sm:col-span-2">
          <p className="text-sm text-slate-500">
            Lista completa das inscrições confirmadas no Solys em Movimento.
          </p>
          <div className="flex gap-2">
            <button
              onClick={carregar}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-navy-800 transition hover:bg-slate-50"
            >
              Atualizar
            </button>
            <button
              onClick={exportarCSV}
              disabled={!dados || dados.length === 0}
              className="rounded-lg bg-navy-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy-700 disabled:opacity-50"
            >
              Exportar CSV
            </button>
          </div>
        </div>
      </div>

      {/* Sorteio */}
      <Sorteio
        participantes={
          dados
            ? dados
                .filter((d) => presentes[d.email])
                .map((d) => ({ email: d.email, nome: d.nome_completo }))
            : []
        }
        ganhadores={ganhadores}
        onSorteados={registrarGanhadores}
        onLimpar={limparGanhadores}
      />

      {/* Busca */}
      <input
        type="search"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar nome ou e-mail"
        className="mb-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-[15px] text-navy-900 shadow-card outline-none placeholder:text-slate-400 focus:border-navy-600 focus:ring-4 focus:ring-navy-600/15"
      />

      {/* Tabela */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        {erro ? (
          <div className="px-6 py-10 text-center text-red-600">{erro}</div>
        ) : carregando ? (
          <div className="px-6 py-10 text-center text-slate-400">
            Carregando inscrições...
          </div>
        ) : dados && dados.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-slate-50 text-navy-800">
                <tr>
                  <th className="px-5 py-3 font-semibold">#</th>
                  <th className="px-5 py-3 font-semibold">Nome completo</th>
                  <th className="px-5 py-3 font-semibold">E-mail</th>
                  <th className="px-5 py-3 font-semibold">Telefone</th>
                  <th className="px-5 py-3 font-semibold">Camisa</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                {visiveis.map(({ d, n }) => (
                  <tr
                    key={d.email}
                    className={`border-t border-slate-100 ${presentes[d.email] ? "bg-emerald-50/60" : ""}`}
                  >
                    <td className="px-5 py-3 text-slate-400">{n}</td>
                    <td className="px-5 py-3 font-medium text-navy-800">
                      {d.nome_completo}
                      <div className="mt-2">
                        <BotaoPresenca
                          hora={presentes[d.email]}
                          onClick={() => alternarPresenca(d.email)}
                        />
                      </div>
                    </td>
                    <td className="px-5 py-3">{d.email}</td>
                    <td className="px-5 py-3">{formatarTelefone(d.telefone)}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex min-w-9 justify-center rounded-md bg-navy-800 px-2 py-1 text-xs font-bold text-white">
                        {d.tamanho_camisa}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visiveis.length === 0 && (
              <div className="px-6 py-8 text-center text-slate-400">
                Ninguém encontrado para “{busca}”.
              </div>
            )}
          </div>
        ) : (
          <div className="px-6 py-10 text-center text-slate-400">
            Nenhuma inscrição ainda.
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------- Presença ----------------------- */

function BotaoPresenca({
  hora,
  onClick,
}: {
  hora?: string;
  onClick: () => void;
}) {
  return hora ? (
    <button
      onClick={onClick}
      title="Toque para desfazer"
      className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-800 transition hover:bg-emerald-200"
    >
      ✓ Veio · {hora}
    </button>
  ) : (
    <button
      onClick={onClick}
      className="inline-flex items-center rounded-lg bg-gradient-to-r from-gold-500 to-gold-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-navy-900 shadow-gold transition hover:brightness-105 active:scale-[0.98]"
    >
      Confirmar presença
    </button>
  );
}

/* ----------------------- Sorteio ----------------------- */

type Participante = { email: string; nome: string };

function Sorteio({
  participantes,
  ganhadores,
  onSorteados,
  onLimpar,
}: {
  participantes: Participante[];
  ganhadores: Ganhador[];
  onSorteados: (g: Ganhador[]) => void;
  onLimpar: () => void;
}) {
  const [quantidade, setQuantidade] = useState(1);
  const [semRepetir, setSemRepetir] = useState(true);
  const [girando, setGirando] = useState(false);
  const [nomeRolando, setNomeRolando] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Participante[]>([]);

  const jaGanharam = new Set(ganhadores.map((g) => g.email));
  const elegiveis = semRepetir
    ? participantes.filter((p) => !jaGanharam.has(p.email))
    : participantes;

  function sortear() {
    if (girando || elegiveis.length === 0) return;
    const qtd = Math.max(1, Math.min(quantidade || 1, elegiveis.length));
    const escolhidos = embaralhar(elegiveis).slice(0, qtd);
    const pool = elegiveis;

    setGirando(true);
    setResultado([]);
    const inicio = performance.now();
    const duracao = 2500;
    let ultimo = 0;

    const girar = (t: number) => {
      const passou = t - inicio;
      if (t - ultimo > 50 + (passou / duracao) * 230) {
        ultimo = t;
        setNomeRolando(pool[aleatorio(pool.length)].nome);
      }
      if (passou < duracao) {
        requestAnimationFrame(girar);
        return;
      }
      const hora = horaAgora();
      setNomeRolando(null);
      setResultado(escolhidos);
      onSorteados(escolhidos.map((p) => ({ ...p, hora })));
      setGirando(false);
    };
    requestAnimationFrame(girar);
  }

  return (
    <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="h-1.5 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600" />
      <div className="px-6 py-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-display text-lg font-bold text-navy-800">
            Sorteio entre os presentes
          </p>
          <p className="text-sm text-slate-500">
            {elegiveis.length}{" "}
            {elegiveis.length === 1 ? "pessoa participando" : "pessoas participando"}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-navy-800">
          <label className="flex items-center gap-2">
            Ganhadores
            <input
              type="number"
              min={1}
              value={quantidade}
              onChange={(e) => setQuantidade(parseInt(e.target.value, 10) || 1)}
              className="w-20 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[15px] outline-none focus:border-navy-600"
            />
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={semRepetir}
              onChange={(e) => setSemRepetir(e.target.checked)}
              className="h-4 w-4 accent-navy-800"
            />
            Quem já ganhou não participa de novo
          </label>
        </div>

        <div className="mt-4 flex min-h-[110px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-5 text-center">
          {nomeRolando ? (
            <span className="font-display text-2xl font-bold text-slate-400">
              {nomeRolando}
            </span>
          ) : resultado.length > 0 ? (
            <ul className="space-y-1">
              {resultado.map((p) => (
                <li
                  key={p.email}
                  className="font-display text-2xl font-extrabold text-gold-600 sm:text-3xl"
                >
                  🎉 {p.nome}
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-sm text-slate-400">
              {participantes.length === 0
                ? "Confirme a presença das pessoas na lista abaixo."
                : elegiveis.length === 0
                  ? "Todos os presentes já foram sorteados."
                  : "Toque em Sortear."}
            </span>
          )}
        </div>

        <button
          onClick={sortear}
          disabled={girando || elegiveis.length === 0}
          className="mt-4 w-full rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 px-6 py-4 text-[15px] font-bold uppercase tracking-wide text-navy-900 shadow-gold transition hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {girando ? "Sorteando..." : "Sortear"}
        </button>

        {ganhadores.length > 0 && (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
                Ganhadores
              </p>
              <button
                onClick={onLimpar}
                className="text-xs text-slate-400 underline hover:text-slate-600"
              >
                Limpar
              </button>
            </div>
            <ol className="divide-y divide-dashed divide-slate-200 text-sm">
              {ganhadores.map((g, i) => (
                <li key={g.email + i} className="flex gap-3 py-2">
                  <span className="w-7 font-bold text-gold-600">{i + 1}º</span>
                  <span className="flex-1 font-medium text-navy-800">{g.nome}</span>
                  <span className="text-xs text-slate-400">{g.hora}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
