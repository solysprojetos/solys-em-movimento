-- Solys em Movimento — quadro de sugestões
-- Rode no Supabase: SQL Editor → New query → cole tudo → Run.

-- 1) Tabela de sugestões (nome completo + mensagem)
create table if not exists public.sugestoes_movimento (
  id uuid primary key default gen_random_uuid(),
  nome_completo text not null check (char_length(nome_completo) between 3 and 200),
  mensagem text not null check (char_length(mensagem) between 3 and 2000),
  created_at timestamptz not null default now()
);

alter table public.sugestoes_movimento enable row level security;

-- Qualquer visitante pode ENVIAR uma sugestão
drop policy if exists sugestoes_insert_publico on public.sugestoes_movimento;
create policy sugestoes_insert_publico on public.sugestoes_movimento
  for insert to anon, authenticated with check (true);

-- Só o administrador lê: reaproveita a mesma regra de leitura que já protege
-- a tabela de inscrições (o mesmo e-mail que entra no /painel).
drop policy if exists sugestoes_select_admin on public.sugestoes_movimento;
do $$
declare regra text;
begin
  select pg_get_expr(polqual, polrelid) into regra
  from pg_policy
  where polrelid = 'public.inscricoes_movimento'::regclass
    and polcmd in ('r', '*') and polqual is not null
  limit 1;
  if regra is null then
    raise exception 'Regra de leitura do admin não encontrada em inscricoes_movimento';
  end if;
  execute format(
    'create policy sugestoes_select_admin on public.sugestoes_movimento for select to authenticated using (%s)',
    regra
  );
end $$;

grant insert on public.sugestoes_movimento to anon, authenticated;
grant select on public.sugestoes_movimento to authenticated;

-- 2) Apaga as inscrições já feitas
-- (se quiser guardar uma cópia antes, exporte o CSV no painel antigo)
delete from public.inscricoes_movimento;
