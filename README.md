# Solys em Movimento — Sugestões

Página única com um quadro: **"Diga sua sugestão pro nosso próximo Solys em
Movimento"** — o visitante informa o **nome completo** e a **mensagem**.

As sugestões são gravadas no **Supabase** (tabela `sugestoes_movimento`) e
lidas pela organização em **/painel** (login do administrador), com busca e
exportação em CSV.

Construída com **Next.js (App Router) + TypeScript + Tailwind CSS**, validação
com **React Hook Form + Zod**.

## 🔐 Banco de dados

Rode `supabase/sugestoes.sql` no SQL Editor do Supabase. Ele:

- cria a tabela `sugestoes_movimento` (`id`, `nome_completo`, `mensagem`,
  `created_at`) com **Row Level Security**: qualquer visitante pode enviar,
  só o administrador lê;
- apaga as inscrições antigas de `inscricoes_movimento`.

## 🚀 Rodando localmente

```bash
npm install
npm run dev     # http://localhost:3000
```

## ☁️ Publicação (GitHub Pages)

O site é **estático** (`output: "export"`) e publicado automaticamente pelo
GitHub Actions (`.github/workflows/deploy.yml`) a cada push. O envio da
sugestão vai direto do navegador para o Supabase usando a chave pública
(anon) — protegido por RLS.

- Domínio de produção: **https://solys.online** (arquivo `public/CNAME`)
- O `actions/configure-pages` calcula o *base path* automaticamente (raiz no
  domínio próprio; `/solys-em-movimento` no domínio do GitHub).

### Domínio próprio (`solys.online`)

1. No GitHub: **Settings → Pages → Custom domain** = `solys.online` → Save.
2. DNS no registrador do domínio (raiz/apex) — registros **A**:

   ```
   @  A  185.199.108.153
   @  A  185.199.109.153
   @  A  185.199.110.153
   @  A  185.199.111.153
   ```

   Opcional (IPv6) — registros **AAAA**:

   ```
   @  AAAA  2606:50c0:8000::153
   @  AAAA  2606:50c0:8001::153
   @  AAAA  2606:50c0:8002::153
   @  AAAA  2606:50c0:8003::153
   ```

   Recomendado — `www` redirecionando para a raiz:

   ```
   www  CNAME  solysprojetos.github.io
   ```

3. Após a propagação do DNS, marque **Enforce HTTPS** em Settings → Pages.
