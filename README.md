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

## ☁️ Deploy na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório
   `solysprojetos/solys-em-movimento`.
2. A Vercel detecta o Next.js automaticamente (nenhuma configuração extra).
3. Em **Environment Variables**, adicione:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_TABLE` = `inscricoes_movimento`
4. **Deploy**. Cada push para `main` gera um novo deploy automático.
