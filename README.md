# Solys em Movimento

Landing page e formulário de inscrição para o evento **Solys em Movimento**.
Site estático (HTML/CSS/JS), sem dependências de build, com backend serverless
no [Supabase](https://supabase.com).

## ✨ Funcionalidades

- Landing page responsiva com hero, benefícios, formulário e FAQ
- Formulário de inscrição com validação (nome, e-mail, telefone com máscara BR, tamanho de camisa)
- Envio direto para o Supabase via REST (`inscricoes_movimento`)
- Tela de confirmação com resumo da inscrição
- Acessibilidade (labels, `aria-*`, foco visível, `prefers-reduced-motion`)
- PWA-ready (manifest + ícone SVG)

## 📁 Estrutura

```
.
├── index.html                # marcação da página
├── manifest.webmanifest      # metadados PWA
├── robots.txt
├── assets/
│   ├── favicon.svg
│   ├── css/styles.css        # design system + estilos
│   └── js/
│       ├── config.js         # configuração do Supabase (anon key pública)
│       └── app.js            # validação, máscara, envio e UI
└── .github/workflows/deploy.yml   # deploy automático no GitHub Pages
```

## 🚀 Rodando localmente

Por ser um site estático, basta servir a pasta:

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

## 🌐 Publicação (GitHub Pages)

O deploy é automático via GitHub Actions a cada push na branch `main`.

Para ativar (uma única vez):

1. No repositório, acesse **Settings → Pages**.
2. Em **Build and deployment → Source**, selecione **GitHub Actions**.
3. Faça merge para `main` — o workflow `Deploy to GitHub Pages` publica o site.

A URL final será algo como
`https://solysprojetos.github.io/solys-em-movimento/`.

## 🔐 Sobre a chave do Supabase

A `anon key` é **pública por natureza** — ela apenas identifica o projeto.
A segurança vem das políticas de **Row Level Security (RLS)**: qualquer
visitante pode **inserir** uma inscrição, mas somente o admin autenticado
consegue **ler** os dados.

## 🛠️ Configuração

Edite `assets/js/config.js` para apontar para outro projeto/tabela do Supabase.
