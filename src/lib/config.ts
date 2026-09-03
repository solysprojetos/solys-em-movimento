/**
 * Configuração pública do Supabase.
 *
 * A chave "anon" é PÚBLICA por natureza — ela só identifica o projeto. A
 * segurança vem das políticas de Row Level Security: qualquer visitante pode
 * INSERIR uma inscrição, mas ninguém consegue LER a lista de inscritos sem
 * estar autenticado como administrador. Por isso é seguro versioná-la.
 *
 * Pode ser sobrescrita em tempo de build por variáveis NEXT_PUBLIC_*.
 */
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://qozuvdhqhpzpreusvkkr.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvenV2ZGhxaHB6cHJldXN2a2tyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgzNDc2NTMsImV4cCI6MjEwMzkyMzY1M30.T--K-q8NEMyMnwe2zZEliE2fVGGC4gzR1CnGaXhBSco";

export const SUPABASE_TABLE =
  process.env.NEXT_PUBLIC_SUPABASE_TABLE || "inscricoes_movimento";
