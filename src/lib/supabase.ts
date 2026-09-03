import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase usado APENAS no servidor (route handler).
 *
 * Usamos a chave pública (anon). A segurança é garantida pelas políticas de
 * Row Level Security do banco: qualquer requisição pode INSERIR uma inscrição,
 * mas ninguém consegue LER a lista de inscritos sem estar autenticado como
 * administrador. Por isso nenhuma credencial privada é exposta.
 */
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const TABELA = process.env.SUPABASE_TABLE || "inscricoes_movimento";

export function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Variáveis de ambiente do Supabase não configuradas (SUPABASE_URL / SUPABASE_ANON_KEY).",
    );
  }
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
}
