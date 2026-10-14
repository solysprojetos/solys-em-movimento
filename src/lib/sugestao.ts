import { z } from "zod";
import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_TABLE } from "./config";

export const sugestaoSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "Informe seu nome completo.")
    .refine((v) => v.split(/\s+/).filter(Boolean).length >= 2, {
      message: "Informe nome e sobrenome.",
    })
    .transform((v) => v.replace(/\s+/g, " ")),

  mensagem: z
    .string()
    .trim()
    .min(3, "Escreva sua sugestão.")
    .max(2000, "Use no máximo 2000 caracteres."),
});

export type SugestaoData = z.output<typeof sugestaoSchema>;

/**
 * Envia a sugestão direto para o Supabase (REST) com a chave pública (anon).
 * A política de RLS permite INSERT por qualquer visitante; só o administrador
 * autenticado consegue ler.
 */
export async function enviarSugestao(
  dados: SugestaoData,
): Promise<{ ok: true } | { ok: false; message: string }> {
  try {
    const resp = await fetch(`${SUPABASE_URL}/rest/v1/${SUPABASE_TABLE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        nome_completo: dados.nome,
        mensagem: dados.mensagem,
      }),
    });
    if (resp.ok) return { ok: true };
    return {
      ok: false,
      message:
        "Não conseguimos enviar sua sugestão agora. Tente novamente em instantes.",
    };
  } catch {
    return {
      ok: false,
      message: "Falha de conexão. Verifique sua internet e tente novamente.",
    };
  }
}
