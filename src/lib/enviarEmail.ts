import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

/**
 * Solicita o envio do e-mail de confirmação chamando a função Edge do Supabase
 * (que fala com o Brevo usando a chave secreta, no servidor).
 *
 * É "best-effort": se o e-mail falhar, a inscrição já foi gravada e o usuário
 * continua vendo a tela de sucesso.
 */
export async function enviarConfirmacao(nome: string, email: string): Promise<void> {
  try {
    await fetch(`${SUPABASE_URL}/functions/v1/enviar-confirmacao`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ nome, email }),
    });
  } catch {
    // silencioso: e-mail é complementar à inscrição
  }
}
