import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

/**
 * Cliente Supabase para uso no navegador (login do admin e consultas).
 * A leitura das inscrições é protegida por RLS: só o e-mail administrador
 * autenticado consegue listar. A chave anon é pública por natureza.
 */
let client: SupabaseClient | null = null;

export function getSupabaseBrowser(): SupabaseClient {
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        storageKey: "solys-movimento-auth",
      },
    });
  }
  return client;
}
