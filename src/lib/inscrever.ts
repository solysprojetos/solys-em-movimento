import { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_TABLE } from "./config";
import type { InscricaoData } from "./schema";

export type ResultadoInscricao =
  | { ok: true }
  | { ok: false; code: "DUPLICADO" | "ERRO"; message: string };

/**
 * Envia a inscrição direto para o Supabase (REST).
 *
 * Usa apenas a chave pública (anon). A política de RLS permite INSERT por
 * qualquer visitante, mas não permite listar as inscrições. A unicidade de
 * e-mail e telefone é garantida por índices no banco: uma duplicata retorna
 * 409 (código 23505), tratado aqui como "já inscrito".
 */
export async function enviarInscricao(
  dados: InscricaoData,
): Promise<ResultadoInscricao> {
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
        email: dados.email,
        telefone: dados.telefone,
        tamanho_camisa: dados.tamanho,
        consentimento: dados.consentimento,
      }),
    });

    if (resp.ok) return { ok: true };

    // Duplicidade (índice único) -> 409 / 23505
    const texto = await resp.text().catch(() => "");
    if (resp.status === 409 || texto.includes("23505")) {
      return {
        ok: false,
        code: "DUPLICADO",
        message: "Sua inscrição já foi realizada anteriormente.",
      };
    }

    return {
      ok: false,
      code: "ERRO",
      message:
        "Não conseguimos registrar sua inscrição agora. Tente novamente em instantes.",
    };
  } catch {
    return {
      ok: false,
      code: "ERRO",
      message: "Falha de conexão. Verifique sua internet e tente novamente.",
    };
  }
}
