# Solys em Movimento — Inscrição

Aplicação web de inscrição para o evento **Solys em Movimento**.
Página única, focada em uma tarefa: preencher os dados, escolher o tamanho da
camisa, autorizar o uso dos dados e confirmar a participação.

Construída com **Next.js (App Router) + TypeScript + Tailwind CSS**, validação
com **React Hook Form + Zod** (no cliente e no servidor) e persistência no
**Supabase**.

## ✨ Funcionalidades

- Formulário de inscrição: nome, e-mail, telefone (máscara BR `(85) 99999-9999`)
  e tamanho da camisa (PP a XXXG) em botões de seleção única.
- Modal elegante com a **tabela de medidas**.
- Checkbox de **consentimento** obrigatório (LGPD).
- Validação profissional no **frontend e no backend** (mesmo schema Zod), com
  erros exibidos abaixo de cada campo — sem `alert()`.
- **Bloqueio de inscrições duplicadas** por e-mail e por telefone (índices
  únicos no banco); mensagem: _"Sua inscrição já foi realizada anteriormente."_
- Tela de **confirmação** com resumo da inscrição e a logo oficial da Solys.
- Identidade visual oficial: azul-marinho + dourado, com card institucional.
- **Responsivo** (mobile-first), acessível e sem rolagem horizontal.

## 📁 Estrutura

```
src/
├── app/
│   ├── api/inscricoes/route.ts   # endpoint POST (valida + grava no Supabase)
│   ├── globals.css               # base Tailwind + fundo institucional
│   ├── icon.svg                  # favicon (marca Solys)
│   ├── layout.tsx                # metadados, fontes, fundo
│   └── page.tsx                  # página da inscrição
├── components/
│   ├── RegistrationCard.tsx      # formulário + estados (envio/sucesso)
│   ├── SizeGuideModal.tsx        # tabela de medidas
│   └── SolysLogo.tsx             # logo oficial
└── lib/
    ├── format.ts                 # máscara de telefone
    ├── schema.ts                 # schema Zod (cliente + servidor)
    └── supabase.ts               # cliente Supabase (servidor)
public/                           # logos oficiais da Solys
```

## 🔐 Segurança e banco de dados

Tabela: `inscricoes_movimento`

| coluna          | tipo        |
|-----------------|-------------|
| id              | uuid (PK)   |
| nome_completo   | text        |
| email           | text        |
| telefone        | text        |
| tamanho_camisa  | text        |
| consentimento   | boolean     |
| created_at      | timestamptz |

- **Row Level Security ativado.** Qualquer visitante pode **inserir** uma
  inscrição, mas **ninguém consegue listar** as inscrições sem estar
  autenticado como administrador. Por isso nenhuma credencial privada é
  exposta — o app usa apenas a chave pública (anon).
- Índices únicos em `lower(email)` e `telefone` evitam duplicidade.
- `CHECK` garante que o tamanho da camisa é um valor válido.

## ⚙️ Configuração

Crie um arquivo `.env.local` (veja `.env.example`):

```
SUPABASE_URL=https://qozuvdhqhpzpreusvkkr.supabase.co
SUPABASE_ANON_KEY=<chave anon do projeto>
SUPABASE_TABLE=inscricoes_movimento
```

## 🚀 Rodando localmente

```bash
npm install
npm run dev     # http://localhost:3000
```

Build de produção:

```bash
npm run build
npm start
```

## ☁️ Publicação (GitHub Pages)

O site é **estático** (`output: "export"`) e publicado automaticamente pelo
GitHub Actions (`.github/workflows/deploy.yml`) a cada push. O envio da
inscrição vai direto do navegador para o Supabase usando a chave pública
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
